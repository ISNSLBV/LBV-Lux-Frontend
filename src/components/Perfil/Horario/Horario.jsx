import React from 'react'
import styles from './Horario.module.css'
import { Clock } from 'lucide-react'

const Horarios = ({ nombre, profesor, horario }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.nombre}>{nombre}</div>
        <div className={styles.profesor}>{profesor}</div>
        <div className={styles.horario}><Clock /> {horario}</div>
      </div>
    </div>
  );
};

export default Horarios;