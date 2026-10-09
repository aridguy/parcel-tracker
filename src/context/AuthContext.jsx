import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated } from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const sync = () => setLoggedIn(isAuthenticated());

    // Cross-tab (another tab logs in/out)
    window.addEventListener('storage', sync);

    // Same-tab (this tab calls saveAuth or logout)
    window.addEventListener('auth-change', sync);

    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('auth-change', sync);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}