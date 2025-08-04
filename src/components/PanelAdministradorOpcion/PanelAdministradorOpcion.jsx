import React from "react";
import { Link } from "react-router-dom";
import styles from "./PanelAdministradorOpcion.module.css";
import {
  ArrowRight,
  UserPlus,
  ClipboardList,
  BookOpen,
  Users,
  User,
  BarChart,
  Settings,
  GraduationCap,
} from "lucide-react";

const iconMap = {
  "Gestionar preinscriptos": UserPlus,
  "Gestionar carreras": GraduationCap,
  "Gestionar planes de estudio": ClipboardList,
  "Gestionar materias": BookOpen,
  "Gestionar profesores": Users,
  "Gestionar alumnos": User,
  "Ver estadísticas": BarChart,
  "Configuración del sistema": Settings,
};

const PanelAdministradorOpcion = ({ titulo, descripcion, conteo, redir }) => {
  const IconComponent = iconMap[titulo];
  return (
    <Link
      to={redir}
      style={{ textDecoration: "none", color: "white" }}
      className={styles.opcion}
    >
      <div className={styles.panel}>
        <div className={styles.accion}>
          {IconComponent && <IconComponent size={32} className={styles.icon} />}
          <ArrowRight size={32} strokeWidth={3} />
        </div>
        <h2>{titulo}</h2>
      </div>
    </Link>
  );
};

export default PanelAdministradorOpcion;
