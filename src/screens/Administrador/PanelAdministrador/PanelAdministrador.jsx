import React from 'react'
import styles from './PanelAdministrador.module.css'
import PanelAdministradorOpcion from '../../../components/PanelAdministradorOpcion/PanelAdministradorOpcion'

const PanelAdministrador = () => {
  const opciones = [
    {
      titulo: 'Gestionar preinscriptos',
      children: 'Apartado para gestionar los preinscriptos al instituto. lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      redir: 'gestion-preinscriptos'
    },
    {
      titulo: 'Gestionar carreras',
      children: 'Apartado para gestionar las carreras del instituto. lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      redir: 'gestion-carreras'
    },
    {
      titulo: 'Gestionar planes de estudio',
      children: 'Apartado para gestionar los planes de estudio del instituto. lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      redir: 'gestion-planes'
    },
    {
      titulo: 'Gestionar materias',
      children: 'Apartado para gestionar las materias del instituto. lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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