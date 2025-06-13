// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios'; // instancia con withCredentials:true

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // golpe rápido para saber si hay cookie válida
        api.get('/api/auth/me')
        .then(r => setUser(r.data))           // { id, username, roles:[…] }
        .catch(() => setUser(null))
        .finally(() => setChecking(false));
    }, []);

    const logout = async () => {
        await api.post('/api/auth/logout');
        setUser(null);
    }

  return (
    <AuthCtx.Provider value={{ user, checking, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);