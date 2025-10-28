import React, { useState, useEffect } from "react";
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
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");

  const [isManualMode, setIsManualMode] = useState(false);
  const [manualData, setManualData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    carrera: "",
    resolucion: "",
    // Campos adicionales para certificado de asistencia a examen
    nombreCarrera: "",
    anioCarrera: "",
    nombreMateria: "",
    diaExamen: "",
    mesExamen: "",
    anioExamen: "",
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

  // Query para obtener detalles del alumno seleccionado incluyendo carreras e inscripciones
  const {
    data: alumnoDetalle,
    isLoading: isLoadingDetalle,
  } = useQuery({
    queryKey: ["alumnoDetalle", selectedAlumno?.id],
    queryFn: () =>
      api.get(`/usuario/perfil/${selectedAlumno.id}`).then((res) => res.data),
    enabled: !!selectedAlumno?.id && !isManualMode,
  });

  // Función para calcular el año de carrera
  const calcularAnioCarrera = () => {
    if (!alumnoDetalle || !alumnoDetalle.inscripcionesActuales) {
      return "";
    }
    
    // Obtener todos los años
    const anios = alumnoDetalle.inscripcionesActuales.map(i => parseInt(i.anio_carrera) || 0);
    
    // Quedarse con el más alto
    const anioMasAlto = Math.max(...anios);

    // Convertir a texto
    const aniosTexto = {
      1: "Primer año",
      2: "Segundo año",
      3: "Tercer año",
    };

    return aniosTexto[anioMasAlto] || "";
  };

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

        // Si es certificado de asistencia a examen (id 3), agregar campos adicionales
        if (parseInt(certificadoId) === 3) {
          params = {
            ...params,
            nombreCarrera: datosManual.nombreCarrera,
            anioCarrera: datosManual.anioCarrera,
            nombreMateria: datosManual.nombreMateria,
            diaExamen: datosManual.diaExamen,
            mesExamen: datosManual.mesExamen,
            anioExamen: datosManual.anioExamen,
          };
        }
      } else {
        // Para alumno registrado - usar path param
        url = `/pdf/certificado/${certificadoId}/${alumnoId}`;
        
        // Si es certificado de asistencia a examen, incluir datos del examen como params
        if (parseInt(certificadoId) === 3 && datosManual) {
          params = {
            nombreCarrera: datosManual.nombreCarrera,
            anioCarrera: datosManual.anioCarrera,
            nombreMateria: datosManual.nombreMateria,
            diaExamen: datosManual.diaExamen,
            mesExamen: datosManual.mesExamen,
            anioExamen: datosManual.anioExamen,
          };
        }
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
    const certificadoId = parseInt(certificadoSeleccionado);
    
    if (isManualMode) {
      // Validar datos manuales básicos
      if (!manualData.nombre || !manualData.apellido || !manualData.dni) {
        toast.error("Completá nombre, apellido y DNI del alumno");
        return;
      }
      if (!certificadoSeleccionado) {
        toast.error("Seleccioná un tipo de certificado");
        return;
      }

      // Validaciones específicas para certificado de asistencia a examen
      if (certificadoId === 3) {
        if (!manualData.nombreMateria || !manualData.diaExamen || !manualData.mesExamen || !manualData.anioExamen) {
          toast.error("Completá todos los datos del examen (materia, día, mes y año)");
          return;
        }
      }

      emitirCertificado.mutate({
        certificadoId: certificadoSeleccionado,
        datosManual: manualData,
      });
    } else {
      // Alumno registrado
      if (!selectedAlumno?.id || !certificadoSeleccionado) {
        toast.error("Seleccioná un alumno y un tipo de certificado");
        return;
      }

      // Si es certificado de asistencia a examen, validar datos del examen
      if (certificadoId === 3) {
        if (!manualData.nombreMateria || !manualData.diaExamen || !manualData.mesExamen || !manualData.anioExamen) {
          toast.error("Completá todos los datos del examen (materia, día, mes y año)");
          return;
        }
        
        emitirCertificado.mutate({
          alumnoId: selectedAlumno.id,
          certificadoId: certificadoSeleccionado,
          datosManual: manualData, // Incluir los datos del examen
        });
      } else {
        emitirCertificado.mutate({
          alumnoId: selectedAlumno.id,
          certificadoId: certificadoSeleccionado,
        });
      }
    }
  };

  const handleModeChange = (manual) => {
    setIsManualMode(manual);
    setSelectedAlumno(null);
    setSearchTerm("");
    setCarreraSeleccionada("");
    setManualData({
      nombre: "",
      apellido: "",
      dni: "",
      carrera: "",
      resolucion: "",
      nombreCarrera: "",
      anioCarrera: "",
      nombreMateria: "",
      diaExamen: "",
      mesExamen: "",
      anioExamen: "",
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
          nombreCarrera: "",
          anioCarrera: "",
          nombreMateria: "",
          diaExamen: "",
          mesExamen: "",
          anioExamen: "",
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
                
                {/* Campos adicionales para certificado de asistencia a examen */}
                {!isManualMode && parseInt(certificadoSeleccionado) === 3 && selectedAlumno && (
                  <div className={styles.datosExamen}>
                    <h3>Datos del Examen</h3>
                    
                    {/* Select de carreras */}
                    {isLoadingDetalle ? (
                      <p>Cargando carreras...</p>
                    ) : alumnoDetalle?.informacionPersonal?.carrera ? (
                      <>
                        <label>Carrera *</label>
                        <select
                          value={carreraSeleccionada}
                          onChange={(e) => {
                            const nombreCarrera = e.target.value;
                            setCarreraSeleccionada(nombreCarrera);
                            
                            // Calcular año automáticamente
                            const anio = calcularAnioCarrera();
                            
                            setManualData((prev) => ({
                              ...prev,
                              nombreCarrera: nombreCarrera,
                              anioCarrera: anio,
                            }));
                          }}
                        >
                          <option value="">Seleccione una carrera</option>
                          {alumnoDetalle.informacionPersonal.carrera.split(", ").map((carrera, index) => (
                            <option key={index} value={carrera}>
                              {carrera}
                            </option>
                          ))}
                        </select>
                        
                        {/* Año calculado automáticamente */}
                        {carreraSeleccionada !== "" && (
                          <div className={styles.anioCalculado}>
                            <label>Año de carrera</label>
                            <input
                              type="text"
                              value={manualData.anioCarrera || "No se pudo calcular"}
                              disabled
                              className={styles.inputDisabled}
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <p>No se encontraron carreras para este alumno</p>
                    )}
                    
                    <input
                      type="text"
                      placeholder="Nombre de la materia *"
                      value={manualData.nombreMateria}
                      onChange={(e) =>
                        setManualData((prev) => ({
                          ...prev,
                          nombreMateria: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="Día del examen *"
                      value={manualData.diaExamen}
                      onChange={(e) =>
                        setManualData((prev) => ({
                          ...prev,
                          diaExamen: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="Mes del examen (ej: octubre) *"
                      value={manualData.mesExamen}
                      onChange={(e) =>
                        setManualData((prev) => ({
                          ...prev,
                          mesExamen: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="Año del examen *"
                      value={manualData.anioExamen}
                      onChange={(e) =>
                        setManualData((prev) => ({
                          ...prev,
                          anioExamen: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
            ) : (
              // Modo manual para alumno no registrado
              <div className={styles.manual}>
                <h2>Datos del Alumno No Registrado</h2>
                <input
                  type="text"
                  placeholder="Nombre *"
                  value={manualData.nombre}
                  onChange={(e) =>
                    setManualData((prev) => ({ ...prev, nombre: e.target.value }))
                  }
                />
                <input
                  type="text"
                  placeholder="Apellido *"
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
                  placeholder="DNI *"
                  value={manualData.dni}
                  onChange={(e) =>
                    setManualData((prev) => ({ ...prev, dni: e.target.value }))
                  }
                />
                
                {/* Campos específicos según tipo de certificado */}
                {parseInt(certificadoSeleccionado) === 1 && (
                  <>
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
                  </>
                )}
                
                {parseInt(certificadoSeleccionado) === 3 && (
                  <>
                    <h3>Datos del Examen</h3>
                    <input
                      type="text"
                      placeholder="Nombre de la carrera"
                      value={manualData.nombreCarrera}
                      onChange={(e) =>
                        setManualData((prev) => ({
                          ...prev,
                          nombreCarrera: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="Año de la carrera (ej: primer año)"
                      value={manualData.anioCarrera}
                      onChange={(e) =>
                        setManualData((prev) => ({
                          ...prev,
                          anioCarrera: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="Nombre de la materia *"
                      value={manualData.nombreMateria}
                      onChange={(e) =>
                        setManualData((prev) => ({
                          ...prev,
                          nombreMateria: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="Día del examen *"
                      value={manualData.diaExamen}
                      onChange={(e) =>
                        setManualData((prev) => ({
                          ...prev,
                          diaExamen: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="Mes del examen (ej: octubre) *"
                      value={manualData.mesExamen}
                      onChange={(e) =>
                        setManualData((prev) => ({
                          ...prev,
                          mesExamen: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="Año del examen *"
                      value={manualData.anioExamen}
                      onChange={(e) =>
                        setManualData((prev) => ({
                          ...prev,
                          anioExamen: e.target.value,
                        }))
                      }
                    />
                  </>
                )}
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
