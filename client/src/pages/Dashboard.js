import React, {useState} from 'react';
import { useAuth } from '../auth';

const MOODS = ['happy','sad','chill','energetic','romantic'];

export default function Dashboard(){
  const [mood, setMood] = useState('happy');
  const [result, setResult] = useState(null);
  const { spotifyId } = useAuth();

  const create = async () => {
    if(!spotifyId){
      setResult({ error: 'not logged in: please login with Spotify first' });
      return;
    }
    try {
      const res = await fetch('/api/create-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, spotify_id: spotifyId })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message || 'request failed' });
    }
  }

  return (
    <div className="app">
      <div className="card">
        <h2 className="page-title">Dashboard</h2>
        <p className="muted">Pick a mood and create a Spotify playlist.</p>

        <div className="mood-bar">
          {MOODS.map(m=> (
            <button key={m} onClick={()=>setMood(m)} className={`mood-btn ${m===mood? 'active':''}`}>{m}</button>
          ))}
        </div>

        <div style={{marginTop:18}}>
          <button className="btn" onClick={create}>Create Playlist</button>
          <button className="btn secondary" onClick={()=>setResult(null)} style={{marginLeft:8}}>Clear</button>
        </div>
      </div>

      {result && (
        <div className="card result">
          {result.error && <div style={{color:'crimson'}}>Error: {result.error}</div>}
          {result.playlist && (
            <div>
              <h3 style={{marginTop:0}}>{result.playlist.name}</h3>
              <div><a href={result.playlist.external_urls?.spotify} target="_blank" rel="noreferrer">Open in Spotify</a></div>
            </div>
          )}
          {result.playlistTracks && result.playlistTracks.items && (
            <div className="tracks">
              <h4>Tracks ({result.playlistTracks.total}):</h4>
              <ol>
                {result.playlistTracks.items.map((it, idx) => {
                  const t = it.track || it;
                  return <li key={t?.id || idx}>{t?.name} — {t?.artists?.map(a=>a.name).join(', ')}</li>
                })}
              </ol>
            </div>
          )}
        </div>
      )}

      <div className="footer">Built with Spotify API • Mood Playlist</div>
    </div>
  )
}
