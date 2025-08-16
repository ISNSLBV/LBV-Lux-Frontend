import React from "react";
import styles from "./PanelProfesor.module.css";
import PanelAdministradorOpcion from "../../../components/PanelOpcion/PanelOpcion";

const PanelProfesor = () => {
  const opciones = [
    {
      titulo: "Ver materias asignadas",
      redir: "materias-asignadas",
    },
    {
      titulo: "Ver examenes finales asignados",
      redir: "examenes-finales",
    },
    {
      titulo: "Configuración de la cuenta",
      redir: "configuracion-cuenta",
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Panel de Profesor</h1>
      <div className={styles.panel}>
        {opciones.map((opcion, index) => (
          <PanelAdministradorOpcion
            key={index}
            titulo={opcion.titulo}
            descripcion={opcion.descripcion}
            {...opcion}
          />
        ))}
      </div>
    </div>
  );
};

export default PanelProfesor;
