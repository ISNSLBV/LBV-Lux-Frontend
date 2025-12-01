import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import Estadistica from "../../components/Perfil/Estadistica/Estadistica";
import { TrendingUp, Award, Clock } from "lucide-react";
import BarraSecciones from "../../components/Perfil/BarraSecciones/BarraSecciones";
import Informacion from "../../components/Perfil/Informacion/Informacion";
import styles from "./Perfil.module.css";
import BotonVolver from "../../components/BotonVolver/BotonVolver";

const fetchPerfil = async ({ queryKey }) => {
  const [, id] = queryKey;
  const url = id ? `/usuario/perfil/${id}` : "/usuario/perfil";
  const { data } = await api.get(url);
  return data;
};

const Perfil = () => {
  const { id } = useParams();
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["perfil", id],
    queryFn: fetchPerfil,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div className={styles.loader}>Cargando perfil…</div>;
  }

  if (isError) {
    return (
      <div className={styles.error}>
        Error al cargar perfil: {error.message}
      </div>
    );
  }

  const { informacionPersonal, carreras = [] } = data;

  // Inicializar la carrera seleccionada si no está definida
  if (carreraSeleccionada === null && carreras.length > 0) {
    const carreraInicial = carreras.find((c) => c.activo) || carreras[0];
    setCarreraSeleccionada(carreraInicial.id);
  }

  // Obtener información de la carrera seleccionada
  const carreraActual =
    carreras.find((c) => c.id === carreraSeleccionada) || carreras[0] || {};
  const mostrarSelectorCarrera = carreras.length > 1;

  return (
    <>
      <BotonVolver />
      <div className={styles.container}>
        <Informacion
          nombre={informacionPersonal.nombre}
          condicion={informacionPersonal.condicion}
          carrera={informacionPersonal.carrera}
        />

        {mostrarSelectorCarrera && (
          <div className={styles.carreraSelector}>
            {carreras.map((carrera) => (
              <button
                key={carrera.id}
                className={`${styles.carreraButton} ${
                  carreraSeleccionada === carrera.id ? styles.carreraActive : ""
                }`}
                onClick={() => setCarreraSeleccionada(carrera.id)}
              >
                {carrera.nombre}
              </button>
            ))}
          </div>
        )}

        <div className={styles.estadisticas}>
          <Estadistica
            icono={<TrendingUp size={24} />}
            label="Promedio"
            valor={carreraActual.promedio || "0.0"}
          />
          <Estadistica
            icono={<Award size={24} />}
            label="Aprobadas"
            valor={`${carreraActual.materiasAprobadas || 0}/${
              carreraActual.totalMateriasPlan || 0
            }`}
          />
        </div>

        <BarraSecciones
          informacionPersonal={informacionPersonal}
          materias={carreraActual.materias || []}
          promedioNotas={carreraActual.promedio || "0.0"}
          horarios={carreraActual.horarios || []}
        />
      </div>
    </>
  );
};

export default Perfil;
