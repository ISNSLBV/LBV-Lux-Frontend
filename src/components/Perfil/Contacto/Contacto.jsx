import React from 'react'
import { Mail, Phone, House }from 'lucide-react'
import styles from './Contacto.module.css'

const Contacto = ({ correoElectronico, telefono, direccion }) => {
  return (
    <div>
        <div className={styles.titulo}>
            <Phone />
            <h3>Contacto</h3>
        </div>
        <div className={styles.info}>
            <Mail />
            <span>{correoElectronico}</span>
        </div>
        <div className={styles.info}>
            <Phone />
            <span>{telefono}</span>
        </div>
        <div className={styles.info}>
            <House />
            <span>{direccion}</span>
        </div>
    </div>
  )
}

export default Contacto