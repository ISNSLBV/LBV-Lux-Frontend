import React, { useState } from "react";
import styles from "./Alumnos.module.css";
import { useAuth } from "../../../../../contexts/AuthContext";
import Boton from "../../../../../components/Boton/Boton";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../../../../api/axios";
import { Check, X, User } from "lucide-react";

const fetchAlumnosInscriptos = async (idExamen) => {
  const { data } = await api.get(`/admin/examen-final/${idExamen}/alumnos`);
  return data.data;
};

const Alumnos = ({ alumnos: alumnosProp = [] }) => {
  const { user } = useAuth();
  const admin = user?.rol === "Administrador";
  const navigate = useNavigate();
  const { idExamen } = useParams();
  const queryClient = useQueryClient();

  // Usar datos del prop si están disponibles, sino hacer fetch
  const {
    data: alumnos = alumnosProp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["alumnosInscriptos", idExamen],
    queryFn: () => fetchAlumnosInscriptos(idExamen),
    enabled: !!idExamen, // Siempre hacer fetch cuando hay idExamen
  });

  const registrarAsistenciaMutation = useMutation({
    mutationFn: ({ id_usuario_alumno, presente }) =>
      api.post(`/admin/examen-final/${idExamen}/asistencia`, {
        id_usuario_alumno,
        presente,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alumnosInscriptos", idExamen],
      });
      toast.success("Asistencia registrada correctamente");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error al registrar asistencia"
      );
    },
  });

  const handleAsistencia = (id_usuario_alumno, presente) => {
    registrarAsistenciaMutation.mutate({
      id_usuario_alumno,
      presente,
    });
  };

  if (isLoading)
    return <div className={styles.loading}>Cargando alumnos...</div>;
  if (isError)
    return <div className={styles.error}>Error al cargar los alumnos</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Alumnos inscriptos al examen</h3>
      </div>

      {alumnos.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay alumnos inscriptos a este examen</p>
        </div>
      ) : (
        <div className={styles.lista}>
          {alumnos.map((alumno, idx) => (
            <div className={styles.card} key={alumno.id_inscripcion || idx}>
              <div className={styles.infoAlumno}>
                <div className={styles.datos}>
                  <p className={styles.nombre}>
                    {alumno.nombre} {alumno.apellido}
                  </p>
                  <p className={styles.email}>{alumno.email}</p>
                </div>
              </div>

              <div className={styles.acciones}>
                {/* Botones de asistencia */}
                <div className={styles.asistencia}>
                  <span className={styles.asistenciaLabel}>Asistencia:</span>
                  <div className={styles.botonesAsistencia}>
                    <Boton
                      variant="success"
                      onClick={() => handleAsistencia(alumno.id_usuario, true)}
                      disabled={registrarAsistenciaMutation.isLoading}
                      icono={<Check />}
                      fullWidth
                    >
                      Presente
                    </Boton>
                    <Boton
                      variant="cancel"
                      onClick={() => handleAsistencia(alumno.id_usuario, false)}
                      disabled={registrarAsistenciaMutation.isLoading}
                      icono={<X />}
                      fullWidth
                    >
                      Ausente
                    </Boton>
                  </div>
                </div>

                {/* Acciones adicionales para admin */}
                {admin && (
                  <Boton
                    variant="primary"
                    onClick={() =>
                      navigate(`/admin/perfil/${alumno.id_usuario}`)
                    }
                  >
                    Ver perfil
                  </Boton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alumnos;
