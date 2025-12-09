import React from "react";
import "./home.css";

export default function Home() {
  return (
    <div className="homepage">

      {/* NAVBAR */}
      <header className="site-nav">
        <div className="nav-inner">
          <a href="/" className="brand">
            <div className="logo">MP</div>
            <span className="brand-title">Mood Playlist</span>
          </a>

          <div className="nav-actions">
            <a href="/dashboard" className="nav-btn">Dashboard</a>
            <a href="/login" className="nav-btn login-btn">Login</a>
          </div>
        </div>
      </header>

      {/* FULLSCREEN SECTIONS */}
      <section id="welcome" className="full-section welcome-section">
        <div className="section-content">
          <h1>Welcome to Mood Playlist</h1>
          <p>
            Transform your mood into a Spotify playlist instantly.  
            Pick a vibe — get a playlist.
          </p>
        </div>
      </section>

      <section id="features" className="full-section features-section">
        <div className="section-content">
          <h1>Features</h1>
          <ul>
            <li>Instant Spotify login</li>
            <li>Curated moods + audio feature mapping</li>
            <li>Smart track selection with recommendations</li>
            <li>Unique playlists every time</li>
            <li>Cloud-hosted & fast</li>
          </ul>
        </div>
      </section>

      <section id="thanks" className="full-section thanks-section">
        <div className="section-content">
          <h1>Thank You</h1>
          <p>
            Thanks for trying Mood Playlist!  
            We hope your playlists match your vibe perfectly.
          </p>
        </div>
      </section>

    </div>
  );
}
