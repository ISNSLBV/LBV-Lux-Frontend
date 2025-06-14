import React from 'react'
import styles from './PerfilCard.module.css'
const PerfilCard = () => {
  return (
    <div className={styles.container}>
            <p>Nombre:</p>
            <p>Apellido:</p>
            <p>Correo electronico:</p>
            <p>DNI:</p>
            <p>Carrera actual:</p>        
    </div>
  )
}

export default PerfilCard