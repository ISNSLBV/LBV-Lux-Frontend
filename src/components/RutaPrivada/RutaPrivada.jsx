import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function RutaPrivada({ roles = [] }) {
    const { user, checking } = useAuth();

    if (checking) return <div className="spinner">Cargando…</div>;

    if (!user) return <Navigate to="/login" replace />;

    if (roles.length && !roles.some(r => user.roles.includes(r))) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}