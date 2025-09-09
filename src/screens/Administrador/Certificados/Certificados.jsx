import React, { useState } from "react";
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
  // Estados para búsqueda de alumnos
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [certificadoSeleccionado, setCertificadoSeleccionado] = useState("");
  // Query para buscar alumnos por término
  const {
    data: alumnosOptions = [],
    isLoading: isLoadingSearch,
    error: errorSearch,
  } = useQuery({
    queryKey: ["buscarAlumnos", searchTerm],
    queryFn: () =>
      api
        .get("/usuario/buscar-alumnos", { params: { term: searchTerm } })
        .then((res) => res.data),
    enabled: searchTerm.length >= 3,
  });

  const certificados = [
    { id: 1, descripcion: "Certificado de Alumno Regular" },
    { id: 2, descripcion: "Certificado de Materias Aprobadas" },
    { id: 3, descripcion: "Certificado de Asistencia a Examen" },
  ];

  const emitirCertificado = useMutation({
    mutationFn: async ({ alumnoId, certificadoId }) => {
      // Obtener el PDF como blob y mostrar en nueva pestaña para vista previa y opciones del navegador
      const response = await api.get(
        `/pdf/certificado/${certificadoId}/${alumnoId}`,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
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
    if (!alumnoId || !certificadoId) {
      toast.error("Seleccioná un alumno y un tipo de certificado");
      return;
    }

    emitirCertificado.mutate({ alumnoId, certificadoId });
  };

  if (errorSearch) return <div>Error al buscar los alumnos</div>;

  return (
    <div className={styles.container}>
      <h1>Certificados</h1>
      <div className={styles.panel}>
        <div className={styles.selectorAlumno}>
          <h2>Buscar Alumno</h2>
          <p>(mínimo 3 caracteres)</p>
          <input
            type="text"
            placeholder="DNI, nombre o apellido"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {isLoadingSearch && <div>Cargando...</div>}
          {alumnosOptions.length > 0 && (
            <ul className={styles.dropdown}>
              {alumnosOptions.map((alumno) => (
                <li
                  key={alumno.id}
                  onClick={() => {
                    setSelectedAlumno(alumno);
                    setSearchTerm("");
                  }}
                  className={styles.alumno}
                >
                  {alumno.nombre} {alumno.apellido} - {alumno.dni}
                </li>
              ))}
            </ul>
          )}
          {selectedAlumno && (
            <div className={styles.selectedAlumno}>
              Seleccionado: {selectedAlumno.nombre} {selectedAlumno.apellido} -{" "}
              {selectedAlumno.dni}
            </div>
          )}
        </div>
        <div className={styles.selectorCertificado}>
          <h2>Seleccionar Certificado</h2>
          <select
            value={certificadoSeleccionado}
            onChange={(e) => setCertificadoSeleccionado(e.target.value)}
          >
            <option value="">Seleccione un certificado</option>
            {certificados.map((c) => (
              <option key={c.id} value={c.id}>
                {c.descripcion}
              </option>
            ))}
          </select>
          <Boton
            variant="success"
            onClick={() =>
              handleEmitirCertificado(
                selectedAlumno?.id,
                certificadoSeleccionado
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
