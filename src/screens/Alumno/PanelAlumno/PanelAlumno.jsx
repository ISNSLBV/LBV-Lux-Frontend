import React from "react";
import styles from "./PanelAlumno.module.css";
import PanelAdministradorOpcion from "../../../components/PanelAdministradorOpcion/PanelAdministradorOpcion";

const PanelAlumno = () => {
  const opciones = [
    {
      titulo: "Mis materias",
      redir: "mis-materias",
    },
    {
      titulo: "Examenes finales",
      redir: "examenes-finales",
    },
    {
      titulo: "Emitir certificados",
      redir: "certificados",
    },
    {
      titulo: "Inscripcion a materias",
      redir: "materias",
    },
    {
      titulo: "Inscripcion a finales",
      redir: "finales",
    },

    {
      titulo: "Configuracion de la cuenta",
      redir: "cuenta",
    },
  ];
  return (
    <div className={styles.container}>
      <h1>Panel de Alumno</h1>
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

export default PanelAlumno;
