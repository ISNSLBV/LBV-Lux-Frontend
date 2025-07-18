
import React from 'react';
import './Informacion.module.css';

const Informacion = ({nombre,matricula,condicion,carrera,cuatrimestre}) => {
  return (
    <div className={styles.card}>
      <h2>Progreso Académico</h2>
      <div className={styles.info}>
        <p className={styles.nombre}><strong>Nombre:</strong>{nombre}</p>
        <p className={styles.matricula}><strong>Matrícula:</strong> {matricula}</p>
        <p className={styles.condicion}><strong>Condición:</strong> {condicion}</p>
        <p className={styles.carrera}><strong>Carrera:</strong> {carrera}</p>
        <p className={styles.cuatrimestre}><strong>Cuatrimestre:</strong> {cuatrimestre}</p>
      </div>
    </div>
  );
};

export default Informacion;
