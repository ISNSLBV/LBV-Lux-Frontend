import { createContext, useContext, useEffect } from "react";
import api from "../api/axios";
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation } from "react-router-dom";

const AuthCtx = createContext(null);

const fetchUser = async () => {
  const { data } = await api.get('/auth/me', {
    headers: { 'Cache-Control': 'no-cache' },
    params: { _: Date.now() }
  });
  return data;
}

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false
  })

  const refetchUser = async () => {
    await queryClient.invalidateQueries(['user']);
    return refetch();
  }

  useEffect (() => {
    refetch();
  }, [location.pathname]);

  const login = async (username, password) => {
    try {
      const { data } = await api.post("/auth/login", { username, password });
      return { success: true, roles: data.roles };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      queryClient.removeQueries(['user']);
    } finally {
      window.location.href = "/alumnos2025/login";
    }
  };

  return (
    <AuthCtx.Provider value={{ user, checking: isLoading, logout, login, refetchUser }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
