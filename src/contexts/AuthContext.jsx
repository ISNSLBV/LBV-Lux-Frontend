import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        api.get('/api/auth/me')
        .then(r => setUser(r.data))
        .catch(() => setUser(null))
        .finally(() => setChecking(false));
    }, []);

    const logout = async () => {
        await api.post('/api/auth/logout');
        setUser(null);
        window.location.href = "/alumnos2025/login";
    }

  return (
    <AuthCtx.Provider value={{ user, checking, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);