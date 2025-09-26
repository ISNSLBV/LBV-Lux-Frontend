import React from "react";
import styles from "./InscripcionFinales.module.css";
import { useQuery, useQueries } from "@tanstack/react-query";
import api from "../../../api/axios";
import Boton from "../../../components/Boton/Boton";
import { formatearFechaSinZonaHoraria } from "../../../utils/dateUtils";

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

const obtenerFinales = async (planId) => {
  const { data } = await api.get(`/alumno/planes-estudio/${planId}/finales`);
  return data;
};

const validarRequisitosInscripcion = async (planId) => {
  try {
    const { data } = await api.get(
      `/alumno/planes-estudio/${planId}/finales/estado`
    );
    return data;
  } catch (error) {
    const mensaje =
      error?.response?.data?.message ??
      "No se pudo validar los requisitos para este examen.";
    return {
      success: false,
      data: { puedeInscribirse: false },
      message: mensaje,
    };
  }
};

const InscripcionFinales = () => {
  const { data: planId, isLoading: planLoading } = useQuery({
    queryKey: ["planId"],
    queryFn: obtenerPlanEstudio,
  });

  const { data: finales, isLoading: finalesLoading } = useQuery({
    queryKey: ["finales", planId],
    queryFn: () => obtenerFinales(planId),
    enabled: !!planId,
  });

  const {
    data: requisitosData,
    isLoading: requisitosLoading,
    isError: requisitosError,
  } = useQuery({
    queryKey: ["requisitosFinales", planId],
    queryFn: () => validarRequisitosInscripcion(planId),
    enabled: !!planId,
    retry: false,
  });

  if (
    finalesLoading ||
    planLoading ||
    requisitosLoading)
    return <div>Cargando...</div>;

  if (!finales || finales.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.titulo}>
          <h1>Inscripción a exámenes finales</h1>
        </div>
        <div className={styles.mensaje}>
          <p>No hay exámenes finales disponibles</p>
        </div>
      </div>
    );
  }

  const requisitosMap = new Map();
  if (requisitosData?.success && requisitosData?.data) {
    requisitosData.data.forEach((requisito) => {
      requisitosMap.set(requisito.idExamenFinal, requisito);
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Inscripción a exámenes finales</h1>
      </div>
      <div className={styles.listaFinales}>
        {finales.map((final, index) => {
          const requisito = requisitosMap.get(final.id);
          const puedeInscribirse = requisito?.puedeInscribirse ?? false;
          const razonBloqueo = requisito?.razonBloqueo;
          const mensajeBloqueo = requisitosError
            ? "No se pudo validar los requisitos."
            : requisitosData?.success === false
            ? requisitosData?.message
            : razonBloqueo;
          return (
            <div key={final.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{final.materiaPlan?.materia?.nombre}</h3>
                <span>
                  <strong>Estado: {final.estado}</strong>
                </span>
              </div>
              <div className={styles.datosAdicionales}>
                <div>
                  <p>Profesor</p>
                  <p>
                    <strong>
                      {final.Profesor?.persona?.nombre}{" "}
                      {final.Profesor?.persona?.apellido}
                    </strong>
                  </p>
                </div>
              </div>
              <div className={styles.inscripcion}>
                <div>
                  <p>Fecha</p>
                  <p>
                    <strong>{formatearFechaSinZonaHoraria(final.fecha)}</strong>
                  </p>
                </div>
                <div className={styles.botonInscribirse}>
                  <Boton
                    disabled={
                      requisitosLoading ||
                      requisitosError ||
                      puedeInscribirse === false
                    }
                    title={mensajeBloqueo}
                  >
                    {requisitosLoading
                      ? "Validando..."
                      : puedeInscribirse
                      ? "Inscribirse"
                      : "No disponible"}
                  </Boton>
                </div>
              </div>
              {razonBloqueo && (
                <div className={styles.observaciones}>
                  <p>
                    <strong>Observaciones:</strong>
                  </p>
                  <p>{razonBloqueo}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InscripcionFinales;
