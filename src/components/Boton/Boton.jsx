import React from 'react'
import styles from './Boton.module.css'

const Boton = ({ children, size="md", fullWidth=false, variant = "primary", ...props }) => {
    const classes = [
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : "",
    ].join(" ").trim();

    return (
    <button className={classes} {...props}>
        {children}
    </button>
  )
}

export default Boton