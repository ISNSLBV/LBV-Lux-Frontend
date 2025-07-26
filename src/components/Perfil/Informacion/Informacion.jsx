import React from 'react';
import styles from './Informacion.module.css';
import Boton from '../../Boton/Boton';
import { SquarePen } from 'lucide-react';

const Informacion = ({
  nombre,
  matricula,
  condicion,
  carrera,
  cuatrimestre,
  progresoAcademico // número entre 0 y 100
}) => {
  // Aseguramos que el porcentaje esté en rango válido
  const pct = Math.min(100, Math.max(0, progresoAcademico));

  return (
    <div className={styles.card}>
      <h2>Mi Perfil</h2>
      <div className={styles.info}>
        <p className={styles.nombre}>
          <strong>Nombre:</strong> {nombre}
        </p>
        <p className={styles.matricula}>
          <strong>Matrícula:</strong> {matricula}
        </p>
        <p className={styles.condicion}>
          <strong>Condición:</strong> {condicion}
        </p>
        <p className={styles.carrera}>
          <strong>Carrera:</strong> {carrera}
        </p>
        <p className={styles.cuatrimestre}>
          <strong>Cuatrimestre:</strong> {cuatrimestre}
        </p>

        {/* Aquí vamos a renderizar la barra */}
        <p>
          <strong>Progreso Académico:</strong> {pct}%
        </p>
        <div className={styles.progressContainer}>
          <div
            className={styles.progressFill}
            style={{ width: `${pct}%` }}
          />
        </div>

        <Boton icono={<SquarePen />} children="Editar" />
      </div>
    </div>
  );
};

export default Informacion;
