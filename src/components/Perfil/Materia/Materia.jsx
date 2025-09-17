import React from 'react'
import styles from './Materia.module.css'

const Materia = ({ materia }) => {
  return (
    <div className={styles.card}>
      <div>
        <h3 className={styles.nombre}>{materia.nombre}</h3>
        <p>{materia.profesor}</p>
        <p className={styles.cuatrimestre}>{materia.cuatrimestre}</p>
      </div>
      <div className={styles.infoDerecha}>
        <span className={`${styles.estado} ${styles[materia.estado]}`}>
          {materia.estado}
        </span>
        <p>{materia.horario}</p>
        {materia.nota && <p className={styles.nota}>{materia.nota}</p>}
      </div>
    </div>
  )
}

export default Materia