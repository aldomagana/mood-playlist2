import React, { useState } from 'react';
import { useAuth } from '../auth';

const MOODS = ['happy', 'sad', 'chill', 'energetic', 'romantic'];

export default function Dashboard() {
  const [mood, setMood] = useState('happy');
  const [result, setResult] = useState(null);
  const { spotifyId } = useAuth();

  const create = async () => {
    if (!spotifyId) {
      setResult({ error: 'Not logged in. Please log in with Spotify first.' });
      return;
    }
    try {
      const res = await fetch('/api/create-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, spotify_id: spotifyId }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message || 'Request failed' });
    }
  };

  return (
    <div className="dashboard">

      {/* Header */}
      <section className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Select a mood and generate a playlist that fits your vibe.</p>
      </section>

      {/* Mood Picker */}
      <section className="dashboard-section mood-section">
        <h2>Choose a Mood</h2>
        <div className="mood-tile-grid">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`mood-tile ${m === mood ? 'active' : ''}`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        <div className="dashboard-actions">
          <button className="btn" onClick={create}>Generate Playlist</button>
          <button className="btn secondary" onClick={() => setResult(null)}>Clear</button>
        </div>
      </section>

      {/* Results */}
      {result && (
        <section className="dashboard-section playlist-section">
          {result.error && (
            <div className="playlist-error">Error: {result.error}</div>
          )}

          {result.playlist && (
            <>
              <h2>{result.playlist.name}</h2>
              <a
                className="playlist-link"
                href={result.playlist.external_urls?.spotify}
                target="_blank"
                rel="noreferrer"
              >
                Open in Spotify →
              </a>
            </>
          )}

          {result.playlistTracks?.items && (
            <div className="track-list">
              <h3>Tracks ({result.playlistTracks.total})</h3>
              <ol>
                {result.playlistTracks.items.map((it, idx) => {
                  const t = it.track || it;
                  return (
                    <li key={t?.id || idx}>
                      <span className="track-name">{t?.name}</span>
                      <span className="track-artists">
                        {t?.artists?.map((a) => a.name).join(', ')}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </section>
      )}

      <div className="footer">Built with Spotify API • Mood Playlist</div>
    </div>
  );
}
