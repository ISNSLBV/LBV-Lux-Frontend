import React from "react";
import styles from "./Alumnos.module.css";
import { useAuth } from "../../../../../../contexts/AuthContext";
import Boton from "../../../../../../components/Boton/Boton";
import { useNavigate } from "react-router-dom";
import EstadoBadge from "../../../../../../components/EstadoBadge/EstadoBadge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../../../api/axios";

const Alumnos = ({ alumnos = [] }) => {
  const { user } = useAuth();
  const admin = user?.rol === "Administrador";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Mutación para actualizar estado de regularización de un alumno específico
  const actualizarEstadoMutation = useMutation({
    mutationFn: async (idInscripcion) => {
      const { data } = await api.put(
        `/admin/materia/materia-plan-ciclo/regularizacion/actualizar/${idInscripcion}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['detalleMateria']);
    }
  });

  const handleActualizarEstado = (alumno) => {
    // Asumiendo que cada alumno tiene un id de inscripción, necesitarías agregarlo en el backend
    // Por ahora, usaremos el id del usuario para actualizar todos sus estados
    if (alumno.id_inscripcion) {
      actualizarEstadoMutation.mutate(alumno.id_inscripcion);
    }
  };

  return (
      <div className={styles.container}>
        {alumnos.map((a, idx) => (
        <div className={styles.card} key={idx}>
          <div className={styles.alumnoInfo}>
            <div className={styles.datos}>
              <p className={styles.nombre}>
                {a.nombre} {a.apellido}
              </p>
              <p className={styles.email}>DNI Nº: {a.dni}</p>
              {a.fecha_inscripcion && (
                <p className={styles.fechaInscripcion}>
                  Inscripto: {new Date(a.fecha_inscripcion).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className={styles.estado}>
              {a.estado && <EstadoBadge estado={a.estado} />}
              {a.nota_final && (
                <span className={styles.notaFinal}>
                  Nota: {a.nota_final}
                </span>
              )}
            </div>
          </div>
          
          {a.calificaciones && a.calificaciones.length > 0 && (
            <div className={styles.calificaciones}>
              <p className={styles.calificacionesLabel}>Calificaciones:</p>
              <div className={styles.calificacionesGrid}>
                {a.calificaciones.map((cal, calIdx) => (
                  <span key={calIdx} className={styles.calificacion}>
                    {cal.cuatrimestre}° Cuatrimestre: {cal.calificacion}
                    {cal.bloqueada && " (Bloqueada)"}
                  </span>
                ))}
              </div>
            </div>
          )}

          {admin && (
            <div className={styles.acciones}>
              <Boton
                variant="primary"
                fullWidth
                onClick={() => navigate(`/admin/perfil/${a.id_usuario}`)}
              >
                Ver perfil
              </Boton>
              {a.estado && (a.estado === 'cursando' || a.estado === 'regularizada') && (
                <Boton
                  fullWidth
                  variant="secondary"
                  disabled={actualizarEstadoMutation.isPending}
                  onClick={() => handleActualizarEstado(a)}
                >
                  {actualizarEstadoMutation.isPending ? 'Actualizando...' : 'Actualizar Estado'}
                </Boton>
              )}
              <Boton
                fullWidth
                variant="cancel"
              >
                Dar de baja
              </Boton>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Alumnos;
