import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './auth';

function ProtectedRoute({ children }){
  const { spotifyId } = useAuth();
  if (!spotifyId) return <Navigate to="/login" replace />;
  return children;
}

function Nav(){
  const { spotifyId, logout } = useAuth();
  return (
    <div className="topbar">
      <div className="brand">
        <div className="logo">MP</div>
        <div>
          <div style={{fontWeight:700}}>Mood Playlist</div>
          <div className="muted" style={{fontSize:12}}>Create playlists from moods</div>
        </div>
      </div>
      <div className="nav">
        <Link to="/">Home</Link>
        {!spotifyId && <Link to="/login">Login</Link>}
        <Link to="/dashboard">Dashboard</Link>
        {spotifyId && <button className="btn" onClick={logout} style={{marginLeft:12}}>Logout</button>}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Nav />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
