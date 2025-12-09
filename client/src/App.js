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
    <nav style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      <Link to="/">Home</Link>
      {!spotifyId && <Link to="/login">Login</Link>}
      <Link to="/dashboard">Dashboard</Link>
      {spotifyId && <button onClick={logout} style={{marginLeft:12}}>Logout</button>}
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ padding: 10, fontFamily: 'Arial' }}>
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
