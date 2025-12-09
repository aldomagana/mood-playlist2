import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <header className="site-nav">
      <div className="app topbar" style={{margin:0, padding:'12px 28px'}}>
        <div className="brand">
          <Link to="/" style={{textDecoration:'none', color:'inherit', display:'flex', alignItems:'center', gap:12}}>
            <div className="logo" aria-hidden>MP</div>
            <div>
              <div style={{color:'white', fontWeight:700}}>Mood Playlist</div>
              <div style={{fontSize:12, color:'rgba(255,255,255,0.85)'}}>Create playlists from moods</div>
            </div>
          </Link>
        </div>

        <nav className="nav" style={{marginLeft:'auto'}}>
          <Link to="/dashboard">Dashboard</Link>
          {!spotifyId && <Link to="/login">Login</Link>}
          {spotifyId && <button className="btn" onClick={handleLogout} style={{marginLeft:12}}>Logout</button>}
        </nav>
      </div>
    </header>
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
