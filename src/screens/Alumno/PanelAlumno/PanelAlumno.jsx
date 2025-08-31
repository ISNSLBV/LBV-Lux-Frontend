import React from "react";
import styles from "./PanelAlumno.module.css";
import PanelOpcion from "../../../components/PanelOpcion/PanelOpcion";
import {ScrollText, BookOpen, User, ShieldUser, NotebookPen, FilePenLine} from "lucide-react";
const PanelAlumno = () => {
  const opciones = [
    {
      titulo:"Mi perfil",
      redir:"perfil",
      icono: User, 
    },
    {
      titulo: "Mis materias",
      redir: "mis-materias",
      icono: BookOpen,
    },
    {
      titulo: "Mis examenes finales",
      redir: "examenes-finales",
      icono: FilePenLine,
    },
    {
      titulo: "Emitir certificados",
      redir: "certificados",
      icono: ScrollText,
    },
    {
      titulo: "Inscripcion a materias",
      redir: "materias",
      icono: NotebookPen,
    },
    {
      titulo: "Inscripcion a finales",
      redir: "finales",
      icono: NotebookPen, 
    },

    {
      titulo: "Configuracion de la cuenta",
      redir: "cuenta",
      icono: ShieldUser,
    },
  ];
  return (
    <div className={styles.container}>
      <h1>Panel de Alumno</h1>
      <div className={styles.panel}>
        {opciones.map((opcion, index) => (
          <PanelOpcion
            key={index}
            titulo={opcion.titulo}
            descripcion={opcion.descripcion}
            icono={opcion.icono}
            {...opcion}
          />
        ))}
      </div>
    </div>
  );
};

export default PanelAlumno;
