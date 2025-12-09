import React from 'react';

export default function Home(){
  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h1>Mood Playlist</h1>
      <p>This app creates Spotify playlists from pre-selected moods. Login with Spotify, pick a mood, and the app will create a playlist for you.</p>
      <p>Pages:
        <ul>
          <li>Home — this page</li>
          <li>Login — authorize with Spotify</li>
          <li>Dashboard — select mood and create a playlist</li>
        </ul>
      </p>
    </div>
  )
}
