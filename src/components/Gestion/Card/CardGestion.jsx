import React from "react";
import styles from "./CardGestion.module.css";
import CircularProgress from "@mui/material/CircularProgress";

function getValor(campo, data) {
  return typeof campo.accessor === "function"
    ? campo.accessor(data)
    : data[campo.accessor];
}

const CardGestion = ({
  campos = [],
  data = [],
  isLoading = false,
  vacioTexto = "No se encontraron elementos",
  renderAcciones,
}) => {
  return (
    <div className={styles.cards}>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="inherit" />
        </div>
      ) : data.length === 0 ? (
        <div>
          <p>{vacioTexto}</p>
        </div>
      ) : (
        data.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderContent}>
                <div className={styles.cardHeaderTitle}>
                  <h3>{getValor(campos[1], item)}</h3>
                  <p>
                    {campos[0].label}: {getValor(campos[0], item)}
                  </p>
                </div>
                <div className={styles.cardHeaderStatus}>
                  {getValor(campos[2], item)}
                </div>
              </div>
            </div>
            <div className={styles.cardContent}>
              {campos.slice(3).map((campo) => (
                <div key={campo.label}>
                  <h4>{campo.label}</h4>
                  <p>{getValor(campo, item)}</p>
                </div>
              ))}
              {renderAcciones && (
                <div className={styles.cardActions}>{renderAcciones(item)}</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CardGestion;
