import React from "react";
import PanelOpcion from "../../../../components/PanelOpcion/PanelOpcion";
import styles from "./GestionMateriasMenu.module.css";

const GestionMateriasMenu = () => {
  const opciones = [
    {
      titulo: "Gestionar materias",
      redir: "/admin/gestion-materias/materias",
    },
    {
      titulo: "Gestionar materias por plan de estudio",
      redir: "/admin/gestion-materias/materias-por-plan",
    },
    {
      titulo: "Gestionar materias por ciclo lectivo",
      redir: "/admin/gestion-materias/materias-por-ciclo",
    },
    {
      titulo: "Gestionar correlativas",
      redir: "/admin/gestion-materias/correlativas",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        {opciones.map((o, idx) => (
          <PanelOpcion
            key={idx}
            titulo={o.titulo}
            redir={o.redir}
          />
        ))}
      </div>
    </div>
  );
};

export default GestionMateriasMenu;
