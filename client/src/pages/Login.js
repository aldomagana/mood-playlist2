import React from 'react';
import { useAuth } from '../auth';

export default function Login(){
  const { spotifyId } = useAuth();

  const login = () => {
    window.location.href = '/api/login';
  }

  if (spotifyId) {
    return (
      <div style={{padding:20,fontFamily:'Arial'}}>
        <h2>Already logged in</h2>
        <p>You are logged in with Spotify. Go to the Dashboard to create playlists.</p>
      </div>
    );
  }

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h2>Login with Spotify</h2>
      <p>Click the button below to sign in with your Spotify account and grant playlist permissions.</p>
      <button onClick={login} style={{padding:10}}>Login with Spotify</button>
    </div>
  )
}
