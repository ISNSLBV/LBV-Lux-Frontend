import React from 'react'
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react'; 
import styles from './PanelAdministradorOpcion.module.css';

const PanelAdministradorOpcion = ({ titulo, children, redir }) => {
  return (
    <Link to={redir} style={{ textDecoration: 'none', color: 'white' }} className={styles.opcion}>
      <div className={styles.panel}>
          <div className={styles.contenido}>
              <h2>{titulo}</h2>
              <p>{children}</p>
          </div>
          <div className={styles.accion}>
            <ArrowRight size={32} strokeWidth={3} />
          </div>
      </div>
    </Link>
  )
}

export default PanelAdministradorOpcion