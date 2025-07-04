import React from 'react'

const Notas = () => {
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
