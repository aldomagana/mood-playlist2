require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const util = require('util');
const moodMap = require('./moodMap');
const spotify = require('./spotify');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/moodplaylist';
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/callback';

let db;
async function connectDB(){
  if (db) return db;
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db();
  console.log('Connected to MongoDB');
  return db;
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Debug endpoint: runs the create-playlist flow server-side and returns
// the Spotify API responses (recommendations, created playlist, add-tracks)
// This endpoint is temporary for debugging in deployed service.
app.get('/internal/debug-create/:spotify_id', async (req, res) => {
  const { spotify_id } = req.params;
  try {
    const db = await connectDB();
    const users = db.collection('users');
    const user = await users.findOne({ spotify_id });
    if (!user) return res.status(404).json({ error: 'user not found' });

    let accessToken = user.access_token;
    // refresh if expired
    if (!accessToken || (user.expires_at && Date.now() > user.expires_at - 60000)){
      const refreshed = await spotify.refreshAccessToken(user.refresh_token);
      if (refreshed?.access_token) {
        accessToken = refreshed.access_token;
        await users.updateOne({ spotify_id }, { $set: { access_token: accessToken, expires_at: Date.now() + (refreshed.expires_in || 3600) * 1000 } });
      }
    }

    // validate token by fetching profile
    let profileData = null;
    try {
      profileData = await spotify.getProfile(accessToken);
      console.log('DEBUG token profile:', { id: profileData.id, display_name: profileData.display_name });
    } catch (pe) {
      console.error('DEBUG token profile error:', pe?.response?.status, pe?.response?.data || pe?.message);
    }

    // choose a mood (first) for deterministic debug
    const moodKey = Object.keys(moodMap)[0] || 'happy';
    const mm = moodMap[moodKey] || moodMap['happy'];
    const seed_genres = (mm.genres || []).slice(0,5).join(',');

  let recs;
    try {
      recs = await spotify.getRecommendations(accessToken, { seed_genres, ...mm });
    } catch (e) {
      // if token invalid, try refreshing once
      if (e?.response?.status === 401 && user.refresh_token) {
        console.log('Access token invalid, refreshing...');
        const refreshed = await spotify.refreshAccessToken(user.refresh_token);
        if (refreshed?.access_token) {
          accessToken = refreshed.access_token;
          await users.updateOne({ spotify_id }, { $set: { access_token: accessToken, expires_at: Date.now() + (refreshed.expires_in || 3600) * 1000 } });
          recs = await spotify.getRecommendations(accessToken, { seed_genres, ...mm });
        } else {
          console.error('Refresh failed during debug endpoint:', e?.response?.data || e?.message);
          recs = null;
        }
      } else {
        // log and continue to fallback (do not throw) so we try search-based fallback below
        console.warn('Recommendations request failed (debug); proceeding to fallback search', e?.response?.status, e?.response?.data || e?.message);
        recs = null;
      }
    }
    // if recommendations are empty or invalid, try fallback: search top tracks by first seed genre
    if (!recs || !recs.tracks || !recs.tracks.length) {
      console.warn('No recommendations returned; attempting fallback search by genre', seed_genres);
      try {
        const genre = (mm.genres && mm.genres[0]) || 'pop';
        const searchResp = await spotify.searchTopTracksByGenre(accessToken, genre, 30);
        // searchResp.tracks.items contains tracks
        const items = (searchResp.tracks && searchResp.tracks.items) || [];
        recs = { tracks: items };
      } catch (se) {
        console.error('Fallback search failed', se?.response?.data || se?.message);
        return res.status(502).json({ error: 'no recommendations and fallback failed', details: se?.response?.data || se?.message });
      }
    }

  const trackUris = recs.tracks.slice(0,20).map(t => t.uri || t.track?.uri).filter(Boolean);
    if (!trackUris.length) return res.status(502).json({ error: 'no track uris', recs });

    // create playlist using /v1/me/playlists to avoid user id mismatch
    const createdResp = await axios.post('https://api.spotify.com/v1/me/playlists', { name: `DEBUG ${moodKey} playlist`, description: `DEBUG generated for ${moodKey}`, public: false }, { headers: { Authorization: `Bearer ${accessToken}` } });
    const created = createdResp.data;

  const added = await spotify.addTracksToPlaylist(accessToken, created.id, trackUris);
  // fetch playlist tracks to return the final state
  const playlistResp = await axios.get(`https://api.spotify.com/v1/playlists/${created.id}/tracks`, { headers: { Authorization: `Bearer ${accessToken}` } });
  return res.json({ recsCount: recs.tracks.length, recsSample: recs.tracks.slice(0,3).map(t=>({id:t.id,name:t.name,uri:t.uri})), created, added, playlistTracks: playlistResp.data });
  } catch (err) {
    const errBody = {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
      stack: err?.stack
    };
    console.error('DEBUG-create error:', util.inspect(errBody, { depth: 5 }));
    return res.status(500).json({ error: 'debug-create-failed', details: errBody });
  }
});

// Serve static client build (populated by Docker multi-stage build)
app.use(express.static(path.join(__dirname, 'public')));

// OAuth login: redirect to Spotify authorize
app.get('/api/login', (req, res) => {
  const scope = [
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-private',
    'user-read-email'
  ].join(' ');

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

// OAuth callback: exchange code, get user profile, persist tokens
app.get('/api/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('missing code');

  try {
    const db = await connectDB();
    const tokens = await spotify.exchangeCodeForToken(code);

    // fetch profile
    const profile = await spotify.getProfile(tokens.access_token);

    // upsert user tokens
    const users = db.collection('users');
    await users.updateOne({ spotify_id: profile.id }, { $set: {
      spotify_id: profile.id,
      display_name: profile.display_name,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000)
    } }, { upsert: true });

    // Redirect to root with spotify_id so client can reference the user
    res.redirect(`/?spotify_id=${profile.id}`);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'callback failed' });
  }
});

