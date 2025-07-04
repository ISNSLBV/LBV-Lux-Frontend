import React from 'react'
import styles from './SelectorRol.module.css'
import Boton from '../../Boton/Boton'

const SelectorRol = ({ roles, onSelect, onClose }) => {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3>Elegí con qué rol ingresar</h3>
        <div className={styles.opciones}>
          {roles.map(r => (
            <Boton variant='primary' fullWidth key={r} onClick={() => onSelect(r)}>
              {r}
            </Boton>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SelectorRol