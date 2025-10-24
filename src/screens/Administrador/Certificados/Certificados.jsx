import React, { useState } from "react";
import styles from "./Certificados.module.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../../api/axios";
import { toast } from "react-toastify";
import Boton from "../../../components/Boton/Boton";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";

const Certificados = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [certificadoSeleccionado, setCertificadoSeleccionado] = useState("");

  const [isManualMode, setIsManualMode] = useState(false);
  const [manualData, setManualData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    carrera: "",
    resolucion: "",
  });

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
    mutationFn: async ({ alumnoId, certificadoId, datosManual }) => {
      let url;
      let params = {};

      if (isManualMode && datosManual) {
        // Para alumno no registrado - usar query params
        url = `/pdf/certificado/${certificadoId}`;
        params = {
          nombre: datosManual.nombre,
          apellido: datosManual.apellido,
          dni: datosManual.dni,
          carrera: datosManual.carrera,
          resolucion: datosManual.resolucion,
        };
      } else {
        // Para alumno registrado - usar path param
        url = `/pdf/certificado/${certificadoId}/${alumnoId}`;
      }

      const response = await api.get(url, {
        responseType: "blob",
        params,
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url_blob = window.URL.createObjectURL(blob);
      window.open(url_blob);
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

  const handleEmitirCertificado = () => {
    if (isManualMode) {
      // Validar datos manuales
      if (!manualData.nombre || !manualData.apellido || !manualData.dni) {
        toast.error("Completá nombre, apellido y DNI del alumno");
        return;
      }
      if (!certificadoSeleccionado) {
        toast.error("Seleccioná un tipo de certificado");
        return;
      }

      emitirCertificado.mutate({
        certificadoId: certificadoSeleccionado,
        datosManual: manualData,
      });
    } else {
      // Validar alumno registrado
      if (!selectedAlumno?.id || !certificadoSeleccionado) {
        toast.error("Seleccioná un alumno y un tipo de certificado");
        return;
      }

      emitirCertificado.mutate({
        alumnoId: selectedAlumno.id,
        certificadoId: certificadoSeleccionado,
      });
    }
  };

  const handleModeChange = (manual) => {
    setIsManualMode(manual);
    setSelectedAlumno(null);
    setSearchTerm("");
    setManualData({
      nombre: "",
      apellido: "",
      dni: "",
      carrera: "",
      resolucion: "",
    });
  };

  // Determinar si se permite modo manual según el certificado
  const permiteModoManual = () => {
    const id = parseInt(certificadoSeleccionado);
    // ID 1: Alumno Regular - permite manual
    // ID 2: Materias Aprobadas - NO permite manual
    // ID 3: Asistencia a Examen - permite manual
    return id === 1 || id === 3;
  };

  // Resetear modo manual si se selecciona un certificado que no lo permite
  const handleCertificadoChange = (e) => {
    const nuevoCertificado = e.target.value;
    setCertificadoSeleccionado(nuevoCertificado);
    
    // Si el nuevo certificado no permite modo manual y estamos en modo manual, cambiar a registrado
    if (nuevoCertificado && isManualMode) {
      const id = parseInt(nuevoCertificado);
      if (id === 2) { // Materias Aprobadas
        setIsManualMode(false);
        setManualData({
          nombre: "",
          apellido: "",
          dni: "",
          carrera: "",
          resolucion: "",
        });
      }
    }
  };

  if (errorSearch) return <div>Error al buscar los alumnos</div>;

  return (
    <>
      <BotonVolver />
      <h1>Certificados</h1>
      <div className={styles.panel}>
        <div className={styles.selectorCertificado}>
          <h2>Seleccionar Certificado</h2>
          <select
            value={certificadoSeleccionado}
            onChange={handleCertificadoChange}
          >
            <option value="">Seleccione un certificado</option>
            {certificados.map((c) => (
              <option key={c.id} value={c.id}>
                {c.descripcion}
              </option>
            ))}
          </select>
        </div>
        
        {certificadoSeleccionado && (
          <div className={styles.selectorAlumno}>
            {permiteModoManual() && (
              <div className={styles.modeSelector}>
                <button onClick={() => handleModeChange(false)}>
                  Alumno Registrado
                </button>
                <button onClick={() => handleModeChange(true)}>
                  Alumno No Registrado
                </button>
              </div>
            )}
            {!isManualMode ? (
              <div className={styles.buscador}>
                <h2>Buscar Alumno Registrado</h2>
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
                    Seleccionado: {selectedAlumno.nombre}{" "}
                    {selectedAlumno.apellido} - {selectedAlumno.dni}
                  </div>
                )}
              </div>
            ) : (
              // Modo manual para alumno no registrado
              <div className={styles.manual}>
                <h2>Datos del Alumno No Registrado</h2>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={manualData.nombre}
                  onChange={(e) =>
                    setManualData((prev) => ({ ...prev, nombre: e.target.value }))
                  }
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={manualData.apellido}
                  onChange={(e) =>
                    setManualData((prev) => ({
                      ...prev,
                      apellido: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  placeholder="DNI"
                  value={manualData.dni}
                  onChange={(e) =>
                    setManualData((prev) => ({ ...prev, dni: e.target.value }))
                  }
                />
                <input
                  type="text"
                  placeholder="Carrera (opcional)"
                  value={manualData.carrera}
                  onChange={(e) =>
                    setManualData((prev) => ({
                      ...prev,
                      carrera: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  placeholder="Resolución del plan (opcional)"
                  value={manualData.resolucion}
                  onChange={(e) =>
                    setManualData((prev) => ({
                      ...prev,
                      resolucion: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </div>
        )}
        {certificadoSeleccionado && (
          <Boton
            variant="success"
            onClick={handleEmitirCertificado}
            disabled={emitirCertificado.isPending}
          >
            {emitirCertificado.isPending ? "Generando..." : "Emitir Certificado"}
          </Boton>
        )}
      </div>
    </>
  );
};

export default Certificados;
