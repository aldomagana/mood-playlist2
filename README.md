# Mood Playlist

This repository contains a MERN-style application that lets users create Spotify playlists from pre-selected moods using the Spotify Web API. The app includes a Node/Express backend that handles OAuth with Spotify and a React frontend for selecting moods and creating playlists. The project was containerized and deployed to Google Cloud Run during development.

## Features
- Login with Spotify (Authorization Code flow)
- Create playlists using predefined mood -> genres/audio-target maps
- Uses Spotify Recommendations API with a search-based fallback when needed
# Mood Playlist

Description
-----------
Mood Playlist converts a user's mood into a Spotify playlist using the Spotify Web API. Choose a mood, log in with Spotify, and the app builds a curated playlist using seeded genres, audio-feature targets, and fallback logic (artist top-tracks and genre search) so moods with sparse recommendations still produce music.

Features
--------
- One-click Spotify login (Authorization Code flow)
- Predefined moods mapped to curated genre seeds and audio-feature targets
- Robust playlist generation with fallbacks (artist top-tracks, genre search), dedupe and shuffle
- Simple React UI with Home, Login, and Dashboard pages
- Server-side playlist logic and token management (Express + MongoDB)
- Containerized (Docker) and deployable to Google Cloud Run

How to access the website
-------------------------
- The app is deployed to Google Cloud Run. Example service URL:
  - https://mood-playlist-service-669667445766.us-central1.run.app
- To create playlists users must login with Spotify and consent to the app. The Spotify app must list the exact redirect URI that your deployment uses, for example:
  - https://mood-playlist-service-669667445766.us-central1.run.app/api/callback

Tech stack
----------
- Frontend: React (Create React App), React Router
- Backend: Node.js, Express
- Database: MongoDB (Atlas) for token/user storage
- Auth: Spotify Authorization Code flow
- Containerization: Docker multi-stage build
- CI/CD: GitHub Actions + Google Cloud Build + Cloud Run

Notes
-----
- Keep secrets (Google service account, Mongo URI, Spotify client secret) out of the repo — use environment variables or secret managers.
- Remove any `/internal/debug-*` endpoints before exposing to production.

If you'd like, I can also add a minimal README for `server/` and `client/` with local dev commands and/or scaffold a small test suite.
