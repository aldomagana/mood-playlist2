import React from "react";
import "./home.css";

export default function Home() {
  return (
    <div className="homepage">

      {/* NAVBAR */}
      <header className="site-nav">
        <div className="nav-inner">
          
          {/* LOGO → Home */}
          <a href="/" className="brand">
            <div className="logo">MP</div>
            <span className="brand-title">Mood Playlist</span>
          </a>

          {/* RIGHT SIDE BUTTONS */}
          <div className="nav-actions">

            {/* DASHBOARD BUTTON */}
            <a href="/dashboard" className="nav-btn">
              Dashboard
            </a>

            {/* LOGIN (or replace with Logout when auth is added) */}
            <a href="/login" className="nav-btn login-btn">
              Login
            </a>

          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="content">

        <section id="welcome" className="section-card">
          <h1>Welcome to Mood Playlist</h1>
          <p>
            Turn your mood into a Spotify playlist in seconds. Login with Spotify, 
            choose a mood, and we'll build a playlist perfectly tailored to your vibe.
          </p>
        </section>

        <section id="features" className="section-card">
          <h2>Features</h2>
          <ul>
            <li>One-click Spotify login and authorization</li>
            <li>Curated moods mapped to audio features + genre seeds</li>
            <li>Smart track selection with recommendations + fallbacks</li>
            <li>Unique playlists every time using shuffle + dedupe logic</li>
            <li>Fully deployable container with CI/CD on Cloud Run</li>
          </ul>
        </section>

        <section id="thanks" className="section-card">
          <h2>Thank You</h2>
          <p>
            Thanks for trying Mood Playlist! We hope this app helps you set the perfect 
            soundtrack for any mood. Feedback and contributions are always welcome.
          </p>
        </section>

      </main>

    </div>
  );
}
