import React from 'react'
import styles from './Horario.module.css'

const Horarios = () => {
  return (
        <div className={styles.container}>
                <div className={styles.card}>
                  <div className={styles.nombre}>{nombre}</div>
                  <div className={styles.profesor}>{profesor}</div>
                  <div className={styles.horario}>{horario}</div>
              </div>
    </div>
  );
};

export default Horarios;