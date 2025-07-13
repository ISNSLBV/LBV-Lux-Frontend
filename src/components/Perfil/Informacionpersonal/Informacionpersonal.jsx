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
                <span style={{ fontWeight: '700' }}>{fechaNacimiento}</span>
            </div>
            <div className={styles.info}>
                <span>DNI:</span>
                <span style={{ fontWeight: '700' }}>{dni}</span>
            </div>
            <div className={styles.info}>
                <span>Fecha de ingreso:</span>
                <span style={{ fontWeight: '700' }}>{ingreso}</span>
            </div>
        </div>
    </div>
  )
}

export default InformacionPersonal