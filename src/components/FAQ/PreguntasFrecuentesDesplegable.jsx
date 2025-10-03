import React, { useState } from "react";
import styles from "./PreguntasFrecuentesDesplegable.module.css";

const PreguntasFrecuentesDesplegable = ({ items }) => {
  const [activo, setActivo] = useState(null);
  const alternar = (index) => {
    setActivo(activo === index ? null : index);
  };

  return (
    <div className={styles.container}>
      {items.map((item, i) => (
        <div key={i} className={styles.item}>
          <button className={styles.pregunta} onClick={() => alternar(i)}>
            <span className={styles.titulo}>{item.titulo}</span>
            <span
              className={`${styles.flecha} ${
                activo === i ? styles.abierto : ""
              }`}
            >
              &#9656;
            </span>
          </button>
          {activo === i && (
            <div className={styles.respuesta}>
              <p>{item.descripcion}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PreguntasFrecuentesDesplegable;
