const axios = require('axios');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

function basicAuthHeader(){
  return 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
}

async function exchangeCodeForToken(code){
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI
  });

  const res = await axios.post('https://accounts.spotify.com/api/token', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': basicAuthHeader()
    }
  });
  return res.data;
}

async function refreshAccessToken(refresh_token){
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token
  });
  const res = await axios.post('https://accounts.spotify.com/api/token', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': basicAuthHeader()
    }
  });
  return res.data;
}

async function getProfile(access_token){
  const res = await axios.get('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${access_token}` } });
  return res.data;
}

async function getRecommendations(access_token, opts){
  const params = new URLSearchParams();
  if (opts.seed_genres) params.set('seed_genres', opts.seed_genres);
  if (opts.target_valence) params.set('target_valence', opts.target_valence);
  if (opts.target_energy) params.set('target_energy', opts.target_energy);
  params.set('limit', '30');

  const url = 'https://api.spotify.com/v1/recommendations?' + params.toString();
  try {
    // log masked token and URL for debugging (do not log full token in prod)
    console.log('Spotify.recommendations req:', { url, authPreview: access_token ? access_token.slice(0,6) + '...' : null });
    const res = await axios.get(url, { headers: { Authorization: `Bearer ${access_token}` } });
    return res.data;
  } catch (err) {
    // log detailed error info for debugging
    console.error('Spotify.getRecommendations error:', {
      url,
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message
    });
    throw err;
  }
}

async function createPlaylist(access_token, user_id, name, description){
  const url = user_id ? `https://api.spotify.com/v1/users/${user_id}/playlists` : `https://api.spotify.com/v1/me/playlists`;
  const res = await axios.post(url, { name, description, public: false }, { headers: { Authorization: `Bearer ${access_token}` } });
  return res.data;
}

async function addTracksToPlaylist(access_token, playlist_id, uris){
  const res = await axios.post(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, { uris }, { headers: { Authorization: `Bearer ${access_token}` } });
  return res.data;
}

// Fallback: search top tracks by genre (Spotify search doesn't support genre alone, so use a query with genre: or popular artists)
async function searchTopTracksByGenre(access_token, genre, limit = 20){
  try {
    // First attempt: genre filter (may return empty as genre filter is limited)
    let q = `genre:\"${genre}\"`;
    let res = await axios.get('https://api.spotify.com/v1/search', { params: { q, type: 'track', limit }, headers: { Authorization: `Bearer ${access_token}` } });
    if (res && res.tracks && res.tracks.items && res.tracks.items.length) return res.data;

    // Second attempt: plain keyword search for the genre term
    q = `${genre}`;
    res = await axios.get('https://api.spotify.com/v1/search', { params: { q, type: 'track', limit }, headers: { Authorization: `Bearer ${access_token}` } });
    if (res && res.tracks && res.tracks.items && res.tracks.items.length) return res.data;

    // Third attempt: broaden the keyword (add 'love' for romantic-like genres, or 'music')
    q = `${genre} music`;
    res = await axios.get('https://api.spotify.com/v1/search', { params: { q, type: 'track', limit }, headers: { Authorization: `Bearer ${access_token}` } });
    return res.data;
  } catch (err) {
    console.error('Spotify.searchTopTracksByGenre error:', { genre, status: err?.response?.status, data: err?.response?.data, message: err?.message });
    throw err;
  }
}

module.exports = {
  exchangeCodeForToken,
  refreshAccessToken,
  getProfile,
  getRecommendations,
  createPlaylist,
  addTracksToPlaylist
};

// export search helper
module.exports.searchTopTracksByGenre = searchTopTracksByGenre;

// Get Spotify's list of available seed genres for recommendations
async function getAvailableGenreSeeds(access_token) {
  try {
    const headers = access_token ? { Authorization: `Bearer ${access_token}` } : {};
    const res = await axios.get('https://api.spotify.com/v1/recommendations/available-genre-seeds', { headers });
    return res.data.genres || [];
  } catch (err) {
    console.error('Spotify.getAvailableGenreSeeds error:', { status: err?.response?.status, data: err?.response?.data, message: err?.message });
    // Return empty array to let callers fallback gracefully
    return [];
  }
}

module.exports.getAvailableGenreSeeds = getAvailableGenreSeeds;
