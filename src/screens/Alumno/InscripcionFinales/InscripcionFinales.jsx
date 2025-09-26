import React from "react";
import styles from "./InscripcionFinales.module.css";
import { useQuery } from "@tanstack/react-query";
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

const InscripcionFinales = () => {
  const { data: planId, isLoading: planLoading } = useQuery({
    queryKey: ["planId"],
    queryFn: obtenerPlanEstudio,
  });

  const { data: finales, isLoading } = useQuery({
    queryKey: ["finales", planId],
    queryFn: () => obtenerFinales(planId),
    enabled: !!planId,
  });

  if (isLoading || planLoading) return <div>Cargando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Inscripción a exámenes finales</h1>
      </div>
      <div className={styles.listaFinales}>
        {finales.map((final) => (
          <div key={final.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{final.materiaPlan.materia.nombre}</h3>
              <span>
                <strong>Estado: {final.estado}</strong>
              </span>
            </div>
            <div className={styles.datosAdicionales}>
              <div>
                <p>Profesor</p>
                <p>
                  <strong>
                    {final.Profesor.persona.nombre}{" "}
                    {final.Profesor.persona.apellido}
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
                <Boton onClick={() => handleInscribirse(final.id)}>
                  Inscribirse
                </Boton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InscripcionFinales;
