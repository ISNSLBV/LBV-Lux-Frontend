import React from "react";
import styles from "./AdministrarMateria.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Alumnos from "./SeccionAlumnos/Alumnos";
import Clases from "./SeccionClases/Clases";
import Profesores from "./SeccionProfesores/Profesores";
import Evaluaciones from "./SeccionEvaluaciones/Evaluaciones";

const fetchMateria = async (id) => {
  const { data } = await api.get(
    `/admin/materia/materia-plan-ciclo/${id}/detalle`
  );
  return data;
};

const SECCIONES = [
  { key: "alumnosInscriptos", label: "Alumnos inscriptos" },
  { key: "clases", label: "Clases" },
  { key: "profesores", label: "Profesor/es asignado/s" },
  { key: "evaluaciones", label: "Evaluaciones" },
];

const AdministrarMateria = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [seccion, setSeccion] = useState("alumnosInscriptos");
  const { idMateria } = useParams();

  const {
    data: materia,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["detalleMateria", idMateria],
    queryFn: ({ queryKey }) => fetchMateria(queryKey[1]),
    enabled: !!idMateria,
  });

  const renderSeccion = () => {
    switch (seccion) {
      case "alumnosInscriptos":
        return <Alumnos alumnos={materia?.alumnos ?? []} />;
      case "clases":
        return <Clases materiaId={idMateria} />;
      case "profesores":
        return <Profesores profesores={materia?.profesores ?? []} idMateria={idMateria} />;
      case "evaluaciones":
        return <Evaluaciones />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.botonVolver} onClick={() => navigate(-1)}>
        <ArrowLeft />
        <span>Volver</span>
      </div>
      {materia && (
        <div className={styles.titulo}>
          <h1>
            {materia.materia} (Año {materia.ciclo})
          </h1>
          <h2>
            {materia.carrera} - Resolución Nº {materia.resolucion}
          </h2>
        </div>
      )}
      <nav className={styles.navbar}>
        {SECCIONES.map((sec) => (
          <button
            key={sec.key}
            className={seccion === sec.key ? styles.active : ""}
            onClick={() => setSeccion(sec.key)}
            type="button"
          >
            {sec.label}
          </button>
        ))}
      </nav>
      <div className={styles.seccionContenido}>{renderSeccion()}</div>
    </div>
  );
};

export default AdministrarMateria;
