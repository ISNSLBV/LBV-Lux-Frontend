import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import styles from "./MisFinales.module.css";
import { CircularProgress } from "@mui/material";
import SearchBar from "../../../components/SearchBar/SearchBar";

const MisFinales = () => {
  const { idAlumno } = useParams();
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
  const [filtro, setFiltro] = useState("");

  // Carreras del usuario autenticado
  const { data: carreras, isLoading: isLoadingCarreras } = useQuery({
    queryKey: ["carrerasAlumno"],
    queryFn: async () => {
      const { data } = await api.get(`/admin/alumno/carreras`);
      return data;
    },
  });

  useEffect(() => {
    if (carreras && carreras.length > 0 && !carreraSeleccionada) {
      setCarreraSeleccionada(carreras[0].id);
    }
  }, [carreras, carreraSeleccionada]);

  const {
    data: finalesData,
    isLoading: isLoadingFinales,
    error,
  } = useQuery({
    queryKey: ["finalesAlumno", carreraSeleccionada],
    queryFn: async () => {
      const { data } = await api.get(
        `/carreras/${carreraSeleccionada}/finales`
      );
      return data;
    },
    enabled: !!carreraSeleccionada,
  });

  if (isLoadingCarreras || isLoadingFinales) {
    return <div className={styles.loadingContainer}><CircularProgress className={styles.loadingIndicator} /></div>;
  }

  if (error) {
    return <div>Error al cargar los finales.</div>;
  }

  // Filtrado por nombre de materia
  const filtrarPorNombre = (arr) =>
    arr?.filter((f) =>
      (f.nombre || "").toLowerCase().includes(filtro.toLowerCase())
    ) || [];

  const finalesAprobados = filtrarPorNombre(finalesData?.finalesAprobados || []);
  const finalesInscriptos = filtrarPorNombre(finalesData?.finalesInscriptos || []);
  const finalesDisponibles = filtrarPorNombre(finalesData?.finalesDisponibles || []);

  return (
    <div>
      <div className={styles.titulo}>
        <h2>Mis Finales</h2>
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

      <div className={styles.listaFinales}>
        <h3>Finales Aprobados</h3>
        {finalesAprobados.length > 0 ? (
          finalesAprobados.map((final) => (
            <div key={final.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>{final.nombre}</h4>
                <span>
                  <strong>Nota: {final.nota}</strong>
                </span>
              </div>
              <div className={styles.datosAdicionales}>
                <div>
                  <p>Fecha</p>
                  <p>
                    <strong>{final.fecha || "—"}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noFinales}>No hay finales aprobados.</p>
        )}

        <h3>Finales Inscriptos</h3>
        {finalesInscriptos.length > 0 ? (
          finalesInscriptos.map((final) => (
            <div key={final.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>{final.nombre}</h4>
                <span>
                  <strong>Fecha: {final.fecha || "A confirmar"}</strong>
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noFinales}>No hay finales inscriptos.</p>
        )}

        <h3>Finales Disponibles</h3>
        {finalesDisponibles.length > 0 ? (
          finalesDisponibles.map((final) => (
            <div key={final.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>{final.nombre}</h4>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noFinales}>No hay finales disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default MisFinales;
