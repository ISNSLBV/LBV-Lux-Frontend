import React from 'react'
import styles from './PanelAdministrador.module.css'
import PanelAdministradorOpcion from '../../../components/PanelAdministradorOpcion/PanelAdministradorOpcion'

const PanelAdministrador = () => {
  const opciones = [
    {
      titulo: 'Gestionar preinscriptos',
      redir: 'gestion-preinscriptos'
    },
    {
      titulo: 'Gestionar carreras',
      redir: 'gestion-carreras'
    },
    {
      titulo: 'Gestionar planes de estudio',
      redir: 'gestion-planes'
    },
    {
      titulo: 'Gestionar materias',
      redir: 'gestion-materias'
    },
  ]
  
  return (
    <div className={styles.container}>
      <h1>Panel de Administrador</h1>
      <div className={styles.panel}>
        {opciones.map((opcion, index) => (
          <PanelAdministradorOpcion key={index} {...opcion} />
        ))}
      </div>
    </div>
  )
}

export default PanelAdministrador