import React from "react";
import styles from "./AdministrarExamen.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import SeccionAlumnos from "./SeccionAlumnos/Alumnos";
import SeccionCalificaciones from "./SeccionCalificaciones/CalificacionesExamen";
import SeccionConfiguracion from "./SeccionConfiguracion/Configuracion";
import FinalizarExamen from "./SeccionFinalizarExamen/FinalizarExamen";
import { useAuth } from "../../../../contexts/AuthContext";

const fetchExamen = async (id) => {
  const { data } = await api.get(
    `/admin/examen-final/${id}/detalle`
  );
  return data.data;
};

const SECCIONES = [
  { key: "alumnosInscriptos", label: "Alumnos inscriptos", roles: ["Administrador", "Profesor"] },
  { key: "calificaciones", label: "Calificaciones", roles: ["Administrador", "Profesor"] },
  { key: "finalizarExamen", label: "Finalizar examen", roles: ["Profesor"] },
  { key: 'configuracion', label: "Configuración", roles: ["Administrador"] }
];

const AdministrarExamen = () => {
  const { user } = useAuth();
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

  // Filtrar secciones según el rol del usuario y si es el profesor asignado
  const seccionesFiltradas = SECCIONES.filter(sec => {
    // Verificar si el rol del usuario está en los roles permitidos para esta sección
    if (!sec.roles.includes(user?.rol)) {
      return false;
    }
    
    // Si es la sección "Finalizar examen", verificar que:
    // 1. El usuario sea el profesor asignado
    // 2. El examen no esté ya finalizado
    if (sec.key === 'finalizarExamen') {
      return user?.id === examen?.profesor?.id;
    }
    
    return true;
  });

  const renderSeccion = () => {
    switch (seccion) {
      case "alumnosInscriptos":
        return <SeccionAlumnos alumnos={examen?.alumnos || []} />;
      case "calificaciones":
        return <SeccionCalificaciones calificaciones={examen?.calificaciones || []} />;
      case "finalizarExamen":
        return <FinalizarExamen examen={examen} />;
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
        {seccionesFiltradas.map((sec) => (
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
