import React from "react";
import styles from "./Evaluaciones.module.css";
import { toast } from "react-toastify";
import api from "../../../../../../api/axios";

const Evaluaciones = () => {
  const generarPDF = async () => {
    try {
      const idAlumno = 14;

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isMobile) {
        const res = await api.get(
          `/pdf/constancia-alumno-regular/${idAlumno}?format=html`,
          {
            responseType: "text",
            headers: { Accept: "text/html" },
          }
        );

        const win = window.open("", "_blank");
        if (!win) {
          toast.error("Permite pop-ups para ver/imprimir la constancia.");
          return;
        }
        win.document.open();
        win.document.write(res.data);
        win.document.close();
        return;
      }

      const res = await api.get(`/pdf/constancia-alumno-regular/${idAlumno}`, {
        responseType: "blob",
        headers: { Accept: "application/pdf" },
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank", "noopener,noreferrer");

      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error || "Error al generar la constancia";
      toast.error(msg);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Evaluaciones</h2>
      <button onClick={generarPDF}>Generar Constancia de Prueba</button>
    </div>
  );
};

export default Evaluaciones;
