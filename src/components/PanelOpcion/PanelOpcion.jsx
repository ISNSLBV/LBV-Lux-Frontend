import React from "react";
import { Link } from "react-router-dom";
import styles from "./PanelOpcion.module.css";
import { ArrowRight, Lock } from "lucide-react";

const PanelOpcion = ({ titulo, redir, icono: Icono, bloqueado = false }) => {
  const Contenido = () => (
    <div className={`${styles.panel} ${bloqueado ? styles.bloqueado : ""}`}>
      <div className={styles.accion}>
        {Icono && <Icono size={32} />}
        {bloqueado ? <Lock size={32} strokeWidth={3} /> : <ArrowRight size={32} strokeWidth={3} />}
      </div>
      <h2>{titulo}</h2>
      {bloqueado && <span className={styles.mensajeBloqueado}>Acceso restringido</span>}
    </div>
  );

  if (bloqueado) {
    return (
      <div className={styles.opcion} style={{ cursor: "not-allowed" }}>
        <Contenido />
      </div>
    );
  }

  return (
    <Link
      to={redir}
      style={{ textDecoration: "none", color: "white" }}
      className={styles.opcion}
    >
      <Contenido />
    </Link>
  );
};

export default PanelOpcion;
