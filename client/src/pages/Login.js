import React from 'react';
import { useAuth } from '../auth';

export default function Login(){
  const { spotifyId } = useAuth();

  const login = () => { window.location.href = '/api/login'; }

  if (spotifyId) {
    return (
      <div className="card app">
        <h2 className="page-title">Already logged in</h2>
        <p className="muted">You are logged in with Spotify. Go to the Dashboard to create playlists.</p>
      </div>
    );
  }

  return (
    <div className="card app">
      <h2 className="page-title">Login with Spotify</h2>
      <p className="muted">Click the button below to sign in with your Spotify account and grant playlist permissions.</p>
      <div style={{marginTop:14}}>
        <button className="btn" onClick={login}>Login with Spotify</button>
      </div>
    </div>
  )
}
