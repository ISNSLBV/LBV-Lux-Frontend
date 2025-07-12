import React from 'react'
import styles from './PreinscriptoCard.module.css'
import Boton from '../../Boton/Boton'
import { User, GraduationCap, Mail, Check, X, EyeOff } from 'lucide-react'

const PreinscriptoCard = ({ persona, onAceptar, onOcultar, onRechazar }) => {
  const observacion = persona.preinscripcions[0]?.comentario;
  const idCarrera = persona.preinscripcions[0]?.id_carrera;
  const idPreinscripcion = persona.preinscripcions[0]?.id;
  const estado = persona.preinscripcions[0]?.estado;

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <span><strong>Preinscripción Nº {idPreinscripcion}</strong></span>
        <span 
          className={styles.estado}
          style={
            (estado === 'Aprobada') ? { backgroundColor: 'green' } :
            (estado === 'Rechazada') ? { backgroundColor: 'red' } :
            { backgroundColor: 'yellow', color: 'black' }
          }
        >
            {estado}
        </span>
      </div>
      <div className={styles.datosGenerales}>
        <div className={styles.datosPersonales}>
          <div className={styles.titulo}>
            <User />
            <span>Datos personales</span>
          </div>
          <div>
            <span>Nombre completo: </span>
            <p><strong>{persona.nombre} {persona.apellido}</strong></p>
          </div>
          <div>
            <span>DNI Nº: </span>
            <p><strong>{persona.dni}</strong></p>
          </div>
          <div>
            <span>Fecha de nacimiento: </span> 
            <p><strong>{persona.fecha_nacimiento}</strong></p>
          </div>
        </div>
        <div className={styles.datosContacto}>
          <div className={styles.titulo}>
            <Mail />
            <span>Datos de contacto</span>
          </div>
          <div>
            <span>Email: </span> 
            <p><strong>{persona.email}</strong></p>
          </div>
          <div>
            <span>Teléfono: </span> 
            <p><strong>{persona.telefono}</strong></p>
          </div>
        </div>
        <div className={styles.datosAcademicos}>
          <div className={styles.titulo}>
            <GraduationCap />
            <span>Datos académicos</span>
          </div>
          <div>
            <span>Carrera a inscribirse: </span> 
            <p>
              <strong>
                {idCarrera === 1 
                  ? 'Técnico Analista de Sistemas' 
                  : 'Técnico en Redes Informáticas'
                }
              </strong>
            </p>
          </div>
          <div className={styles.observaciones}>
            <span>Observaciones: </span> 
            <p>
              <strong>
                {observacion === null 
                  ? 'Esta persona no ha dejado observaciones' 
                  : observacion
                }
              </strong>
            </p>
          </div>
        </div>
      </div>
      {estado === 'Pendiente' && (
        <>
          <hr />
          <div className={styles.acciones}>
            <Boton icono={<EyeOff />} onClick={onOcultar}>Ocultar</Boton>
            <Boton variant='success' icono={<Check />} onClick={onAceptar}>Aceptar</Boton>
            <Boton variant='cancel' icono={<X />} onClick={onRechazar}>Rechazar</Boton>
          </div>
        </>
      )}
    </div>
  )
}

export default PreinscriptoCard