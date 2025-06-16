import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LinearProgress from "@mui/material/LinearProgress";

export default function RutaPrivada({ rol = [] }) {
    const { user, checking } = useAuth();

    if (checking) return <LinearProgress color="secondary" sx={{ height: 4, borderRadius: 2 }} />;

    if (!user) return <Navigate to="/login" replace />;

    if (rol.length && !rol.some(r => user.rol.includes(r))) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}