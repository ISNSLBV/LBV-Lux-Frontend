import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import styles from "./MisFinales.module.css";
import { CircularProgress } from "@mui/material";
import SearchBar from "../../../components/SearchBar/SearchBar";
import { useAuth } from "../../../contexts/AuthContext";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";

const MisFinales = () => {
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
  const [filtro, setFiltro] = useState("");
  const { user } = useAuth();
  const idAlumno = user?.id;

  const { data: idPersonaData, isLoading: isLoadingPersona } = useQuery({
    queryKey: ["idPersona"],
    queryFn: async () => {
      const { data } = await api.get(`/usuario/obtener-id-persona`);
      return data;
    },
  });

  const idPersona = idPersonaData?.id_persona;

  const { data: carreras, isLoading: isLoadingCarreras } = useQuery({
    queryKey: ["carrerasAlumno", idPersona],
    queryFn: async () => {
      const { data } = await api.get(`/alumno/carreras`);
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
        `/alumno/carreras/${carreraSeleccionada}/finales`
      );
      return data;
    },
    enabled: !!carreraSeleccionada,
  });

  const finalesFiltrados = finales.filter((f) =>
    f.materia.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <BotonVolver />
      <div className={styles.titulo}>
        <h2>Mis Exámenes Finales</h2>
      </div>

      {carreras && carreras.length > 0 && (
        <>
          <div className={styles.barraAcciones}>
            <div className={styles.barraBusqueda}>
              <SearchBar
                placeholder="Buscar final"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>

          {carreras.length > 1 && (
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
          )}
        </>
      )}

      {isLoadingCarreras || isLoadingFinales || isLoadingPersona ? (
        <CircularProgress className={styles.loadingIndicator} />
      ) : error ? (
        <div>Error al cargar los finales.</div>
      ) : finalesFiltrados.length > 0 ? (
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
                      {final.correlativasAprobadas
                        ? "Aprobadas ✅"
                        : "Pendientes ❌"}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.mensaje}>
          <p className={styles.noFinales}>
            No estás inscripto a ningún examen final
          </p>
        </div>
      )}
    </div>
  );
};

export default MisFinales;
