import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";
import styles from "./MisMaterias.module.css";
import { CircularProgress } from "@mui/material";
import SearchBar from "../../../components/SearchBar/SearchBar"; 

const MisMaterias = () => {
  const { idAlumno } = useParams();
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
  const [filtro, setFiltro] = useState(""); 

  const { data: personaData, isLoading: isLoadingPersona } = useQuery({
    queryKey: ["persona", idAlumno],
    queryFn: async () => {
      const { data } = await api.get(`/usuario/perfil/${idAlumno}`);
      return data;
    },
  });

  const idPersona = personaData?.informacionPersonal?.id_persona;

  const { data: carreras, isLoading: isLoadingCarreras } = useQuery({
    queryKey: ["carrerasAlumno", idPersona],
    queryFn: async () => {
      const { data } = await api.get(`/usuario/inscripto/carreras/${idPersona}`);
      return data;
    },
    enabled: !!idPersona,
  });

  useEffect(() => {
    if (carreras && carreras.length > 0 && !carreraSeleccionada) {
      setCarreraSeleccionada(carreras[0].id);
    }
  }, [carreras, carreraSeleccionada]);

  const {
    data: materias = [],
    isLoading: isLoadingMaterias,
    error,
  } = useQuery({
    queryKey: ["materiasAlumno", idAlumno, carreraSeleccionada],
    queryFn: async () => {
      const { data } = await api.get(
        `/usuario/${idAlumno}/carreras/${carreraSeleccionada}/materias`
      );
      return data;
    },
    enabled: !!carreraSeleccionada,
  });

  if (isLoadingPersona || isLoadingCarreras || isLoadingMaterias) {
    return <CircularProgress className={styles.loadingIndicator} />;
  }

  if (error) {
    return <div>Error al cargar las materias.</div>;
  }

  
  const materiasFiltradas = materias.filter((m) =>
    m.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <div className={styles.titulo}>
        <h2>Mis Materias</h2>
      </div>

      {carreras && carreras.length > 0 && (
        <>
          <SearchBar className={styles.buscador}
            placeholder="Buscar materia"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          <div className={styles.carreraSelector}>
            <label htmlFor="carrera-select">Selecciona una carrera:</label>
            <select
              id="carrera-select"
              value={carreraSeleccionada || ""}
              onChange={(e) => setCarreraSeleccionada(e.target.value)}
            >
              {carreras.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {materiasFiltradas.length > 0 ? (
        <div className={styles.listaMaterias}>
          {materiasFiltradas.map((materia) => (
            <div key={materia.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{materia.nombre}</h3>
                <span>
                  <strong>Estado: {materia.estado}</strong>
                </span>
              </div>
              <div className={styles.datosAdicionales}>
                <div>
                  <p>Profesor</p>
                  <p>
                    <strong>{materia.profesor}</strong>
                  </p>
                </div>
                <div>
                  <p>Nota Final</p>
                  <p>
                    <strong>{materia.nota || "—"}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noMaterias}>
          No hay materias registradas para la carrera seleccionada.
        </p>
      )}
    </div>
  );
};

export default MisMaterias;
