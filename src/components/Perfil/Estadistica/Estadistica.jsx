import React from 'react'
import styles from './Estadistica.module.css'

const Estadistica = ({icono,label,valor}) => {
  return (
      <div className={styles.estadisticasContainer}>
        <div className={styles.card}>
          <div className={styles.icono}>{icono}</div>
          <div className={styles.label}>{label}</div>
          <div className={styles.valor}>{valor}</div>
      </div>
      </div>

  )
}

export default Estadistica
