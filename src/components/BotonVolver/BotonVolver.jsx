import React from 'react'
import Boton from '../Boton/Boton'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './BotonVolver.module.css'

const BotonVolver = () => {
    const navigate = useNavigate();

  return (
    <div className={styles.botonVolver}>
        <Boton
            icono={<ArrowLeft />}
            isVolver
            onClick={() => navigate(-1)}
        >
            Volver
        </Boton>
    </div>
  )
}

export default BotonVolver