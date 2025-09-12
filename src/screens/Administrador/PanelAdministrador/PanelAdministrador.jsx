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
  Feather,
  ClipboardCheck,
} from "lucide-react";

const PanelAdministrador = () => {
  const opciones = [
    {
      titulo: "Gestionar preinscripciones",
      redir: "preinscripciones",
      icono: UserPlus,
    },
    {
      titulo: "Gestionar carreras",
      redir: "carreras",
      icono: GraduationCap,
    },
    {
      titulo: "Gestionar planes de estudio",
      redir: "planes-de-estudio",
      icono: ClipboardList,
    },
    {
      titulo: "Gestionar materias",
      redir: "materias",
      icono: BookOpen,
    },
    {
      titulo: "Gestionar examenes finales",
      redir: "examenes-finales",
      icono: ClipboardCheck,
    },
    {
      titulo: "Gestionar profesores",
      redir: "profesores",
      icono: Users,
    },
    {
      titulo: "Gestionar alumnos",
      redir: "alumnos",
      icono: User,
    },
    {
      titulo: "Emitir certificados",
      redir: "certificados",
      icono: Feather,
    },
    {
      titulo: "Ver estadísticas",
      redir: "estadisticas",
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
