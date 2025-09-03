import React from "react";
import styles from "./Calificaciones.module.css";
import { toast } from "react-toastify";
import api from "../../../../../../api/axios";
import { useState } from "react";
import PeriodoCalificaciones from "./PeriodoCalificaciones";
import { useAuth } from "../../../../../../contexts/AuthContext";

const secciones = [
  { key: "primer", label: "Primer cuatrimestre" },
  { key: "segundo", label: "Segundo cuatrimestre" },
];

const Calificaciones = ({ idMateriaPlanCiclo }) => {
  const [seccion, setSeccion] = useState('primer');
  const { user } = useAuth();

  const renderSeccion = () => {
    switch (seccion) {
      case "primer":
        return <PeriodoCalificaciones periodo={1} idMateriaPlanCiclo={idMateriaPlanCiclo} userRole={user.rol} />;
      case "segundo":
        return <PeriodoCalificaciones periodo={2} idMateriaPlanCiclo={idMateriaPlanCiclo} userRole={user.rol} />;
      default:
        return null;
    }
  } 

  return (
    <div className={styles.container}>
      <h2>Calificaciones</h2>
      <nav className={styles.navbar}>
        {secciones.map((s) => (
          <button
            key={s.key}
            className={seccion === s.key ? styles.active : ""}
            onClick={() => setSeccion(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>
      <div className={styles.cuatrimestre}>
        {renderSeccion()}
      </div>
    </div>
  );
};

export default Calificaciones;
