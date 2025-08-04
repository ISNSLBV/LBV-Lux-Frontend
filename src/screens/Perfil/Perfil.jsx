import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import Estadistica from "../../components/Perfil/Estadistica/Estadistica";
import { TrendingUp, BookOpen, Award, Clock } from "lucide-react";
import Navbar from "../../components/Perfil/Navbar/Navbar";
import Informacion from "../../components/Perfil/Informacion/Informacion";
import styles from "./Perfil.module.css";

const fetchPerfil = async ({ queryKey }) => {
  const [, id] = queryKey;
  const url = id ? `/usuario/perfil/${id}` : "/usuario/perfil";
  const { data } = await api.get(url);
  return data;
};

const iconMap = {
  promedio: TrendingUp,
  materias: BookOpen,
  aprobadas: Award,
  asistencia: Clock,
};

const Perfil = () => {
  const { id } = useParams();
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

  const {
    informacionPersonal,
    estadisticas,
    horarios,
    materias,
    promedioGeneral,
  } = data;

  return (
    <div className={styles.container}>
      <Informacion
        nombre={informacionPersonal.nombre}
        condicion={informacionPersonal.condicion}
        carrera={informacionPersonal.carrera}
      />

      <div className={styles.estadisticas}>
        {estadisticas.map(({ iconoKey, valor }) => {
          const Icon = iconMap[iconoKey] || TrendingUp;
          const label = iconoKey.charAt(0).toUpperCase() + iconoKey.slice(1);
          return (
            <Estadistica
              key={iconoKey}
              icono={<Icon size={24} />}
              label={label}
              valor={valor}
            />
          );
        })}
      </div>

      <Navbar
        informacionPersonal={informacionPersonal}
        materias={materias}
        promedioNotas={promedioGeneral}
        horarios={horarios}
      />
    </div>
  );
};

export default Perfil;
