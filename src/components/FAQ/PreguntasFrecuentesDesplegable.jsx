import React, { useState } from "react";
import estilos from "./PreguntasFrecuentesDesplegable.module.css";

const PreguntasFrecuentesDesplegable = ({ items }) => {
  const [activo, setActivo] = useState(null);
  const alternar = (index) => {
    setActivo(activo === index ? null : index);
  };

  return (
    <div className={estilos.contenedor}>
      {items.map((item, i) => (
        <div key={i} className={estilos.item}>
          <button className={estilos.pregunta} onClick={() => alternar(i)}>
            <span className={estilos.titulo}>{item.titulo}</span>
            <span
              className={`${estilos.flecha} ${
                activo === i ? estilos.abierto : ""
              }`}
            >
              &#9656;
            </span>
          </button>
          {activo === i && (
            <div className={estilos.respuesta}>
              <p>{item.descripcion}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PreguntasFrecuentesDesplegable;
