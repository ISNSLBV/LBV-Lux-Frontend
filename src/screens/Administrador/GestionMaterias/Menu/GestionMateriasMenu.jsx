import React from 'react'
import PanelAdministradorOpcion from '../../../../components/PanelAdministradorOpcion/PanelAdministradorOpcion';

const GestionMateriasMenu = () => {
    const opciones = [
        {
        titulo: 'Gestionar materias',
        redir: '/admin/gestion-materias/materias'
        },
        {
        titulo: 'Gestionar materias por plan de estudio',
        redir: '/admin/gestion-materias/materias-por-plan'
        },
        {
        titulo: 'Gestionar materias por ciclo lectivo',
        redir: '/admin/gestion-materias/materias-por-ciclo'
        }
  ]

  return (
    <>
        {opciones.map((opcion, index) => (
            <PanelAdministradorOpcion 
            key={index} 
            titulo={opcion.titulo} 
            redir={opcion.redir} 
            />
        ))}
    </>
  )
}

export default GestionMateriasMenu