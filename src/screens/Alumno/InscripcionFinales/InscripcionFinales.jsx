import React, { useState } from "react";
import styles from "./InscripcionFinales.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axios";
import Boton from "../../../components/Boton/Boton";
import { formatearFechaSinZonaHoraria } from "../../../utils/dateUtils";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";
import EstadoBadge from "../../../components/EstadoBadge/EstadoBadge";
import { toast } from "react-toastify";

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

const inscribirseExamenFinal = async ({ idExamenFinal, idInscripcionMateria }) => {
  const { data } = await api.post(
    `/alumno/examen-final/inscripcion/${idExamenFinal}`,
    { idInscripcionMateria }
  );
  return data;
};

const InscripcionFinales = () => {
  const [mensaje, setMensaje] = useState(null);
  const queryClient = useQueryClient();

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

  const inscripcionMutation = useMutation({
    mutationFn: inscribirseExamenFinal,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["finales", planId]);
      queryClient.invalidateQueries(["requisitosFinales", planId]);
      toast.success("Inscripción realizada con éxito");
    },
    onError: (error) => {
      const mensajeError =
        error?.response?.data?.message || "Error al realizar la inscripción";
      toast.error(mensajeError);
    },
  });

  const handleInscribirse = (idExamenFinal, idInscripcionMateria) => {
    if (!idInscripcionMateria) {
      toast.error("No se encontró una inscripción para esta materia.");
      return;
    }
    inscripcionMutation.mutate({ idExamenFinal, idInscripcionMateria });
  };

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
    <>
      <BotonVolver />
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
                <EstadoBadge estado={final.estado} />
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
                    variant="primary"
                    disabled={
                      requisitosLoading ||
                      requisitosError ||
                      puedeInscribirse === false ||
                      inscripcionMutation.isPending
                    }
                    title={mensajeBloqueo}
                    onClick={() => handleInscribirse(final.id, requisito?.idInscripcionMateria)}
                  >
                    {inscripcionMutation.isPending
                      ? "Inscribiendo..."
                      : requisitosLoading
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
    </>
  );
};

export default InscripcionFinales;
