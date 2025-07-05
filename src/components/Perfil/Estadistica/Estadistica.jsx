import React from 'react'
import styles from './Estadistica.module.css'

const Estadistica = ({ icono, label, valor }) => {
  return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.icono}>{icono}</div>
          <div className={styles.datos}>
            <span className={styles.label}>{label}</span>
            <span className={styles.valor}>{valor}</span>
          </div>
        </div>
      </div>

  )
}

export default Estadistica
