import React from "react";
import styles from "./Alumnos.module.css";
import { useAuth } from "../../../../../../contexts/AuthContext";
import Boton from "../../../../../../components/Boton/Boton";
import { useNavigate } from "react-router-dom";
import EstadoBadge from "../../../../../../components/EstadoBadge/EstadoBadge";
import { formatearFecha } from "../../../../../../utils/dateUtils";

const Alumnos = ({ alumnos = [] }) => {
  const { user } = useAuth();
  const admin = user?.rol === "Administrador";
  const navigate = useNavigate();

  if (alumnos.length === 0) {
    return <p>No hay alumnos inscriptos en esta materia</p>;
  }

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
                  Inscripto: {formatearFecha(a.fecha_inscripcion)}
                </p>
              )}
            </div>
            <div className={styles.estado}>
              {a.estado && <EstadoBadge estado={a.estado} />}
              {a.nota_final && (
                <span className={styles.notaFinal}>Nota: {a.nota_final}</span>
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
              <Boton fullWidth variant="cancel">
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
