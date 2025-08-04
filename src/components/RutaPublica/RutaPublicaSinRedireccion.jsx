import { useAuth } from "../../contexts/AuthContext";
import LinearProgress from "@mui/material/LinearProgress";

export const RutaPublicaSinRedireccion = ({ children }) => {
  const { checking } = useAuth();

  if (checking)
    return (
      <LinearProgress color="secondary" sx={{ height: 4, borderRadius: 2 }} />
    );
  return children;
};
