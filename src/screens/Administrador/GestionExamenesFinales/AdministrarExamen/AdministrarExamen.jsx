import React from "react";
import styles from "./AdministrarExamen.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import SeccionAlumnos from "./SeccionAlumnos/Alumnos";
import SeccionCalificaciones from "./SeccionCalificaciones/CalificacionesExamen";
import SeccionConfiguracion from "./SeccionConfiguracion/Configuracion";
import { formatearFechaSinZonaHoraria } from "../../../../utils/dateUtils";

const fetchExamen = async (id) => {
  const { data } = await api.get(
    `/admin/examen-final/${id}/detalle`
  );
  return data.data;
};

const SECCIONES = [
  { key: "alumnosInscriptos", label: "Alumnos inscriptos" },
  { key: "calificaciones", label: "Calificaciones" },
  { key: 'configuracion', label: "Configuración" }
];

const AdministrarExamen = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [seccion, setSeccion] = useState("alumnosInscriptos");
  const { idExamen } = useParams();

  const {
    data: examen,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["detalleExamen", idExamen],
    queryFn: ({ queryKey }) => fetchExamen(queryKey[1]),
    enabled: !!idExamen,
  });

  const renderSeccion = () => {
    switch (seccion) {
      case "alumnosInscriptos":
        return <SeccionAlumnos alumnos={examen?.alumnos || []} />;
      case "calificaciones":
        return <SeccionCalificaciones calificaciones={examen?.calificaciones || []} />;
      case "configuracion":
        return <SeccionConfiguracion examen={examen} />;
      default:
        return null;
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar el examen</div>;

  return (
    <>
      {examen && (
        <div className={styles.titulo}>
          <h1>
            Examen Final - {examen.materia}
          </h1>
          <h2>
            {examen.carrera} - Resolución Nº {examen.resolucion}
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
    </>
  );
};

export default AdministrarExamen;
