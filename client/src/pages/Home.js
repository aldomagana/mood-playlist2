import React from 'react';

export default function Home(){
  return (
    <div>
      <header className="site-nav">
        <div className="app topbar" style={{margin:0, padding:'12px 28px'}}>
          <div className="brand">
            <div className="logo" aria-hidden>MP</div>
            <div>
              <div style={{color:'white', fontWeight:700}}>Mood Playlist</div>
              <div style={{fontSize:12, color:'rgba(255,255,255,0.85)'}}>Create playlists from moods</div>
            </div>
          </div>
          <nav className="nav" style={{marginLeft:'auto'}}>
            <a href="#welcome">Welcome</a>
            <a href="#features">Features</a>
            <a href="#thanks">Thanks</a>
          </nav>
        </div>
      </header>

        <main className="app home-sections">
          <section id="welcome" className="card section">
            <h1 className="page-title">Welcome to Mood Playlist</h1>
            <p className="muted">Turn your mood into a Spotify playlist in seconds. Login with Spotify, choose a mood, and we'll build a playlist tailored to the vibe.</p>
          </section>

          <section id="features" className="card section">
            <h2 className="page-title">Features</h2>
            <ul>
              <li>One-click Spotify login and authorization</li>
              <li>Pre-defined moods mapped to curated genre seeds and audio features</li>
              <li>Smart track selection using recommendations, artist top-tracks, and search fallbacks</li>
              <li>Shuffle, jitter, and dedupe logic to ensure varied playlists every time</li>
              <li>Deployable container with CI/CD to Google Cloud Run</li>
            </ul>
          </section>

          <section id="thanks" className="card section">
            <h2 className="page-title">Thank you</h2>
            <p className="muted">Thanks for trying Mood Playlist. We hope this helps you set the perfect soundtrack for any mood. Feedback and contributions are welcome on GitHub.</p>
          </section>
        </main>
    </div>
  )
}
