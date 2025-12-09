import React from "react";
import "../home.css";

export default function Home() {
  return (
    <div className="homepage">

      

      {/* 3-SECTION FULLSCREEN LAYOUT */}
      <main className="home-sections">

        <section id="welcome" className="section">
          <div className="section-content">
            <h1>Welcome to Mood Playlist</h1>
            <p>
              Turn your mood into a Spotify playlist in seconds.  
              Choose your vibe, log in, and instantly create a custom playlist.
            </p>
          </div>
        </section>

        <section id="features" className="section">
          <div className="section-content">
            <h2>Features</h2>
            <ul>
              <li>One-click Spotify login</li>
              <li>Predefined moods mapped to curated audio features</li>
              <li>Smart playlist creation using Spotify Recommendations API</li>
              <li>Unique vibe every time with shuffle and dedupe logic</li>
              <li>Deploy-ready backend with CI/CD & Cloud Run</li>
            </ul>
          </div>
        </section>

        <section id="thanks" className="section">
          <div className="section-content">
            <h2>Thank You</h2>
            <p>
              Thanks for trying Mood Playlist.  
              We hope it helps you find the perfect soundtrack for every moment.
            </p>
          </div>
        </section>

      </main>

    </div>
  );
}