// Create playlist from mood for a stored user
app.post('/api/create-playlist', async (req, res) => {
  // expected: { mood: 'happy', spotify_id: '...' }
  const { mood, spotify_id } = req.body;
  if (!mood || !spotify_id) return res.status(400).json({ error: 'mood and spotify_id required' });

  try {
    const db = await connectDB();
    const users = db.collection('users');
    const user = await users.findOne({ spotify_id });
    if (!user) return res.status(404).json({ error: 'user not found' });

    // ensure access token is valid
    let accessToken = user.access_token;
    if (!accessToken || (user.expires_at && Date.now() > user.expires_at - 60000)){
      // refresh
      const refreshed = await spotify.refreshAccessToken(user.refresh_token);
      accessToken = refreshed.access_token;
      await users.updateOne({ spotify_id }, { $set: {
        access_token: refreshed.access_token,
        expires_at: Date.now() + (refreshed.expires_in * 1000)
      }});
    }

    // build recommendation query from moodMap
    const mm = moodMap[mood] || moodMap['happy'];
    const seed_genres = (mm.genres || []).slice(0,5).join(',');
    let recs;
    try {
      recs = await spotify.getRecommendations(accessToken, { seed_genres, ...mm });
    } catch (e) {
      if (e?.response?.status === 401 && user.refresh_token) {
        const refreshed = await spotify.refreshAccessToken(user.refresh_token);
        if (refreshed?.access_token) {
          accessToken = refreshed.access_token;
          await users.updateOne({ spotify_id }, { $set: { access_token: accessToken, expires_at: Date.now() + (refreshed.expires_in || 3600) * 1000 } });
          recs = await spotify.getRecommendations(accessToken, { seed_genres, ...mm });
        }
      } else {
        console.warn('Recommendation call failed, will try fallback search', e?.response?.data || e?.message);
      }
    }

    if (!recs || !recs.tracks || !recs.tracks.length) {
      // fallback to search by seed genre
      try {
        const genre = (mm.genres && mm.genres[0]) || 'pop';
        const searchResp = await spotify.searchTopTracksByGenre(accessToken, genre, 30);
        recs = { tracks: (searchResp.tracks && searchResp.tracks.items) || [] };
      } catch (se) {
        console.error('Fallback search failed', se?.response?.data || se?.message);
        return res.status(502).json({ error: 'no recommendations and fallback failed', details: se?.response?.data || se?.message });
      }
    }

    const trackUris = recs.tracks.slice(0,30).map(t => t.uri || t.track?.uri).filter(Boolean);

    // create playlist
  const playlist = await spotify.createPlaylist(accessToken, user.spotify_id, `Mood: ${mood} — generated`, `Generated by Mood Playlist for mood ${mood}`);
  const addedResp = await spotify.addTracksToPlaylist(accessToken, playlist.id, trackUris);
  const playlistTracksResp = await axios.get(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, { headers: { Authorization: `Bearer ${accessToken}` } });
  res.json({ ok: true, playlist, added: addedResp, playlistTracks: playlistTracksResp.data });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'create playlist failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  try { await connectDB(); } catch (e){ console.warn('MongoDB not available at start:', e.message); }
  console.log(`Server listening on ${port}`);
});
