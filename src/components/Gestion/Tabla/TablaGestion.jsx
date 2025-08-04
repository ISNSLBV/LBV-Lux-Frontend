import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import styles from './TablaGestion.module.css'

const TablaGestion = ({
  columnas = [],
  data = [],
  isLoading = false,
  vacioTexto = "No se encontraron registros",
  renderAcciones,
}) => {
  return (
    <table className={styles.tabla}>
      <thead>
        <tr>
          {columnas.map((col) => (
            <th key={col.label}>{col.label}</th>
          ))}
          {renderAcciones && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td
              colSpan={columnas.length + (renderAcciones ? 1 : 0)}
              style={{ textAlign: "center", padding: 32 }}
            >
              <CircularProgress color="inherit" />
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td
              colSpan={columnas.length + (renderAcciones ? 1 : 0)}
              style={{ textAlign: "center", padding: 32 }}
            >
              {vacioTexto}
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={row.id || idx} className={styles.tablaFila}>
              {columnas.map((col) => (
                <td key={col.label}>
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : row[col.accessor]}
                </td>
              ))}
              {renderAcciones && <td>{renderAcciones(row)}</td>}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default TablaGestion;
