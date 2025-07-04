import React from 'react'
import styles from './Notas.module.css'

const Notas = ({ promedio }) => {
  return (
  <div className={styles.container}>
      <h2 className={styles.titulo}>Resumen de Calificaciones</h2>

      <div className={styles.promedioContainer}>
        <p className={styles.promedio}>{promedio.toFixed(1)}</p>
        <span className={styles.promedioLabel}>Promedio General</span>
      </div>
    </div>
  )
}

export default Notas
