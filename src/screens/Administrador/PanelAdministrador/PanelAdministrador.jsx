import React from "react";
import styles from "./PanelAdministrador.module.css";
import PanelAdministradorOpcion from "../../../components/PanelAdministradorOpcion/PanelAdministradorOpcion";

const PanelAdministrador = () => {
  const opciones = [
    {
      titulo: "Gestionar preinscriptos",
      redir: "gestion-preinscriptos",
    },
    {
      titulo: "Gestionar carreras",
      redir: "gestion-carreras",
    },
    {
      titulo: "Gestionar planes de estudio",
      redir: "gestion-planes",
    },
    {
      titulo: "Gestionar materias",
      redir: "gestion-materias",
    },
    {
      titulo: "Gestionar profesores",
      redir: "gestion-profesores",
    },
    {
      titulo: "Gestionar alumnos",
      redir: "gestion-alumnos",
    },
    {
      titulo: "Ver estadísticas",
      redir: "ver-estadisticas",
    },
    {
      titulo: "Configuración del sistema",
      redir: "configuracion-sistema",
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Panel de Administrador</h1>
      <div className={styles.panel}>
        {opciones.map((opcion, index) => (
          <PanelAdministradorOpcion
            key={index}
            titulo={opcion.titulo}
            descripcion={opcion.descripcion}
            conteo={opcion.conteo}
            {...opcion}
          />
        ))}
      </div>
    </div>
  );
};

export default PanelAdministrador;
