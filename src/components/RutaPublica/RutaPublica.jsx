import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LinearProgress from "@mui/material/LinearProgress";

export const RutaPublica = ({ children }) => {
    const { user, checking } = useAuth();

    if (checking) return <LinearProgress color="secondary" sx={{ height: 4, borderRadius: 2 }} />;
    if (user) return <Navigate to="/" />;

    return children;
};