import React from "react";
import styles from "./Certificados.module.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../../api/axios";
import { toast } from "react-toastify";
import Boton from "../../../components/Boton/Boton";

const fetchAlumnos = async () => {
  const { data } = await api.get("/usuario/listar-alumnos");
  return data;
};

const Certificados = () => {
  const {
    data: alumnos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["alumnos"],
    queryFn: fetchAlumnos,
  });

  const certificados = [
    { id: 1, descripcion: "Certificado de Alumno Regular" },
    { id: 2, descripcion: "Certificado de Materias Aprobadas" },
    { id: 3, descripcion: "Certificado de Asistencia a Examen" },
  ];

  const emitirCertificado = useMutation({
    mutationFn: async ({ alumnoId, certificadoId }) => {
      // Cambiar a GET y pasar los parámetros en la URL
      const response = await api.get(
        `/pdf/certificado/${certificadoId}/${alumnoId}`,
        {
          responseType: "blob", // Importante para manejar archivos binarios
        }
      );

      // Crear un blob y descargar el archivo
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Extraer el nombre del archivo del header Content-Disposition si está disponible
      const contentDisposition = response.headers["content-disposition"];
      let filename = "certificado.pdf";
      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    },
    onSuccess: () => {
      toast.success("Certificado emitido con éxito");
    },
    onError: (error) => {
      console.error("Error al emitir certificado:", error);
      toast.error("Error al emitir certificado");
    },
  });

  const handleEmitirCertificado = (alumnoId, certificadoId) => {
    // Validar que se hayan seleccionado ambos valores
    if (!alumnoId || !certificadoId) {
      toast.error("Por favor seleccione un alumno y un tipo de certificado");
      return;
    }

    emitirCertificado.mutate({ alumnoId, certificadoId });
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los alumnos</div>;

  return (
    <div className={styles.container}>
      <h1>Certificados</h1>
      <div className={styles.panel}>
        <div className={styles.selectorAlumno}>
          <h2>Seleccionar Alumno</h2>
          <select id="alumnoSelect">
            <option value="">Seleccione un alumno</option>
            {alumnos.map((alumno) => (
              <option key={alumno.id} value={alumno.id}>
                {alumno.nombre} {alumno.apellido} - {alumno.dni}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.selectorCertificado}>
          <h2>Seleccionar Certificado</h2>
          <select id="certificadoSelect">
            <option value="">Seleccione un certificado</option>
            {certificados.map((certificado) => (
              <option key={certificado.id} value={certificado.id}>
                {certificado.descripcion}
              </option>
            ))}
          </select>
          <Boton
            variant="success"
            onClick={() =>
              handleEmitirCertificado(
                document.getElementById("alumnoSelect").value,
                document.getElementById("certificadoSelect").value
              )
            }
          >
            Emitir Certificado
          </Boton>
        </div>
      </div>
    </div>
  );
};

export default Certificados;
