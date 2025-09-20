import React from "react";
import styles from "./PanelAlumno.module.css";
import PanelOpcion from "../../../components/PanelOpcion/PanelOpcion";
import {
  ScrollText,
  BookOpen,
  User,
  ShieldUser,
  NotebookPen,
  FilePenLine,
} from "lucide-react";
const PanelAlumno = () => {
  const opciones = [
    {
<<<<<<< HEAD
      titulo:"Mi perfil",
      redir:"mi-perfil",
      icono: User, 
    },
    {
=======
>>>>>>> 8863905c91a2953ac67589986796dc32d195598b
      titulo: "Mis materias",
      redir: "mis-materias",
      icono: BookOpen,
    },
    {
<<<<<<< HEAD
      titulo: "Mis examenes finales",
      redir: "mis-finales",
=======
      titulo: "Mis exámenes finales",
      redir: "examenes-finales",
>>>>>>> 8863905c91a2953ac67589986796dc32d195598b
      icono: FilePenLine,
    },
    {
      titulo: "Inscripción a materias",
      redir: "inscripcion-materias",
      icono: NotebookPen,
    },
    {
      titulo: "Inscripción a exámenes finales",
      redir: "finales",
      icono: NotebookPen,
    },
    {
<<<<<<< HEAD
      titulo: "Configuracion de la cuenta",
=======
      titulo: "Solicitar equivalencias",
      redir: "solicitar-equivalencias",
      icono: FilePenLine,
    },
    {
      titulo: "Configuración de la cuenta",
>>>>>>> 8863905c91a2953ac67589986796dc32d195598b
      redir: "/cuenta",
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