import React from 'react'
import styles from './PanelAdministrador.module.css'
import PanelAdministradorOpcion from '../../../components/PanelAdministradorOpcion/PanelAdministradorOpcion'
import { UserPlus, BriefcaseBusiness, BookMarked } from 'lucide-react'

const PanelAdministrador = () => {
  const opciones = [
    {
      titulo: 'Gestionar preinscriptos',
      children: 'Apartado para gestionar los preinscriptos al instituto. lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      redir: 'gestion-preinscriptos'
    },
    // Puedes agregar más opciones aquí
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