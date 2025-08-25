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
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../api/axios";

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
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-8">
        Error al cargar las estadísticas.
      </div>
    );
  }

  const datosOriginales = estadisticas.generoPorCarrera;

  if (!datosOriginales || datosOriginales.length === 0) {
    return (
      <div className="text-center mt-8">
        No hay datos de género por carrera para mostrar.
      </div>
    );
  }

  const generoData = datosOriginales.map((item) => ({
    nombre: item["carrera.nombre"],
    hombres: parseInt(item.hombres, 10),
    mujeres: parseInt(item.mujeres, 10),
    noBin: parseInt(item.noBin, 10),
  }));

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">
        Estadísticas por Género y Carrera
      </h2>
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
          <Bar dataKey="hombres" fill="#26e859ff" name="Hombres" />
          <Bar dataKey="mujeres" fill="#f47710ff" name="Mujeres" />
          <Bar dataKey="noBin" fill="#f4a300ff" name="No Binario" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Estadisticas;
