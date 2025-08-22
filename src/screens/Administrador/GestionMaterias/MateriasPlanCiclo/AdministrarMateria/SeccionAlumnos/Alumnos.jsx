import React from "react";
import styles from "./Alumnos.module.css";
import { useAuth } from "../../../../../../contexts/AuthContext";
import Boton from "../../../../../../components/Boton/Boton";
import { useNavigate } from "react-router-dom";

const Alumnos = ({ alumnos = [] }) => {
  const { user } = useAuth();
  const admin = user?.rol === "Administrador";
  const navigate = useNavigate();

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
                onClick={() => navigate(`/admin/perfil/${a.id_usuario}`)}
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
