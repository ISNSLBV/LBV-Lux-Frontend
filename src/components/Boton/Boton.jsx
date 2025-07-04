import React from 'react'
import styles from './Boton.module.css'

const Boton = ({ children, size="md", noBackground=false, fullWidth=false, variant = "primary", icono, ...props }) => {
    const classes = [
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : "",
        noBackground ? styles.noBackground : '',
    ].join(" ").trim();

    return (
    <button className={`${classes} ${(icono && children) ? styles.boton : styles.single}`} {...props}>
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