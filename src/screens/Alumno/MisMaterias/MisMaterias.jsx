import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import styles from "./MisMaterias.module.css";
import { CircularProgress } from "@mui/material";
import SearchBar from "../../../components/SearchBar/SearchBar";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";

const MisMaterias = () => {
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
  const [filtro, setFiltro] = useState("");

  const { data: carreras, isLoading: isLoadingCarreras } = useQuery({
    queryKey: ["carrerasAlumno"],
    queryFn: async () => {
      const { data } = await api.get(`/alumno/carreras`);
      return data;
    },
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
    queryKey: ["materiasAlumno", carreraSeleccionada],
    queryFn: async () => {
      const { data } = await api.get(
        `/alumno/carreras/${carreraSeleccionada}/materias`
      );
      return data;
    },
    enabled: !!carreraSeleccionada,
  });

  const materiasFiltradas = materias.filter((m) =>
    m.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <BotonVolver />
      <div className={styles.titulo}>
        <h1>Mis Materias</h1>
      </div>

      {carreras && carreras.length > 0 && (
        <>
          <div className={styles.barraAcciones}>
            <div className={styles.barraBusqueda}>
              <SearchBar
                placeholder="Buscar materia"
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

      {isLoadingCarreras || isLoadingMaterias ? (
        <CircularProgress className={styles.loadingIndicator} />
      ) : error ? (
        <div>Error al cargar las materias</div>
      ) : materiasFiltradas.length > 0 ? (
        <div className={styles.listaMaterias}>
          {materiasFiltradas.map((materia) => (
            <div key={materia.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{materia.nombre}</h3>
                <span>
                  <strong>Estado: {materia.estado}</strong>
                  <br />
                  <strong>Año: {materia.anio || "2025"}</strong>
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
        <div className={styles.mensaje}>
          <p className={styles.noMaterias}>
            No se encontraron materias con el nombre buscado
          </p>
        </div>
      )}
    </div>
  );
};

export default MisMaterias;
