import React from "react";
import styles from "./Informacion.module.css";
import Boton from "../../Boton/Boton";
import { SquarePen } from "lucide-react";

const Informacion = ({ nombre, condicion, carrera }) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <p className={styles.nombre}>{nombre}</p>
        <p className={styles.condicion}>{condicion}</p>
        <p className={styles.carrera}>{carrera}</p>
      </div>
    </div>
  );
};

export default Informacion;
