import React from 'react'
import styles from './InformacionPersonal.module.css'
import { User } from 'lucide-react'

const InformacionPersonal = ({ fechaNacimiento, dni, ingreso }) => {
  return (
    <div className={styles.card}>
        <div className={styles.titulo}>
            <User size={20} />
            <h3>Información Personal</h3>
        </div>
        <div className={styles.infoContainer}>
            <div className={styles.info}>
                <span>Fecha de nacimiento:</span>
                <span><strong>{fechaNacimiento}</strong></span>
            </div>
            <div className={styles.info}>
                <span>DNI:</span>
                <span><strong>{dni}</strong></span>
            </div>
            <div className={styles.info}>
                <span>Fecha de ingreso:</span>
                <span><strong>{ingreso}</strong></span>
            </div>
        </div>
    </div>
  )
}

export default InformacionPersonal
