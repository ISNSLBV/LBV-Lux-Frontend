import React from "react";
import { Link } from "react-router-dom";
import styles from "./PanelOpcion.module.css";
import { ArrowRight } from "lucide-react";

const PanelOpcion = ({ titulo, redir, icono: Icono }) => {
  return (
    <Link
      to={redir}
      style={{ textDecoration: "none", color: "white" }}
      className={styles.opcion}
    >
      <div className={styles.panel}>
        <div className={styles.accion}>
          {Icono && <Icono size={32} />}
          <ArrowRight size={32} strokeWidth={3} />
        </div>
        <h2>{titulo}</h2>
      </div>
    </Link>
  );
};

export default PanelOpcion;
