import React from "react";
import styles from "./PreinscripcionCerrada.module.css";
import { LockKeyhole } from "lucide-react";

const PreinscripcionCerrada = () => {
  return (
    <div className={styles.container}>
      <div className={styles.icono}>
        <LockKeyhole size={48} />
      </div>
      <h1>Las preinscripciones se encuentran cerradas</h1>
      <h2>
        Para más información comunicate con secretaría por lo siguientes medios:
      </h2>
      <div className={styles.contacto}>
        <p>
          Email: <strong>terciario@lujanbuenviaje.edu.ar</strong>
        </p>
        <p>
          Teléfono: <strong>(011) 5263-2395</strong>
        </p>
      </div>
    </div>
  );
};

export default PreinscripcionCerrada;
