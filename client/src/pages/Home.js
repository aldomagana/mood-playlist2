import React from 'react';

export default function Home(){
  return (
    <div className="card app">
      <h1 className="page-title">Mood Playlist</h1>
      <p className="muted">Create Spotify playlists from pre-selected moods. Login with Spotify, pick a mood, and the app will generate a playlist for you.</p>

      <div style={{marginTop:18}} className="card">
        <h3 style={{marginTop:0}}>Getting started</h3>
        <ul>
          <li>Home — this page</li>
          <li>Login — authorize with Spotify</li>
          <li>Dashboard — select mood and create a playlist</li>
        </ul>
      </div>
    </div>
  )
}
