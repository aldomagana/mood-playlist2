import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [spotifyId, setSpotifyId] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    // pick up spotify_id from query params if present (redirect from server)
    try {
      const params = new URLSearchParams(window.location.search);
      const sid = params.get('spotify_id');
      if (sid) {
        // persist and remove from URL
        localStorage.setItem('spotify_id', sid);
        setSpotifyId(sid);
        params.delete('spotify_id');
        const base = window.location.pathname + (params.toString()?`?${params.toString()}`:'');
        window.history.replaceState({}, document.title, base);
        // if we're on /login or /, go to dashboard
        if (window.location.pathname === '/' || window.location.pathname === '/login') {
          navigate('/dashboard', { replace: true });
        }
        return;
      }
    } catch (e) {
      // ignore
    }

    // otherwise load from localStorage
    const stored = localStorage.getItem('spotify_id');
    if (stored) setSpotifyId(stored);
  }, [navigate]);

  const loginWithSpotifyId = (id) => {
    localStorage.setItem('spotify_id', id);
    setSpotifyId(id);
  }

  const logout = () => {
    localStorage.removeItem('spotify_id');
    setSpotifyId(null);
  }

  return (
    <AuthContext.Provider value={{ spotifyId, loginWithSpotifyId, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
  return useContext(AuthContext);
}

export default AuthContext;
