import React, { useState } from "react";
import styles from "./Calificaciones.module.css";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../../../../api/axios";
import { Lock, User, Check, X } from "lucide-react";
import Boton from "../../../../../components/Boton/Boton";

const fetchCalificacionesExamen = async (idExamen) => {
  const { data } = await api.get(`/admin/examen-final/${idExamen}/calificaciones`);
  return data.data;
};

const Calificaciones = ({ calificaciones: calificacionesProp = [] }) => {
  const { user } = useAuth();
  const { idExamen } = useParams();
  const queryClient = useQueryClient();
  const [editingStates, setEditingStates] = useState({});

  const canEditBlocked = user?.rol === "Administrador";

  const {
    data: calificaciones = calificacionesProp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["calificacionesExamen", idExamen],
    queryFn: () => fetchCalificacionesExamen(idExamen),
    enabled: !!idExamen,
  });

  const actualizarCalificacionMutation = useMutation({
    mutationFn: async ({ id_inscripcion, calificacion }) => {
      await api.put(`/admin/examen-final/calificaciones/${id_inscripcion}`, {
        calificacion,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calificacionesExamen", idExamen] });
      toast.success("Calificación actualizada correctamente");
      setEditingStates({});
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error al actualizar la calificación"
      );
    },
  });

  const bloquearCalificacionMutation = useMutation({
    mutationFn: async ({ id_inscripcion, bloqueada }) => {
      await api.put(`/admin/examen-final/calificaciones/${id_inscripcion}/bloquear`, {
        bloqueada,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calificacionesExamen", idExamen] });
      toast.success("Estado de bloqueo actualizado");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error al cambiar el estado de bloqueo"
      );
    },
  });

  const handleEdit = (idInscripcion, calificacionActual) => {
    setEditingStates((prev) => ({
      ...prev,
      [idInscripcion]: calificacionActual?.toString() || "",
    }));
  };

  const handleSave = (idInscripcion) => {
    const calificacion = parseFloat(editingStates[idInscripcion]);
    if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
      toast.error("La calificación debe ser un número entre 0 y 10");
      return;
    }
    actualizarCalificacionMutation.mutate({
      id_inscripcion: idInscripcion,
      calificacion,
    });
  };

  const handleCancel = (idInscripcion) => {
    setEditingStates((prev) => {
      const newState = { ...prev };
      delete newState[idInscripcion];
      return newState;
    });
  };

  const handleToggleBloqueo = (idInscripcion, bloqueadaActual) => {
    bloquearCalificacionMutation.mutate({
      id_inscripcion: idInscripcion,
      bloqueada: !bloqueadaActual,
    });
  };

  const getEstadoCalificacion = (calificacion) => {
    if (calificacion === null || calificacion === undefined) return "sin-calificar";
    if (calificacion >= 4) return "aprobado";
    return "desaprobado";
  };

  if (isLoading) return <div className={styles.loading}>Cargando calificaciones...</div>;
  if (isError) return <div className={styles.error}>Error al cargar las calificaciones</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Calificaciones del examen final</h3>
      </div>

      {calificaciones.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay alumnos para calificar en este examen</p>
        </div>
      ) : (
        <div className={styles.tablaContainer}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Email</th>
                <th>Asistencia</th>
                <th>Calificación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map((cal) => {
                const isEditing = cal.id_inscripcion in editingStates;
                const canEdit = !cal.bloqueada || canEditBlocked;
                const estadoCalificacion = getEstadoCalificacion(cal.calificacion);

                return (
                  <tr
                    key={cal.id_inscripcion}
                    className={`${cal.bloqueada ? styles.bloqueada : ""} ${
                      styles[estadoCalificacion]
                    }`}
                  >
                    <td>
                      <div className={styles.alumno}>
                        <User size={20} />
                        {cal.alumno.nombre} {cal.alumno.apellido}
                      </div>
                    </td>
                    <td>{cal.alumno.email}</td>
                    <td>
                      <span className={`${styles.asistenciaBadge} ${styles[cal.asistencia?.toLowerCase()]}`}>
                        {cal.asistencia === "PRESENTE" ? (
                          <>
                            <Check size={16} /> Presente
                          </>
                        ) : cal.asistencia === "AUSENTE" ? (
                          <>
                            <X size={16} /> Ausente
                          </>
                        ) : (
                          "Sin registrar"
                        )}
                      </span>
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editingStates[cal.id_inscripcion]}
                          onChange={(e) =>
                            setEditingStates((prev) => ({
                              ...prev,
                              [cal.id_inscripcion]: e.target.value,
                            }))
                          }
                          min="0"
                          max="10"
                          step="0.01"
                          className={styles.inputCalificacion}
                          placeholder="0.00"
                        />
                      ) : (
                        <div className={styles.calificacionContainer}>
                          <span className={styles.calificacion}>
                            {cal.calificacion !== null && cal.calificacion !== undefined
                              ? cal.calificacion.toFixed(2)
                              : "-"}
                          </span>
                          {cal.bloqueada && (
                            <span
                              className={styles.lockIcon}
                              title={
                                canEditBlocked
                                  ? "Bloqueada (podés editar como administrador)"
                                  : "Bloqueada"
                              }
                            >
                              <Lock size={16} />
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`${styles.estadoBadge} ${styles[estadoCalificacion]}`}>
                        {estadoCalificacion === "aprobado" && "Aprobado"}
                        {estadoCalificacion === "desaprobado" && "Desaprobado"}
                        {estadoCalificacion === "sin-calificar" && "Sin calificar"}
                      </span>
                    </td>
                    <td className={styles.acciones}>
                      {isEditing ? (
                        <div className={styles.accionesEdicion}>
                          <Boton
                            onClick={() => handleSave(cal.id_inscripcion)}
                            variant="success"
                            size="small"
                            disabled={actualizarCalificacionMutation.isLoading}
                          >
                            Guardar
                          </Boton>
                          <Boton
                            onClick={() => handleCancel(cal.id_inscripcion)}
                            variant="cancel"
                            size="small"
                          >
                            Cancelar
                          </Boton>
                        </div>
                      ) : (
                        <div className={styles.accionesVer}>
                          {canEdit && cal.asistencia === "PRESENTE" && (
                            <Boton
                              onClick={() =>
                                handleEdit(cal.id_inscripcion, cal.calificacion)
                              }
                              size="small"
                              title={
                                cal.bloqueada
                                  ? "Editar (como administrador)"
                                  : "Editar calificación"
                              }
                            >
                              Editar
                            </Boton>
                          )}
                          {canEditBlocked && (
                            <Boton
                              onClick={() =>
                                handleToggleBloqueo(cal.id_inscripcion, cal.bloqueada)
                              }
                              variant={cal.bloqueada ? "success" : "warning"}
                              size="small"
                              disabled={bloquearCalificacionMutation.isLoading}
                            >
                              {cal.bloqueada ? "Desbloquear" : "Bloquear"}
                            </Boton>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Calificaciones;