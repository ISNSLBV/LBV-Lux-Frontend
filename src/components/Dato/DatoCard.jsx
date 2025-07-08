import React from 'react'
import styles from './DatoCard.module.css'

const DatoCard = ({ titulo, icono, dato, descripcion }) => {
  return (
    <div className={styles.card}>
        <div className={styles.header}>
            <h3>{titulo}</h3>
            {icono}
        </div>
        <div className={styles.content}>
            <div>{dato}</div>
            {descripcion && <p>{descripcion}</p>}
        </div>
    </div>
  )
}

export default DatoCard