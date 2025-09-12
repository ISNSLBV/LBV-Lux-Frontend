import React, { useState } from "react";
import styles from "./Configuracion.module.css";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../../../../api/axios";
import { Calendar, User, Save, AlertTriangle } from "lucide-react";
import Boton from "../../../../../components/Boton/Boton";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { formatearFechaSinZonaHoraria, formatearFechaParaInput } from "../../../../../utils/dateUtils";

const validationSchema = Yup.object({
  fecha: Yup.date()
    .required("La fecha es obligatoria")
    .test('fecha-futura', 'La fecha debe ser futura', function(value) {
      if (!value) return false;
      const hoy = new Date();
      const fechaSeleccionada = new Date(value);
      // Comparar solo las fechas sin horas
      const hoySoloFecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const fechaSoloFecha = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), fechaSeleccionada.getDate());
      return fechaSoloFecha >= hoySoloFecha;
    }),
  id_usuario_profesor: Yup.number()
    .required("Debe seleccionar un profesor")
    .positive("Debe seleccionar un profesor válido")
});

const fetchProfesoresPorMateria = async (idMateria) => {
  const { data } = await api.get(`/admin/examen-final/profesores-materia/${idMateria}`);
  return data.data;
};

const Configuracion = ({ examen }) => {
  const { user } = useAuth();
  const { idExamen } = useParams();
  const queryClient = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isAdmin = user?.rol === "Administrador";

  const {
    data: profesores = [],
    isLoading: loadingProfesores,
  } = useQuery({
    queryKey: ["profesoresPorMateria", examen?.id_materia],
    queryFn: () => fetchProfesoresPorMateria(examen?.id_materia),
    enabled: !!examen?.id_materia,
  });

  const actualizarConfiguracionMutation = useMutation({
    mutationFn: async (valores) => {
      await api.put(`/admin/examen-final/${idExamen}/configuracion`, valores);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detalleExamen", idExamen] });
      toast.success("Configuración actualizada correctamente");
      setShowConfirmation(false);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error al actualizar la configuración"
      );
    },
  });

  const handleSubmit = (valores) => {
    setShowConfirmation(true);
    document.getElementById('pending-values').dataset.values = JSON.stringify(valores);
  };

  const confirmUpdate = () => {
    const valores = JSON.parse(document.getElementById('pending-values').dataset.values);
    actualizarConfiguracionMutation.mutate(valores);
  };

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.noPermission}>
          <AlertTriangle size={48} />
          <h3>Acceso restringido</h3>
          <p>Solo los administradores pueden modificar la configuración del examen.</p>
        </div>
      </div>
    );
  }

  if (!examen) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando información del examen...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Configuración del examen</h3>
      </div>

      <div className={styles.infoActual}>
        <h4>Información actual</h4>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <Calendar size={20} />
            <div>
              <strong>Fecha actual:</strong>
              <span>{formatearFechaSinZonaHoraria(examen.fecha, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <User size={20} />
            <div>
              <strong>Profesor actual:</strong>
              <span>
                {examen.profesor?.nombre} {examen.profesor?.apellido}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Formik
        initialValues={{
          fecha: formatearFechaParaInput(examen.fecha),
          id_usuario_profesor: examen.profesor?.id || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, isValid, dirty }) => (
          <Form className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.campo}>
                <label htmlFor="fecha">
                  <Calendar size={16} />
                  Nueva fecha del examen
                </label>
                <input
                  type="datetime-local"
                  id="fecha"
                  name="fecha"
                  value={values.fecha}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.fecha && touched.fecha ? styles.error : ""}
                />
                {errors.fecha && touched.fecha && (
                  <span className={styles.errorText}>{errors.fecha}</span>
                )}
              </div>

              <div className={styles.campo}>
                <label htmlFor="id_usuario_profesor">
                  <User size={16} />
                  Nuevo profesor
                </label>
                {loadingProfesores ? (
                  <div className={styles.loadingSelect}>Cargando profesores...</div>
                ) : (
                  <select
                    id="id_usuario_profesor"
                    name="id_usuario_profesor"
                    value={values.id_usuario_profesor}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.id_usuario_profesor && touched.id_usuario_profesor ? styles.error : ""}
                  >
                    <option value="">Seleccionar profesor</option>
                    {profesores.map((profesor) => (
                      <option key={profesor.id} value={profesor.id}>
                        {profesor.nombre} {profesor.apellido}
                      </option>
                    ))}
                  </select>
                )}
                {errors.id_usuario_profesor && touched.id_usuario_profesor && (
                  <span className={styles.errorText}>{errors.id_usuario_profesor}</span>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <Boton
                type="submit"
                variant="primary"
                disabled={!isValid || !dirty || actualizarConfiguracionMutation.isLoading}
              >
                Actualizar configuración
              </Boton>
            </div>
          </Form>
        )}
      </Formik>

      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>Confirmar cambios</h4>
            <p>
              ¿Estás seguro de que quieres actualizar la configuración del examen?
              Esta acción afectará a todos los alumnos inscriptos.
            </p>
            <div className={styles.modalActions}>
              <Boton
                onClick={confirmUpdate}
                variant="primary"
                disabled={actualizarConfiguracionMutation.isLoading}
              >
                Confirmar
              </Boton>
              <Boton
                onClick={() => setShowConfirmation(false)}
                variant="cancel"
              >
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}

      {/* Elemento oculto para guardar valores pendientes */}
      <div id="pending-values" style={{ display: "none" }}></div>
    </div>
  );
};

export default Configuracion;