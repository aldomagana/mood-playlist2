import React, {useState, useEffect} from 'react';

const MOODS = ['happy','sad','chill','energetic','romantic'];

export default function Dashboard(){
  const [mood, setMood] = useState('happy');
  const [result, setResult] = useState(null);
  const [spotifyId, setSpotifyId] = useState(null);

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('spotify_id');
    if(sid){
      setSpotifyId(sid);
      params.delete('spotify_id');
      const base = window.location.pathname + (params.toString()?`?${params.toString()}`:'');
      window.history.replaceState({}, document.title, base);
    }
  },[]);

  const create = async () => {
    if(!spotifyId){
      setResult({ error: 'not logged in: please login with Spotify first' });
      return;
    }
    const res = await fetch('/api/create-playlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, spotify_id: spotifyId })
    });
    const data = await res.json();
    setResult(data);
  }

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h2>Dashboard</h2>
      <p>Pick a mood and create a Spotify playlist.</p>
      <div>
        {MOODS.map(m=> (
          <button key={m} onClick={()=>setMood(m)} style={{margin:5, padding:10, background:m===mood?'#0070f3':'#eee'}}>{m}</button>
        ))}
      </div>
      <div style={{marginTop:20}}>
        <a href="/api/login" style={{marginRight:10}}>Login with Spotify</a>
        <button onClick={create}>Create Playlist</button>
      </div>

      {spotifyId && <div style={{marginTop:10}}>Logged in as: <strong>{spotifyId}</strong></div>}

      {result && (
        <div style={{marginTop:20, background:'#f7f7f7', padding:10}}>
          {result.error && <div style={{color:'red'}}>Error: {result.error}</div>}
          {result.playlist && (
            <div>
              <h3>{result.playlist.name}</h3>
              <div><a href={result.playlist.external_urls?.spotify} target="_blank" rel="noreferrer">Open in Spotify</a></div>
            </div>
          )}
          {result.playlistTracks && result.playlistTracks.items && (
            <div style={{marginTop:10}}>
              <h4>Tracks ({result.playlistTracks.total}):</h4>
              <ol>
                {result.playlistTracks.items.map((it, idx) => {
                  const t = it.track || it;
                  return <li key={t?.id || idx}>{t?.name} — {t?.artists?.map(a=>a.name).join(', ')}</li>
                })}
              </ol>
            </div>
          )}
          {!result.playlist && !result.error && <div>Created. Check the playlist link above.</div>}
        </div>
      )}
    </div>
  )
}
