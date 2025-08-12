import React, { useState } from "react";
import InformacionPersonal from "../InformacionPersonal/InformacionPersonal";
import Materia from "../Materia/Materia";
import Notas from "../Notas/Notas";
import Horarios from "../Horario/Horario";
import styles from "./BarraSecciones.module.css";

const BarraSecciones = ({ informacionPersonal, materias, promedioNotas, horarios }) => {
  const [activeTab, setActiveTab] = useState("Info");

  const renderTab = () => {
    switch (activeTab) {
      case "Materias":
        return materias.map((m, i) => <Materia key={i} materia={m} />);
      case "Notas":
        return <Notas promedio={promedioNotas} />;
      case "Horarios":
        return horarios.map((h, i) => (
          <Horarios
            key={i}
            nombre={h.nombre}
            profesor={h.profesor}
            horario={h.horario}
          />
        ));
      default:
        return (
          <InformacionPersonal
            fechaNacimiento={informacionPersonal.fechaNacimiento}
            dni={informacionPersonal.dni}
            ingreso={informacionPersonal.ingreso}
          />
        )
    }
  };

  return (
    <>
      <div className={styles.tabHeader}>
        {["Info", "Materias", "Notas", "Horarios"].map((tab) => (
          <button
            key={tab}
            className={`${styles.button} ${
              activeTab === tab ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{renderTab()}</div>
    </>
  );
};

export default BarraSecciones;
