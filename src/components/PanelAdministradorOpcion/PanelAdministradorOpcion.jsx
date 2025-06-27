import React from 'react'
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react'; 
import styles from './PanelAdministradorOpcion.module.css';

const PanelAdministradorOpcion = ({ titulo, redir }) => {
  return (
    <Link to={redir} style={{ textDecoration: 'none', color: 'white' }} className={styles.opcion}>
      <div className={styles.panel}>
          <h2>{titulo}</h2>
          <div className={styles.accion}>
            <ArrowRight size={32} strokeWidth={3} />
          </div>
      </div>
    </Link>
  )
}

export default PanelAdministradorOpcion