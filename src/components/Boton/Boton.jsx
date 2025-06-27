import React from 'react'
import styles from './Boton.module.css'

const Boton = ({ children, size="md", fullWidth=false, variant = "primary", icono, ...props }) => {
    const classes = [
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : "",
    ].join(" ").trim();

    return (
    <button className={`${classes} ${styles.boton}`} {...props}>
        {icono && 
            <span className={styles.icono}>
                {icono}
            </span>
        }
        <span className={styles.label}>
            {children}
        </span>
    </button>
  )
}

export default Boton