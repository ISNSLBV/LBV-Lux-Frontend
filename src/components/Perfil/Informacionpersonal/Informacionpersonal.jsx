import React from 'react'
import styles from './InformacionPersonal.module.css'
import { User } from 'lucide-react'

const InformacionPersonal = ({ fechaNacimiento, dni, ingreso }) => {
  return (
    <div className={styles.card}>
        <div className={styles.titulo}>
            <User />
            <h3>Información Personal</h3>
        </div>
        <div className={styles.info}>
            <span>Fecha de Nacimiento</span>
            <span>{fechaNacimiento}</span>
        </div>
        <div className={styles.info}>
            <span>DNI</span>
            <span>{dni}</span>
        </div>
        <div className={styles.info}>
            <span>Ingreso:</span>
            <span>{ingreso}</span>
        </div>
    </div>
  )
}

export default InformacionPersonal