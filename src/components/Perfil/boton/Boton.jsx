import React from 'react'
import styles from './Boton.module.css'


const Boton = ({children, icono, ...props}) => {
  return (
        <button>
           {icono} {children} 
        </button>
  )
}

export default Boton
