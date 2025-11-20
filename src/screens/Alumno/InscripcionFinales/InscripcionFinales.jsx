import React from "react";
import styles from "./InscripcionFinales.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axios";
import Boton from "../../../components/Boton/Boton";
import { formatearFechaSinZonaHoraria } from "../../../utils/dateUtils";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";
import EstadoBadge from "../../../components/EstadoBadge/EstadoBadge";
import { toast } from "react-toastify";

const obtenerPlanEstudio = async () => {
  const { data } = await api.get("/admin/plan-estudio/alumno/obtener-plan-asignado");
  return data?.carreras?.[0]?.plan?.id ?? data?.carreras?.[0]?.idPlanAsignado ?? null;
};

const validarRequisitosInscripcion = async (planId) => {
  try {
    const { data } = await api.get(`/alumno/planes-estudio/${planId}/finales/estado`);
    return data;
  } catch (error) {
    return {
      success: false,
      estadosFinales: [],
      message: error?.response?.data?.message ?? "No se pudo validar los requisitos.",
    };
  }
};

const inscribirseExamenFinal = async ({ idExamenFinal, idInscripcionMateria }) => {
  const { data } = await api.post(`/alumno/examen-final/inscripcion/${idExamenFinal}`, { idInscripcionMateria });
  return data;
};

const obtenerConfiguracionSistema = async () => {
  const { data } = await api.get("/admin/configuracion/publica");
  return data;
};

const InscripcionFinales = () => {
  const queryClient = useQueryClient();

  const { data: configuracion, isLoading: configuracionLoading } = useQuery({
    queryKey: ["configuracionSistema"],
    queryFn: obtenerConfiguracionSistema,
    onError: (error) => {
      console.error("Error al obtener configuración: ", error);
    },
  });

  const { data: planId, isLoading: planLoading } = useQuery({
    queryKey: ["planId"],
    queryFn: obtenerPlanEstudio,
  });

  const { data: requisitosData, isLoading: requisitosLoading } = useQuery({
    queryKey: ["requisitosFinales", planId],
    queryFn: () => validarRequisitosInscripcion(planId),
    enabled: !!planId,
    retry: false,
  });

  const inscripcionMutation = useMutation({
    mutationFn: inscribirseExamenFinal,
    onSuccess: () => {
      queryClient.invalidateQueries(["requisitosFinales", planId]);
      toast.success("Inscripción realizada con éxito");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error al realizar la inscripción");
    },
  });

  const handleInscribirse = (idExamenFinal, idInscripcionMateria) => {
    if (!idInscripcionMateria) {
      toast.error("No se encontró una inscripción para esta materia.");
      return;
    }
    inscripcionMutation.mutate({ idExamenFinal, idInscripcionMateria });
  };

  if (planLoading || requisitosLoading || configuracionLoading) {
    return <div>Cargando...</div>;
  }

  // Verificar si las inscripciones a finales están cerradas
  if (configuracion && configuracion.inscripciones_finales_abiertas === 0) {
    return (
      <>
        <BotonVolver />
        <div className={styles.titulo}>
          <h1>Inscripción a exámenes finales</h1>
        </div>
        <div className={styles.mensajeVacio}>
          <h2>Las inscripciones a exámenes finales se encuentran cerradas</h2>
          <p>Para más información comunicate con secretaría por los siguientes medios:</p>
          <div style={{ marginTop: '1rem' }}>
            <p>Email: <strong>terciario@lujanbuenviaje.edu.ar</strong></p>
            <p>Teléfono: <strong>(011) 5263-2395</strong></p>
          </div>
        </div>
      </>
    );
  }

  const finalesDisponibles = requisitosData?.estadosFinales?.filter((final) => !final.yaInscriptoFinal) || [];

  if (finalesDisponibles.length === 0) {
    return (
      <>
        <BotonVolver />
        <div className={styles.titulo}>
          <h1>Inscripción a exámenes finales</h1>
        </div>
        <div className={styles.mensaje}>
          <p>No hay exámenes finales disponibles</p>
        </div>
      </>
    );
  }

  return (
    <>
      <BotonVolver />
      <div className={styles.titulo}>
        <h1>Inscripción a exámenes finales</h1>
      </div>
      <div className={styles.listaFinales}>
        {finalesDisponibles.map((final) => {
          const puedeInscribirse = final.puedeInscribirse ?? false;
          const mensajeBloqueo = final.razonBloqueo || "No disponible";

          return (
            <div key={final.idExamenFinal} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{final.materia?.nombre}</h3>
                <EstadoBadge estado={final.estadoExamen} />
              </div>
              <div className={styles.datosAdicionales}>
                <div>
                  <p>Profesor</p>
                  <p>
                    <strong>
                      {final.profesor?.nombre} {final.profesor?.apellido}
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
                    disabled={!puedeInscribirse || inscripcionMutation.isPending}
                    title={mensajeBloqueo}
                    onClick={() => handleInscribirse(final.idExamenFinal, final.idInscripcionMateria)}
                  >
                    {inscripcionMutation.isPending ? "Inscribiendo..." : puedeInscribirse ? "Inscribirse" : "No disponible"}
                  </Boton>
                </div>
              </div>
              {final.razonBloqueo && (
                <div className={styles.observaciones}>
                  <p>
                    <strong>Observaciones:</strong>
                  </p>
                  <p>{final.razonBloqueo}</p>
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
