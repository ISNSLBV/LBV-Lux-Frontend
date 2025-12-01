import React, { useState } from "react";
import styles from "./InscripcionMaterias.module.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import Boton from "../../../components/Boton/Boton";
import { toast } from "react-toastify";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";
import { useAuth } from "../../../contexts/AuthContext";

const obtenerCarreras = async () => {
  const { data } = await api.get("/alumno/carreras");
  return data;
};

const obtenerPlanesEstudio = async () => {
  const { data } = await api.get(
    "/admin/plan-estudio/alumno/obtener-plan-asignado"
  );
  return data?.carreras || [];
};

const obtenerMateriasCicloActual = async (planId) => {
  if (!planId) return null;
  const { data } = await api.get(
    `/admin/materia/materia-plan-ciclo/${planId}/materias-ciclo-actual`
  );
  return data;
};

const verificarEstadoInscripciones = async (planId) => {
  if (!planId) return null;
  const { data } = await api.get(
    `/alumno/verificar-estado-inscripciones/${planId}`
  );
  return data;
};

const obtenerConfiguracionSistema = async () => {
  const { data } = await api.get("/admin/configuracion/publica");
  return data;
};

const InscripcionMaterias = () => {
  const navigate = useNavigate();
  const { estadoCarreras } = useAuth();
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);

  // Verificar si puede acceder
  React.useEffect(() => {
    if (estadoCarreras && !estadoCarreras.puedeAcceder) {
      toast.error("No tienes acceso a esta sección. Estás dado de baja en todas tus carreras.");
      navigate("/alumno");
    }
  }, [estadoCarreras, navigate]);

  const { data: configuracion, isLoading: configuracionLoading } = useQuery({
    queryKey: ["configuracionSistema"],
    queryFn: obtenerConfiguracionSistema,
    onError: (error) => {
      console.error("Error al obtener configuración: ", error);
    },
  });

  const { data: carreras, isLoading: carrerasLoading } = useQuery({
    queryKey: ["carrerasInscripto"],
    queryFn: obtenerCarreras,
    onError: (error) => {
      console.error("Error al obtener las carreras: ", error);
    },
  });

  // Seleccionar automáticamente la primera carrera cuando se carguen
  React.useEffect(() => {
    if (carreras && carreras.length > 0 && !carreraSeleccionada) {
      setCarreraSeleccionada(carreras[0].id.toString());
    }
  }, [carreras, carreraSeleccionada]);

  const { data: planesCarreras, isLoading: planesLoading } = useQuery({
    queryKey: ["planesEstudio"],
    queryFn: obtenerPlanesEstudio,
    onError: (error) => {
      console.error("Error al obtener los planes de estudio: ", error);
    },
  });

  // Obtener el plan de la carrera seleccionada
  const planSeleccionado = React.useMemo(() => {
    if (!planesCarreras || !carreraSeleccionada) return null;
    const carrera = planesCarreras.find(
      (c) => c.idCarrera === parseInt(carreraSeleccionada)
    );
    return carrera?.idPlanAsignado || carrera?.plan?.id || null;
  }, [planesCarreras, carreraSeleccionada]);

  const { data: response, isLoading: materiasLoading } = useQuery({
    queryKey: ["materiasCicloActual", planSeleccionado],
    queryFn: () => obtenerMateriasCicloActual(planSeleccionado),
    enabled: !!planSeleccionado,
    onError: (error) => {
      console.error("Error al obtener las materias del ciclo actual: ", error);
    },
  });

  const { data: estadoInscripciones, isLoading: estadoLoading } = useQuery({
    queryKey: ["estadoInscripciones", planSeleccionado],
    queryFn: () => verificarEstadoInscripciones(planSeleccionado),
    enabled: !!planSeleccionado,
    onError: (error) => {
      console.error(
        "Error al verificar el estado de las inscripciones: ",
        error
      );
    },
  });

  const registrarInscripcion = useMutation({
    mutationFn: (data) =>
      api.post(
        `/alumno/inscripcion-materia/${data.idMateriaPlanCicloLectivo}`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["estadoInscripciones", planSeleccionado]);
      queryClient.invalidateQueries(["materiasCicloActual", planSeleccionado]);
      toast.success("Inscripción registrada correctamente");
    },
    onError: (error) => {
      console.error("Error al registrar la inscripción: ", error);
      const mensajeError = error.response?.data?.error || "Error al registrar la inscripción";
      toast.error(mensajeError);
    },
  });

  const queryClient = useQueryClient();

  if (carrerasLoading || planesLoading || materiasLoading || estadoLoading || configuracionLoading) {
    return <div>Cargando...</div>;
  }

  // Verificar si las inscripciones a materias están cerradas
  if (configuracion && configuracion.inscripciones_materias_abiertas === 0) {
    return (
      <>
        <BotonVolver />
        <div className={styles.titulo}>
          <h1>Inscripción a materias</h1>
        </div>
        <div className={styles.mensajeVacio}>
          <h2>Las inscripciones a materias se encuentran cerradas</h2>
          <p>Para más información comunicate con secretaría por los siguientes medios:</p>
          <div style={{ marginTop: '1rem' }}>
            <p>Email: <strong>terciario@lujanbuenviaje.edu.ar</strong></p>
            <p>Teléfono: <strong>(011) 5263-2395</strong></p>
          </div>
        </div>
      </>
    );
  }

  const { materias, planEstudio, cicloLectivo, total } = response || {};
  const { data: estadoMaterias, resumen } = estadoInscripciones || {};

  const estadoMateriasMap = new Map();
  estadoMaterias?.forEach((estado) => {
    // Usar idMateriaPlanCicloLectivo como clave principal
    if (estado?.idMateriaPlanCicloLectivo) {
      estadoMateriasMap.set(estado.idMateriaPlanCicloLectivo, estado);
    }
    // También guardar por idMateriaPlan como fallback
    if (estado?.idMateriaPlan) {
      estadoMateriasMap.set(`plan_${estado.idMateriaPlan}`, estado);
    }
  });

  const handleInscripcion = (materia) => {
    const tipoAlumno = document.getElementById(
      `tipoAlumno-${materia.id}`
    ).value;
    registrarInscripcion.mutate({
      idMateriaPlanCicloLectivo: materia.id,
      idTipoAlumno: Number(tipoAlumno),
    });
  };

  const getEstadoBadge = (estado) => {
    if (estado?.yaAprobado) {
      return (
        <span className={`${styles.badge} ${styles.aprobado}`}>Aprobada</span>
      );
    }
    if (estado?.yaInscripto) {
      return (
        <span className={`${styles.badge} ${styles.inscripto}`}>
          Inscripto/a
        </span>
      );
    }
    if (!estado?.correlativasCumplidas) {
      return (
        <span className={`${styles.badge} ${styles.bloqueado}`}>
          Correlativas pendientes
        </span>
      );
    }
    return (
      <span className={`${styles.badge} ${styles.disponible}`}>Disponible</span>
    );
  };

  const getBotonTexto = (estado) => {
    if (registrarInscripcion.isPending) return "Inscribiendo...";
    if (estado?.yaAprobado) return "Materia Aprobada";
    if (estado?.yaInscripto) return "Inscripto/a";
    if (!estado?.correlativasCumplidas) return "Correlativas Pendientes";
    return "Inscribirse";
  };

  // Filtrar materias que NO estén aprobadas
  const filtrarMaterias = (materiasArray) => {
    return materiasArray?.filter((materia) => {
      // Buscar el estado usando el ID correcto de la materia
      const estado = estadoMateriasMap.get(materia.id) || 
                     estadoMateriasMap.get(materia.idMateriaPlanCicloLectivo);
      
      // Excluir materias ya aprobadas
      if (estado?.yaAprobado) return false;
      
      return true;
    });
  };

  return (
    <>
      <BotonVolver />
      <div className={styles.titulo}>
        <h1>Inscripción a materias</h1>
      </div>

      <div className={styles.listaMaterias}>
        {!materias || materias.length === 0 ? (
          <div className={styles.mensajeVacio}>
            <p>No hay materias disponibles en el ciclo lectivo actual</p>
          </div>
        ) : filtrarMaterias(materias)?.filter((materia) => {
          const estado = estadoMateriasMap.get(materia.id) || 
                        estadoMateriasMap.get(materia.idMateriaPlanCicloLectivo);
          return estado?.puedeInscribirse;
        }).length > 0 ? (
          <div className={styles.seccionMaterias}>
            <div className={styles.headerSeccion}>
              <h2 className={styles.tituloSeccion}>
                Materias disponibles para inscripción
              </h2>
              {carreras && carreras.length > 1 && (
                <select
                  className={styles.filtroCarrera}
                  value={carreraSeleccionada || ""}
                  onChange={(e) => setCarreraSeleccionada(e.target.value)}
                >
                  {carreras.map((carrera) => (
                    <option key={carrera.id} value={carrera.id}>
                      {carrera.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {filtrarMaterias(materias)
              ?.filter((materia) => {
                const estado = estadoMateriasMap.get(materia.id) || 
                              estadoMateriasMap.get(materia.idMateriaPlanCicloLectivo);
                return estado?.puedeInscribirse;
              })
              .map((materia) => {
                const estado = estadoMateriasMap.get(materia.id) || 
                              estadoMateriasMap.get(materia.idMateriaPlanCicloLectivo);

                return (
                  <div key={materia.id} className={styles.materiaCard}>
                    <div className={styles.materiaHeader}>
                      <h3>{materia.nombre}</h3>
                      {getEstadoBadge(estado)}
                    </div>

                    <div className={styles.materiaDetails}>
                      <p>
                        <strong>Tipo de aprobación:</strong>{" "}
                        {materia.tipoAprobacion === "P"
                          ? "Promocionable"
                          : materia.tipoAprobacion === "NP"
                          ? "No Promocionable (directo a final)"
                          : "Exclusivamente Promocionable"}
                      </p>
                      <p>
                        <strong>Fecha de inicio:</strong> {materia.fechaInicio}
                      </p>
                      <p>
                        <strong>Fecha de cierre:</strong> {materia.fechaCierre}
                      </p>
                    </div>

                    <div className={styles.accionesMateria}>
                      <select
                        name={`tipoAlumno-${materia.id}`}
                        id={`tipoAlumno-${materia.id}`}
                        disabled={!estado?.puedeInscribirse}
                        className={styles.selectTipoAlumno}
                      >
                        <option value="1">Regular</option>
                        <option value="2">Libre</option>
                        <option value="3">Oyente</option>
                        <option value="4">Itinerante</option>
                      </select>

                      <Boton
                        variant={
                          estado?.puedeInscribirse ? "success" : "primary"
                        }
                        disabled={
                          !estado?.puedeInscribirse ||
                          registrarInscripcion.isPending
                        }
                        onClick={() => handleInscripcion(materia)}
                        title={estado?.razonBloqueo}
                      >
                        {getBotonTexto(estado)}
                      </Boton>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className={styles.mensajeVacio}>
            <p>No hay materias disponibles para inscribirse</p>
          </div>
        )}

        {materias && materias.length > 0 && filtrarMaterias(materias)?.filter((materia) => {
          const estado = estadoMateriasMap.get(materia.id) || 
                        estadoMateriasMap.get(materia.idMateriaPlanCicloLectivo);
          return !estado?.puedeInscribirse;
        }).length > 0 && (
          <div className={styles.seccionMaterias}>
            <div className={styles.headerSeccion}>
              <h2 className={styles.tituloSeccion}>Materias no disponibles</h2>
              {carreras && carreras.length > 1 && (
                <select
                  className={styles.filtroCarrera}
                  value={carreraSeleccionada}
                  onChange={(e) => setCarreraSeleccionada(e.target.value)}
                >
                  <option value="todas">Todas las carreras</option>
                  {carreras.map((carrera) => (
                    <option key={carrera.id} value={carrera.id}>
                      {carrera.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {filtrarMaterias(materias)
              ?.filter((materia) => {
                const estado = estadoMateriasMap.get(materia.id) || 
                              estadoMateriasMap.get(materia.idMateriaPlanCicloLectivo);
                return !estado?.puedeInscribirse;
              })
              .map((materia) => {
                const estado = estadoMateriasMap.get(materia.id) || 
                              estadoMateriasMap.get(materia.idMateriaPlanCicloLectivo);

                return (
                  <div key={materia.id} className={styles.materiaCard}>
                    <div className={styles.materiaHeader}>
                      <h3>{materia.nombre}</h3>
                      {getEstadoBadge(estado)}
                    </div>

                    <div className={styles.materiaDetails}>
                      <p>
                        <strong>Tipo de aprobación:</strong>{" "}
                        {materia.tipoAprobacion === "P"
                          ? "Promocionable"
                          : materia.tipoAprobacion === "NP"
                          ? "No Promocionable (directo a final)"
                          : "Exclusivamente Promocionable"}
                      </p>
                      <p>
                        <strong>Fecha de inicio:</strong> {materia.fechaInicio}
                      </p>
                      <p>
                        <strong>Fecha de cierre:</strong> {materia.fechaCierre}
                      </p>
                    </div>

                    {/* Mostrar correlativas si no están cumplidas */}
                    {estado &&
                      !estado.correlativasCumplidas &&
                      estado.correlativasPendientes?.length > 0 && (
                        <div className={styles.correlativas}>
                          <p>
                            <strong>Materias correlativas pendientes:</strong>
                          </p>
                          <ul>
                            {estado.correlativasPendientes.map((cp, index) => {
                              // cp puede ser un string (nombre) o un objeto { id, nombre }
                              const nombre =
                                cp?.nombre ?? cp ?? "Materia desconocida";
                              const key = cp?.id ?? index;
                              return <li key={key}>{nombre}</li>;
                            })}
                          </ul>
                        </div>
                      )}

                    <div className={styles.accionesMateria}>
                      <select
                        name={`tipoAlumno-${materia.id}`}
                        id={`tipoAlumno-${materia.id}`}
                        disabled={!estado?.puedeInscribirse}
                        className={styles.selectTipoAlumno}
                      >
                        <option value="1">Regular</option>
                        <option value="2">Libre</option>
                        <option value="3">Oyente</option>
                        <option value="4">Itinerante</option>
                      </select>

                      <Boton
                        variant={
                          estado?.puedeInscribirse ? "success" : "primary"
                        }
                        disabled={
                          !estado?.puedeInscribirse ||
                          registrarInscripcion.isPending
                        }
                        onClick={() => handleInscripcion(materia)}
                        title={estado?.razonBloqueo}
                      >
                        {getBotonTexto(estado)}
                      </Boton>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
};

export default InscripcionMaterias;
