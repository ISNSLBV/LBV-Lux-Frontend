import React from "react";
import styles from "./Alumnos.module.css";
import { useAuth } from "../../../../../../contexts/AuthContext";
import Boton from "../../../../../../components/Boton/Boton";

const Alumnos = ({ alumnos = [] }) => {
  const { user } = useAuth();
  const admin = user?.rol === "Administrador";

  return (
    <div className={styles.container}>
      {alumnos.map((a, idx) => (
        <div className={styles.card} key={idx}>
          <p className={styles.nombre}>
            {a.nombre} {a.apellido}
          </p>
          <p className={styles.email}>{a.email}</p>
          {admin && (
            <div className={styles.acciones}>
              <Boton
                fullWidth
              >
                Ver perfil
              </Boton>
              <Boton
                fullWidth
                variant="cancel"
              >
                Dar de baja
              </Boton>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Alumnos;
