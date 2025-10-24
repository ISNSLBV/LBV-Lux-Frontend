import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import styles from "./MisFinales.module.css";
import { CircularProgress } from "@mui/material";
import SearchBar from "../../../components/SearchBar/SearchBar";
import { useAuth } from "../../../contexts/AuthContext";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";

const MisFinales = () => {
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("todas");
  const [filtro, setFiltro] = useState("");
  const { user } = useAuth();

  // Traer los exámenes en los que está inscripto el alumno
  const {
    data: examenesData,
    isLoading: isLoadingFinales,
    error,
  } = useQuery({
    queryKey: ["examenesInscripto"],
    queryFn: async () => {
      const { data } = await api.get(`/alumno/examenes-inscripto`);
      return data;
    },
  });

  const finales = examenesData?.data || [];

  // Extraer carreras únicas de los exámenes
  const carrerasUnicas = finales.reduce((acc, examen) => {
    const carreraId = examen.carrera?.id;
    const carreraNombre = examen.carrera?.nombre;
    if (carreraId && !acc.find((c) => c.id === carreraId)) {
      acc.push({ id: carreraId, nombre: carreraNombre });
    }
    return acc;
  }, []);

  // Filtrar finales por carrera seleccionada y búsqueda
  const finalesFiltrados = finales.filter((examen) => {
    const matchCarrera =
      carreraSeleccionada === "todas" ||
      examen.carrera?.id === Number(carreraSeleccionada);
    const matchBusqueda =
      examen.materia?.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
      false;
    return matchCarrera && matchBusqueda;
  });

  return (
    <>
      <BotonVolver />
      <div className={styles.titulo}>
        <h2>Mis Exámenes Finales</h2>
      </div>

      {carrerasUnicas.length > 0 && (
        <div className={styles.barraAcciones}>
          <div className={styles.barraBusqueda}>
            <SearchBar
              placeholder="Buscar por materia"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          {carrerasUnicas.length > 1 && (
            <div className={styles.carreraSelector}>
              <label htmlFor="carrera-select">Filtrar por carrera:</label>
              <select
                id="carrera-select"
                value={carreraSeleccionada}
                onChange={(e) => setCarreraSeleccionada(e.target.value)}
              >
                <option value="todas">Todas las carreras</option>
                {carrerasUnicas.map((carrera) => (
                  <option key={carrera.id} value={carrera.id}>
                    {carrera.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {isLoadingFinales ? (
        <CircularProgress className={styles.loadingIndicator} />
      ) : error ? (
        <div className={styles.mensaje}>
          <p>Error al cargar los exámenes finales.</p>
        </div>
      ) : finalesFiltrados.length > 0 ? (
        <div className={styles.listaFinales}>
          {finalesFiltrados.map((examen, index) => {
            const profesorNombre = examen.profesor
              ? `${examen.profesor.nombre} ${examen.profesor.apellido}`
              : "No asignado";
            
            const fechaFormateada = examen.examenFinal?.fecha
              ? new Date(examen.examenFinal.fecha).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "A confirmar";

            return (
              <div
                key={`${examen.idInscripcion?.idExamenFinal}-${index}`}
                className={styles.card}
              >
                <div className={styles.cardHeader}>
                  <h3>{examen.materia?.nombre || "Sin nombre"}</h3>
                  <span className={styles.estadoBadge}>
                    {examen.examenFinal?.estado || "Pendiente"}
                  </span>
                </div>
                <div className={styles.datosAdicionales}>
                  <div>
                    <p>Carrera</p>
                    <p>
                      <strong>{examen.carrera?.nombre || "N/A"}</strong>
                    </p>
                  </div>
                  <div>
                    <p>Profesor</p>
                    <p>
                      <strong>{profesorNombre}</strong>
                    </p>
                  </div>
                  <div>
                    <p>Fecha</p>
                    <p>
                      <strong>{fechaFormateada}</strong>
                    </p>
                  </div>
                  <div>
                    <p>Estado Inscripción</p>
                    <p>
                      <strong>
                        {examen.inscripcionMateria?.estado || "N/A"}
                      </strong>
                    </p>
                  </div>
                  {examen.nota && (
                    <div>
                      <p>Nota</p>
                      <p>
                        <strong>{examen.nota}</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.mensaje}>
          <p className={styles.noFinales}>
            {filtro || carreraSeleccionada !== "todas"
              ? "No se encontraron exámenes con los filtros aplicados"
              : "No estás inscripto a ningún examen final"}
          </p>
        </div>
      )}
    </>
  );
};

export default MisFinales;
