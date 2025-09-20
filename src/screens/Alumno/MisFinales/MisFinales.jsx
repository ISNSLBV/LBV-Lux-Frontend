import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";
import styles from "./MisFinales.module.css";
import { CircularProgress } from "@mui/material";
import SearchBar from "../../../components/SearchBar/SearchBar";

const MisFinales = () => {
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

  // Traer finales disponibles (según materias aprobadas + correlativas)
  const {
    data: finales = [],
    isLoading: isLoadingFinales,
    error,
  } = useQuery({
    queryKey: ["finalesAlumno", idAlumno, carreraSeleccionada],
    queryFn: async () => {
      const { data } = await api.get(
        `/usuario/${idAlumno}/carreras/${carreraSeleccionada}/finales`
      );
      return data;
    },
    enabled: !!carreraSeleccionada,
  });

  if (isLoadingPersona || isLoadingCarreras || isLoadingFinales) {
    return <CircularProgress className={styles.loadingIndicator} />;
  }

  if (error) {
    return <div>Error al cargar los finales.</div>;
  }


  const finalesFiltrados = finales.filter((f) =>
    f.materia.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <div className={styles.titulo}>
        <h2>Mis Finales</h2>
      </div>

      {carreras && carreras.length > 0 && (
        <>
          <SearchBar
            className={styles.buscador}
            placeholder="Buscar final"
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

      {finalesFiltrados.length > 0 ? (
        <div className={styles.listaFinales}>
          {finalesFiltrados.map((final) => (
            <div key={final.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{final.materia}</h3>
                <span>
                  <strong>Estado Final: {final.estado}</strong>
                </span>
              </div>
              <div className={styles.datosAdicionales}>
                <div>
                  <p>Profesor</p>
                  <p>
                    <strong>{final.profesor}</strong>
                  </p>
                </div>
                <div>
                  <p>Fecha</p>
                  <p>
                    <strong>{final.fecha || "A confirmar"}</strong>
                  </p>
                </div>
                <div>
                  <p>Correlativas</p>
                  <p>
                    <strong>
                      {final.correlativasAprobadas ? "Aprobadas ✅" : "Pendientes ❌"}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noFinales}>
          No hay finales disponibles para la carrera seleccionada.
        </p>
      )}
    </div>
  );
};

export default MisFinales;
