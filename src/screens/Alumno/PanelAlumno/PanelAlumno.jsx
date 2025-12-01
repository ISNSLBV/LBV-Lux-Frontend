import React from "react";
import styles from "./PanelAlumno.module.css";
import PanelOpcion from "../../../components/PanelOpcion/PanelOpcion";
import { useAuth } from "../../../contexts/AuthContext";
import {
  ScrollText,
  BookOpen,
  User,
  ShieldUser,
  NotebookPen,
  FilePenLine,
} from "lucide-react";

const PanelAlumno = () => {
  const { estadoCarreras } = useAuth();
  const puedeAcceder = estadoCarreras?.puedeAcceder ?? true;

  const opciones = [
    {
      titulo: "Mis materias",
      redir: "mis-materias",
      icono: BookOpen,
    },
    {
      titulo: "Mis exámenes finales",
      redir: "mis-examenes-finales",
      icono: FilePenLine,
    },
    {
      titulo: "Inscripción a materias",
      redir: "inscripcion-materias",
      icono: NotebookPen,
      bloqueado: !puedeAcceder,
    },
    {
      titulo: "Inscripción a exámenes finales",
      redir: "inscripcion-examenes-finales",
      icono: NotebookPen,
      bloqueado: !puedeAcceder,
    },
    {
      titulo: "Solicitar equivalencias",
      redir: "solicitar-equivalencias",
      icono: FilePenLine,
      bloqueado: !puedeAcceder,
    },
    {
      titulo: "Configuración de la cuenta",
      redir: "/cuenta",
      icono: ShieldUser,
    },
  ];
  return (
    <div className={styles.container}>
      <h1>Panel de Alumno</h1>
      {!puedeAcceder && estadoCarreras?.todasInactivas && (
        <div className={styles.alertaBaja}>
          <p><strong>⚠️ Atención:</strong></p>
          <p>{estadoCarreras.mensaje}</p>
        </div>
      )}
      <div className={styles.panel}>
        {opciones.map((opcion, index) => (
          <PanelOpcion
            key={index}
            titulo={opcion.titulo}
            descripcion={opcion.descripcion}
            icono={opcion.icono}
            bloqueado={opcion.bloqueado}
            {...opcion}
          />
        ))}
      </div>
    </div>
  );
};

export default PanelAlumno;
