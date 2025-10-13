import React from 'react';
import styles from './EstadoBadge.module.css';
import { getEstadoInfo } from '../../utils/estadosInscripcion';

const EstadoBadge = ({ estado, showDescription = false, className = '' }) => {
  const estadoInfo = getEstadoInfo(estado);
  
  return (
    <span 
      className={`${styles.badge} ${styles[estadoInfo.variant]} ${className}`}
      title={estadoInfo.description}
    >
      {estadoInfo.label}
      {showDescription && (
        <span className={styles.description}>
          {estadoInfo.description}
        </span>
      )}
    </span>
  );
};

export default EstadoBadge;