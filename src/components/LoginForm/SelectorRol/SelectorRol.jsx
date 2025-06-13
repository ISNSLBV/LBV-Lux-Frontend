import React from 'react'
import styles from './SelectorRol.module.css'

const SelectorRol = ({ roles, onSelect, onClose }) => {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>Elegí con qué rol ingresar</h2>
        {roles.map(r => (
          <button key={r} onClick={() => onSelect(r)} className={styles.botonRol}>
            {r}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SelectorRol