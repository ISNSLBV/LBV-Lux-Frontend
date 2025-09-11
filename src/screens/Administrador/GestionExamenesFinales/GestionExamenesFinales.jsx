import React, { useState } from "react";
import styles from "./GestionExamenesFinales.module.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import SearchBar from "../../../components/SearchBar/SearchBar";
import Boton from "../../../components/Boton/Boton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { Plus } from "lucide-react";

const fetchExamenesFinales = async () => {
  const { data } = await api.get("");
  return data;
};

const GestionExamenesFinales = () => {
  const [filtro, setFiltro] = useState("");
  const [registro, setRegistro] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const {
    data: examenesFinales = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["examenesFinales"],
    queryFn: fetchExamenesFinales,
  });

  const registrarExamen = useMutation({
    mutationFn: ({ idMateriaPlan, fecha, idProfesor }) =>
      api.post("", {
        idMateriaPlan,
        fecha,
        idProfesor,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examenesFinales"] });
      toast.success("Examen registrado");
    },
    onError: () => toast.error("Error al registrar el examen"),
  });

  const examenesFiltrados = examenesFinales.filter((e) =>
    e.materiaPlanCiclo?.materiaPlan?.materia?.nombre
      ?.toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <div>
      <div className={styles.titulo}>
        {user.rol === "Administrador" ? (
          <>
            <h1>Examenes finales</h1>
            <p>Registrá y editá los examenes finales de las materias</p>
          </>
        ) : (
          <>
            <h1>Examenes finales asignados</h1>
            <p>Gestioná los examenes finales que te fueron asignados</p>
          </>
        )}
      </div>
      <div className={styles.barraAcciones}>
        <div className={styles.barraBusqueda}>
            <SearchBar 
                placeholder="Buscar examen final por materia..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />
        </div>
        {user.rol === "Administrador" && (
            <div className={styles.botonAgregar}>
                <Boton
                    variant="success"
                    icono={<Plus />}
                    onClick={() => setRegistro(true)}
                >
                    Registrar examen final
                </Boton>
            </div>
    )}
      </div>
    </div>
  );
};

export default GestionExamenesFinales;
