import React from 'react';

export default function Login(){
  const login = () => {
    window.location.href = '/api/login';
  }

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h2>Login with Spotify</h2>
      <p>Click the button below to sign in with your Spotify account and grant playlist permissions.</p>
      <button onClick={login} style={{padding:10}}>Login with Spotify</button>
    </div>
  )
}
