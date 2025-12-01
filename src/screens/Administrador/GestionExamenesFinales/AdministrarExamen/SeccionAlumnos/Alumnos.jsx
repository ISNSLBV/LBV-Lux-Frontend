import React, { useState } from "react";
import styles from "./Alumnos.module.css";
import { useAuth } from "../../../../../contexts/AuthContext";
import Boton from "../../../../../components/Boton/Boton";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../../../../api/axios";
import { Check, X } from "lucide-react";

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
  const [modalConfirmacion, setModalConfirmacion] = useState(null);

  const {
    data: alumnos = alumnosProp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["alumnosInscriptos", idExamen],
    queryFn: () => fetchAlumnosInscriptos(idExamen),
    enabled: !!idExamen,
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
      queryClient.invalidateQueries({
        queryKey: ["calificacionesExamen", idExamen],
      });
      toast.success("Asistencia registrada correctamente");
      setModalConfirmacion(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error al registrar asistencia"
      );
      setModalConfirmacion(null);
    },
  });

  const handleAsistencia = (id_usuario_alumno, presente, asistenciaActual) => {
    if (asistenciaActual && !admin) {
      toast.error("La asistencia ya fue registrada y no puede ser modificada");
      return;
    }

    if (asistenciaActual && admin) {
      setModalConfirmacion({
        id_usuario_alumno,
        presente,
        asistenciaActual,
      });
      return;
    }

    registrarAsistenciaMutation.mutate({
      id_usuario_alumno,
      presente,
    });
  };

  const confirmarCambioAsistencia = () => {
    if (modalConfirmacion) {
      registrarAsistenciaMutation.mutate({
        id_usuario_alumno: modalConfirmacion.id_usuario_alumno,
        presente: modalConfirmacion.presente,
      });
    }
  };

  const getEstadoAsistencia = (asistencia) => {
    if (!asistencia) return null;
    return asistencia === "PRESENTE" ? "presente" : "ausente";
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
          {alumnos.map((alumno, idx) => {
            const estadoAsistencia = getEstadoAsistencia(alumno.asistencia);
            const tieneAsistencia = !!alumno.asistencia;

            return (
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
                  {tieneAsistencia && (
                    <div className={styles.estadoAsistencia}>
                      <span className={styles.asistenciaLabel}>
                        Asistencia registrada:
                      </span>
                      <span
                        className={`${styles.badge} ${
                          estadoAsistencia === "presente"
                            ? styles.presente
                            : styles.ausente
                        }`}
                      >
                        {alumno.asistencia === "PRESENTE" ? (
                          <>
                            <Check size={16} /> Presente
                          </>
                        ) : (
                          <>
                            <X size={16} /> Ausente
                          </>
                        )}
                      </span>
                      {admin && (
                        <p className={styles.notaAdmin}>
                          (Podés modificar la asistencia haciendo clic en los
                          botones)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Solo mostrar botones de asistencia si: no hay asistencia O si es admin */}
                  {(!tieneAsistencia || admin) && (
                    <div className={styles.asistencia}>
                      {!tieneAsistencia && (
                        <span className={styles.asistenciaLabel}>
                          Registrar asistencia:
                        </span>
                      )}
                      <div className={styles.botonesAsistencia}>
                        <Boton
                          variant={
                            estadoAsistencia === "presente"
                              ? "success"
                              : "primary"
                          }
                          onClick={() =>
                            handleAsistencia(
                              alumno.id_usuario,
                              true,
                              alumno.asistencia
                            )
                          }
                          disabled={registrarAsistenciaMutation.isLoading}
                          icono={<Check />}
                          fullWidth
                        >
                          Presente
                        </Boton>
                        <Boton
                          variant={
                            estadoAsistencia === "ausente"
                              ? "cancel"
                              : "primary"
                          }
                          onClick={() =>
                            handleAsistencia(
                              alumno.id_usuario,
                              false,
                              alumno.asistencia
                            )
                          }
                          disabled={registrarAsistenciaMutation.isLoading}
                          icono={<X />}
                          fullWidth
                        >
                          Ausente
                        </Boton>
                      </div>
                    </div>
                  )}

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
            );
          })}
        </div>
      )}

      {modalConfirmacion && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirmar modificación de asistencia</h3>
            <p>
              Estás a punto de modificar la asistencia de{" "}
              <strong>
                {modalConfirmacion.asistenciaActual === "PRESENTE"
                  ? "PRESENTE"
                  : "AUSENTE"}
              </strong>{" "}
              a{" "}
              <strong>
                {modalConfirmacion.presente ? "PRESENTE" : "AUSENTE"}
              </strong>
              .
            </p>
            <p>¿Estás seguro de que deseas continuar?</p>
            <div className={styles.modalActions}>
              <Boton
                variant="success"
                onClick={confirmarCambioAsistencia}
                disabled={registrarAsistenciaMutation.isLoading}
              >
                Confirmar
              </Boton>
              <Boton
                variant="cancel"
                onClick={() => setModalConfirmacion(null)}
              >
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumnos;
