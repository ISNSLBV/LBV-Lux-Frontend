import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../api/axios";
import styles from "./Estadisticas.module.css";

const COLOR_HOMBRES = "#26e859ff";
const COLOR_MUJERES = "#f47710ff";
const COLOR_NO_BINARIO = "#f4a300ff";
const COLOR_ESTUDIANTES = "#8884d8";
const COLOR_EGRESADOS = "#82ca9d";

const fetchEstadisticas = async () => {
  const { data } = await api.get("/admin/estadisticas/ver-estadisticas");
  return data;
};

const Estadisticas = () => {
  const {
    data: estadisticas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["estadisticas"],
    queryFn: fetchEstadisticas,
  });

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.sinDatos}>
        Error al cargar las estadísticas.
      </div>
    );
  }

  const {
    generoPorCarrera,
    generoPorCarreraCurso,
    rangoEtario,
    egresadosPorAnio,
  } = estadisticas;

  const generoData = generoPorCarrera.map((item) => ({
    nombre: item["carrera.nombre"],
    hombres: parseInt(item.hombres, 10),
    mujeres: parseInt(item.mujeres, 10),
    noBin: parseInt(item.noBin, 10),
  }));

  const generoCursoData = generoPorCarreraCurso.map((item) => ({
    nombre: `${item["carrera.nombre"]} - Año ${item.anio_inscripcion}`,
    hombres: parseInt(item.hombres, 10),
    mujeres: parseInt(item.mujeres, 10),
    noBin: parseInt(item.noBin, 10),
  }));

  const egresadosData = egresadosPorAnio.map((item) => ({
    anio: item.anio,
    cantidad: parseInt(item.cantidad, 10),
  }));

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Estadísticas del instituto</h1>
      </div>
      {/* Gráfico 1: Género por Carrera General */}
      <div className={styles.graficosContainer}>
        <div className={styles.grafico}>
          <h2 className={styles.graficoTitulo}>
            Estadísticas por Género y Carrera (General)
          </h2>
          {generoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={generoData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hombres" fill={COLOR_HOMBRES} name="Hombres" />
                <Bar dataKey="mujeres" fill={COLOR_MUJERES} name="Mujeres" />
                <Bar
                  dataKey="noBin"
                  fill={COLOR_NO_BINARIO}
                  name="No Binario"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.sinDatos}>
              No hay datos de género por carrera para mostrar.
            </div>
          )}
        </div>

        {/* Gráfico 2: Género por Carrera y Curso */}
        <div className={styles.grafico}>
          <h2 className={styles.graficoTitulo}>
            Estadísticas por Género y Curso
          </h2>
          {generoCursoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={generoCursoData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hombres" fill={COLOR_HOMBRES} name="Hombres" />
                <Bar dataKey="mujeres" fill={COLOR_MUJERES} name="Mujeres" />
                <Bar
                  dataKey="noBin"
                  fill={COLOR_NO_BINARIO}
                  name="No Binario"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.sinDatos}>
              No hay datos de género por curso para mostrar.
            </div>
          )}
        </div>

        {/* Gráfico 3: Rango Etario */}
        <div className={styles.grafico}>
          <h2 className={styles.graficoTitulo}>
            Estadísticas por Rango Etario
          </h2>
          {rangoEtario.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={rangoEtario}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rango" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="estudiantes"
                  fill={COLOR_ESTUDIANTES}
                  name="Estudiantes"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.sinDatos}>
              No hay datos de rango etario para mostrar.
            </div>
          )}
        </div>

        {/* Gráfico 4: Egresados por Año */}
        <div className={styles.grafico}>
          <h2 className={styles.graficoTitulo}>
            Estadísticas de Egresados por Año
          </h2>
          {egresadosData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={egresadosData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="anio" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="cantidad"
                  fill={COLOR_EGRESADOS}
                  name="Cantidad de Egresados"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.sinDatos}>
              No hay datos de egresados para mostrar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Estadisticas;
