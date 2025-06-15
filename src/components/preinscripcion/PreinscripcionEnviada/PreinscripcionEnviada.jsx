import React from 'react'
import styles from './PreinscripcionEnviada.module.css'

const PreinscripcionEnviada = ({ exito, mensaje }) => {
  return (
    <div className={styles.container}>
        <h1 className={exito ? styles.titleSuccess : styles.titleError}>
            {exito ? 'Preinscripción Enviada' : 'Error al Enviar'}
        </h1>
        <p className={styles.message}>
            {mensaje}
        </p>
        {/* Solo mostrar el botón si exito es falso */}
        {!exito && (
            <button className={styles.volverBtn} onClick={onVolver}>
            Volver a intentar
            </button>
        )}
    </div>
  )
}

export default PreinscripcionEnviada
