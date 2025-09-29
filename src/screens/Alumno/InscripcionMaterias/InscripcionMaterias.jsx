import React from "react";
import styles from "./InscripcionMaterias.module.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "../../../api/axios";
import Boton from "../../../components/Boton/Boton";
import { toast } from "react-toastify";
import BotonVolver from "../../../components/BotonVolver/BotonVolver"

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

const InscripcionMaterias = () => {
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
    },
  });

  const queryClient = useQueryClient();

  if (planLoading || materiasLoading || estadoLoading) {
    return <div>Cargando...</div>;
  }

  const { materias, planEstudio, cicloLectivo, total } = response || {};
  const { data: estadoMaterias, resumen } = estadoInscripciones || {};

  const estadoMateriasMap = new Map();
  estadoMaterias?.forEach((estado) => {
    if (estado?.idMateriaPlanCicloLectivo) {
      estadoMateriasMap.set(estado.idMateriaPlanCicloLectivo, estado);
    }
    if (estado?.idMateriaPlan) {
      estadoMateriasMap.set(estado.idMateriaPlan, estado);
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
          Ya inscripto/a
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
    if (estado?.yaInscripto) return "Ya Inscripto";
    if (!estado?.correlativasCumplidas) return "Correlativas Pendientes";
    return "Inscribirse";
  };

  return (
    <div className={styles.container}>
      <BotonVolver />
      <div className={styles.titulo}>
        <h1>Inscripción a materias</h1>
      </div>

      {resumen && (
        <div className={styles.resumen}>
          <h3>Resumen de Inscripciones</h3>
          <div className={styles.resumenGrid}>
            <div className={styles.resumenItem}>
              <span className={styles.numero}>
                {resumen.disponiblesParaInscripcion}
              </span>
              <span className={styles.etiqueta}>Disponibles</span>
            </div>
            <div className={styles.resumenItem}>
              <span className={styles.numero}>{resumen.yaInscriptas}</span>
              <span className={styles.etiqueta}>Ya inscripto/a</span>
            </div>
            <div className={styles.resumenItem}>
              <span className={styles.numero}>{resumen.yaAprobadas}</span>
              <span className={styles.etiqueta}>Ya aprobada</span>
            </div>
            <div className={styles.resumenItem}>
              <span className={styles.numero}>
                {resumen.bloqueadasPorCorrelativas}
              </span>
              <span className={styles.etiqueta}>Bloqueadas</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.listaMaterias}>
        {materias?.filter((materia) => {
          const estado = estadoMateriasMap.get(materia.id);
          return estado?.puedeInscribirse;
        }).length > 0 && (
          <div className={styles.seccionMaterias}>
            <h2 className={styles.tituloSeccion}>
              Materias disponibles para inscripción
            </h2>
            {materias
              ?.filter((materia) => {
                const estado = estadoMateriasMap.get(materia.id);
                return estado?.puedeInscribirse;
              })
              .map((materia) => {
                const estado = estadoMateriasMap.get(materia.id);

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
        )}

        {materias?.filter((materia) => {
          const estado = estadoMateriasMap.get(materia.id);
          return !estado?.puedeInscribirse;
        }).length > 0 && (
          <div className={styles.seccionMaterias}>
            <h2 className={styles.tituloSeccion}>Materias no disponibles</h2>
            {materias
              ?.filter((materia) => {
                const estado = estadoMateriasMap.get(materia.id);
                return !estado?.puedeInscribirse;
              })
              .map((materia) => {
                const estado = estadoMateriasMap.get(materia.id);

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
    </div>
  );
};

export default InscripcionMaterias;
