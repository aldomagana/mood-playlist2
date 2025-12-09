# Mood Playlist

This repository contains a MERN-style application that lets users create Spotify playlists from pre-selected moods using the Spotify Web API. The app includes a Node/Express backend that handles OAuth with Spotify and a React frontend for selecting moods and creating playlists. The project was containerized and deployed to Google Cloud Run during development.

## Features
- Login with Spotify (Authorization Code flow)
- Create playlists using predefined mood -> genres/audio-target maps
- Uses Spotify Recommendations API with a search-based fallback when needed
- Stores user tokens in MongoDB Atlas
- Dockerized multi-stage build (React build copied into server `public`) and runnable as a single container

## Repo layout

- `server/` — Express backend, Spotify helpers, MongoDB connection, endpoints:
  - `/api/login` — redirect to Spotify authorization
  - `/api/callback` — OAuth callback, exchanges tokens, stores user in DB
  - `/api/create-playlist` — create playlist for mood
  - `/internal/debug-create/:spotify_id` — debug-only endpoint (remove for production)
- `client/` — React app (Create React App) used for UI
- `Dockerfile` — multi-stage Docker build used to build client and run the server
- `.env` — local environment variables (not checked in)

## Environment variables
Create a `.env` file (or use your cloud provider secret manager) with the following values:

- `PORT` — server port (defaults to 3000)
- `MONGO_URI` — MongoDB connection string (Atlas)
- `SPOTIFY_CLIENT_ID` — Spotify application client id
- `SPOTIFY_CLIENT_SECRET` — Spotify application client secret
- `SPOTIFY_REDIRECT_URI` — Spotify redirect (e.g., `https://your-domain.com/api/callback` or `http://localhost:3000/api/callback` when testing locally)

## Run locally (development)

1. Install dependencies for both server and client:

```bash
# from repo root
cd server && npm install
cd ../client && npm install
```

2. Start the server and client (in separate terminals):

```bash
# server
cd server
npm run dev   # or `node index.js`

# client
cd client
npm start
```

The client is configured to call the server endpoints. Use your Spotify app client id/secret and set the redirect URI in the Spotify Developer Dashboard to match `SPOTIFY_REDIRECT_URI`.

## Build and run with Docker

The project contains a multi-stage `Dockerfile` that builds the React client and copies the static build into the Express server's `public/` folder.

Build and run locally:

```bash
docker build -t mood-playlist:latest .
docker run -e MONGO_URI="$MONGO_URI" -e SPOTIFY_CLIENT_ID="$SPOTIFY_CLIENT_ID" -e SPOTIFY_CLIENT_SECRET="$SPOTIFY_CLIENT_SECRET" -p 3000:3000 mood-playlist:latest
```

## Deploy to Google Cloud Run

High-level steps used during development:

1. Build the container image and push to Container Registry or Artifact Registry.
2. Create or update a Cloud Run service pointing at the pushed image.
3. Provide secrets (Mongo URI, Spotify secret) via Secret Manager and map them into the Cloud Run service.

You can use `gcloud` to deploy:

```bash
# build and push (example)
gcloud builds submit --tag gcr.io/PROJECT_ID/mood-playlist

# deploy
gcloud run deploy mood-playlist --image gcr.io/PROJECT_ID/mood-playlist --platform managed --region us-central1 --allow-unauthenticated --set-secrets MONGO_URI=projects/PROJECT/secrets/MONGO_URI:latest,SPOTIFY_CLIENT_SECRET=projects/PROJECT/secrets/SPOTIFY_CLIENT_SECRET:latest
```

## Notes & next steps
- Remove or restrict the `/internal/debug-create/:spotify_id` endpoint before production.
- Consider adding better retry/backoff for Spotify token refresh and more robust error reporting.
- Add unit/integration tests for the backend endpoints.

If you want, I can push this repository to `https://github.com/aldomagana/mood-playlist2.git` for you — I attempted to prepare the README and will add it to the repo next.

---
Generated: README added by assistant automation.
# Mood Playlist (MERN)

Minimal MERN app to create Spotify playlists from selected moods. Includes Spotify OAuth (Authorization Code) and playlist creation endpoints. This repo is scaffolded with a Node/Express server and a React client.

See `server/README.md` and `client/README.md` for per-service instructions.
