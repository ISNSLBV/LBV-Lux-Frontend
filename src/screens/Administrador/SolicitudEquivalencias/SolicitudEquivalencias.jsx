import React from 'react'
import styles from "./SolicitudEquivalencias.module.css"
import BotonVolver from '../../../components/BotonVolver/BotonVolver'

const SolicitudEquivalencias = () => {
  return (
    <div className={styles.container}>
      <BotonVolver />
      <h1>Solicitudes de Equivalencias</h1>
      <div className={styles.content}>
        {/* Aquí puedes agregar el contenido de la página */}
      </div>
    </div>
  )
}

export default SolicitudEquivalencias