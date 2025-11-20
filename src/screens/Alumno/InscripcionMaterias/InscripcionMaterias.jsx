import React, { useState } from "react";
import styles from "./InscripcionMaterias.module.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "../../../api/axios";
import Boton from "../../../components/Boton/Boton";
import { toast } from "react-toastify";
import BotonVolver from "../../../components/BotonVolver/BotonVolver"

const obtenerCarreras = async () => {
  const { data } = await api.get("/alumno/carreras");
  return data;
};

const obtenerPlanEstudio = async () => {
  const { data } = await api.get(
    "/admin/plan-estudio/alumno/obtener-plan-asignado"
  );

  const planId =
    data?.carreras?.[0]?.plan?.id ??
    data?.carreras?.[0]?.idPlanAsignado ??
    null;

  return planId;
};

const obtenerMateriasCicloActual = async (planId) => {
  const { data } = await api.get(
    `/admin/materia/materia-plan-ciclo/${planId}/materias-ciclo-actual`
  );
  return data;
};

const verificarEstadoInscripciones = async (planId) => {
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
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("todas");

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

  const { data: planId, isLoading: planLoading } = useQuery({
    queryKey: ["planEstudio"],
    queryFn: obtenerPlanEstudio,
    onError: (error) => {
      console.error("Error al obtener el plan de estudio: ", error);
    },
  });

  const { data: response, isLoading: materiasLoading } = useQuery({
    queryKey: ["materiasCicloActual", planId],
    queryFn: () => obtenerMateriasCicloActual(planId),
    enabled: !!planId,
    onError: (error) => {
      console.error("Error al obtener las materias del ciclo actual: ", error);
    },
  });

  const { data: estadoInscripciones, isLoading: estadoLoading } = useQuery({
    queryKey: ["estadoInscripciones", planId],
    queryFn: () => verificarEstadoInscripciones(planId),
    enabled: !!planId,
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
      queryClient.invalidateQueries(["estadoInscripciones", planId]);
      queryClient.invalidateQueries(["materiasCicloActual", planId]);
      toast.success("Inscripción registrada correctamente");
    },
    onError: (error) => {
      console.error("Error al registrar la inscripción: ", error);
      const mensajeError = error.response?.data?.error || "Error al registrar la inscripción";
      toast.error(mensajeError);
    },
  });

  const queryClient = useQueryClient();

  if (carrerasLoading || planLoading || materiasLoading || estadoLoading || configuracionLoading) {
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

  // Filtrar materias que NO estén aprobadas y por carrera seleccionada
  const filtrarMaterias = (materiasArray) => {
    return materiasArray?.filter((materia) => {
      // Buscar el estado usando el ID correcto de la materia
      const estado = estadoMateriasMap.get(materia.id) || 
                     estadoMateriasMap.get(materia.idMateriaPlanCicloLectivo);
      
      // Excluir materias ya aprobadas
      if (estado?.yaAprobado) return false;
      
      // Filtrar por carrera si hay una seleccionada
      // if (carreraSeleccionada !== "todas") {
      //   return materia.idCarrera === parseInt(carreraSeleccionada);
      // }
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
                          estado?.puedeInscribirse ? "success" : "secondary"
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
