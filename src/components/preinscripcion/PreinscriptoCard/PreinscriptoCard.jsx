import React from 'react'
import styles from './PreinscriptoCard.module.css'
import Boton from '../../Boton/Boton'

const PreinscriptoCard = ({ persona, onAceptar, onOcultar }) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <span><strong>Preinscripción Nº</strong></span>
        <span>{persona.preinscripcions[0]?.id}</span>
      </div>
      <div className={styles.datosGenerales}>
        <div className={styles.datosPersonales}>
          <span className={styles.titulo}><strong>Datos personales</strong></span>
          <span><strong>Nombre completo:</strong> {persona.nombre} {persona.apellido}</span>
          <span><strong>DNI Nº:</strong> {persona.dni}</span>
          <span><strong>Fecha de nacimiento:</strong> {persona.fecha_nacimiento}</span>
        </div>
        <div className={styles.datosContacto}>
          <span className={styles.titulo}><strong>Datos de contacto</strong></span>
          <span><strong>Email:</strong> {persona.email}</span>
          <span><strong>Teléfono:</strong> {persona.telefono}</span>
        </div>
        <div className={styles.datosAcademicos}>
          <span className={styles.titulo}><strong>Datos académicos</strong></span>
          <span><strong>Carrera a inscribirse:</strong> {persona.preinscripcions[0]?.id_carrera == 1 ? 'Técnico Analista de Sistemas' : 'Técnico en Redes Informáticas'}</span>
          <p className={styles.observaciones}><strong>Observaciones:</strong> {persona.preinscripcions[0]?.comentario}</p>
        </div>
      </div>
      <div className={styles.acciones}>
        <Boton onClick={onAceptar}>Aceptar</Boton>
        <Boton onClick={onOcultar}>Ocultar</Boton>
      </div>
    </div>
  )
}

export default PreinscriptoCard