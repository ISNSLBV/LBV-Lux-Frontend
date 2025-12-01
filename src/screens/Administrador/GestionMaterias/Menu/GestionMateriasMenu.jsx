import React from "react";
import PanelOpcion from "../../../../components/PanelOpcion/PanelOpcion";
import styles from "./GestionMateriasMenu.module.css";
import BotonVolver from "../../../../components/BotonVolver/BotonVolver";

const GestionMateriasMenu = () => {
  const opciones = [
    {
      titulo: "Repositorio de materias",
      redir: "/admin/materias/repositorio-materias",
    },
    {
      titulo: "Gestionar materias por plan de estudio",
      redir: "/admin/materias/materias-por-plan",
    },
    {
      titulo: "Gestionar materias por ciclo lectivo",
      redir: "/admin/materias/materias-por-ciclo",
    },
    {
      titulo: "Gestionar correlativas",
      redir: "/admin/materias/correlativas",
    },
  ];

  return (
    <>
      <BotonVolver />
      <div className={styles.panel}>
        {opciones.map((o, idx) => (
          <PanelOpcion
            key={idx}
            titulo={o.titulo}
            redir={o.redir}
          />
        ))}
      </div>
    </>
  );
};

export default GestionMateriasMenu;
