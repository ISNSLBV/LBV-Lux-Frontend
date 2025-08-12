import React from "react";
import styles from "./PanelAdministrador.module.css";
import PanelOpcion from "../../../components/PanelOpcion/PanelOpcion";
import {
  UserPlus,
  ClipboardList,
  BookOpen,
  Users,
  User,
  BarChart,
  Settings,
  GraduationCap,
} from "lucide-react";

const PanelAdministrador = () => {
  const opciones = [
    {
      titulo: "Gestionar preinscriptos",
      redir: "gestion-preinscriptos",
      icono: UserPlus,
    },
    {
      titulo: "Gestionar carreras",
      redir: "gestion-carreras",
      icono: GraduationCap,
    },
    {
      titulo: "Gestionar planes de estudio",
      redir: "gestion-planes",
      icono: ClipboardList,
    },
    {
      titulo: "Gestionar materias",
      redir: "gestion-materias",
      icono: BookOpen,
    },
    {
      titulo: "Gestionar profesores",
      redir: "gestion-profesores",
      icono: Users,
    },
    {
      titulo: "Gestionar alumnos",
      redir: "gestion-alumnos",
      icono: User,
    },
    {
      titulo: "Ver estadísticas",
      redir: "ver-estadisticas",
      icono: BarChart,
    },
    {
      titulo: "Configuración del sistema",
      redir: "configuracion-sistema",
      icono: Settings,
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Panel de Administrador</h1>
      <div className={styles.panel}>
        {opciones.map((o, idx) => (
          <PanelOpcion
            key={idx}
            titulo={o.titulo}
            redir={o.redir}
            icono={o.icono}
          />
        ))}
      </div>
    </div>
  );
};

export default PanelAdministrador;
