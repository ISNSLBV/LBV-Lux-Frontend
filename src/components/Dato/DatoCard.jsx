import React from 'react'
import styles from './DatoCard.module.css'
import CircularProgress from '@mui/material/CircularProgress'

const DatoCard = ({ titulo, icono, dato, descripcion, loading }) => {
  return (
    <div className={styles.card}>
        <div className={styles.header}>
            <h3>{titulo}</h3>
            {icono}
        </div>
        <div className={styles.content}>
            {loading
              ? <CircularProgress size={24} color='inherit' />
              : <div>{dato}</div>
            }
            {descripcion && <p>{descripcion}</p>}
        </div>
    </div>
  )
}

export default DatoCard