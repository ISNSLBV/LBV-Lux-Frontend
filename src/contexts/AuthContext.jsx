import { createContext, useContext, useEffect } from "react";
import api from "../api/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthCtx = createContext(null);

const fetchUser = async () => {
  const { data } = await api.get("/auth/me", {
    headers: { "Cache-Control": "no-cache" },
    params: { _: Date.now() },
  });
  return data;
};

const fetchEstadoCarreras = async () => {
  try {
    const { data } = await api.get("/usuario/verificar-estado-carreras");
    return data;
  } catch (error) {
    return {
      puedeAcceder: false,
      todasInactivas: true,
      carrerasActivas: [],
      carrerasInactivas: [],
      totalCarreras: 0
    };
  }
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });

  const {
    data: estadoCarreras,
    isLoading: isLoadingEstado,
    refetch: refetchEstado,
  } = useQuery({
    queryKey: ["estadoCarreras"],
    queryFn: fetchEstadoCarreras,
    enabled: !!user && user.rol === "Alumno",
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });

  const refetchUser = async () => {
    await queryClient.invalidateQueries(["user"]);
    await queryClient.invalidateQueries(["estadoCarreras"]);
    const result = await refetch();
    await refetchEstado();
    return result;
  };

  useEffect(() => {
    refetch();
    if (user?.rol === "Alumno") {
      refetchEstado();
    }
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
      queryClient.removeQueries(["user"]);
    } finally {
      window.location.href = "/login";
    }
  };

  const needsRoleSelection = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
    if (!token) return false;
    try {
      const payload = jwtDecode(token);
      return payload.roles && Array.isArray(payload.roles) && !payload.rol;
    } catch {
      return false;
    }
  };

  return (
    <AuthCtx.Provider
      value={{ 
        user, 
        checking: isLoading || isLoadingEstado, 
        logout, 
        login, 
        refetchUser, 
        needsRoleSelection,
        estadoCarreras
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
