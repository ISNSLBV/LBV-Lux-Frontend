import React, { useState, useEffect } from "react";
import styles from "./ModalAceptar.module.css";
import api from "../../../api/axios";

const ModalAceptar = ({ isOpen, onClose, onConfirm, solicitud }) => {
  const [materiasPlan, setMateriasPlan] = useState([]);
  const [idMateriaPlanCicloLectivo, setIdMateriaPlanCicloLectivo] =
    useState("");
  const [notaFinal, setNotaFinal] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMaterias, setLoadingMaterias] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && solicitud) {
      // Establecer la calificación de origen como valor por defecto
      setNotaFinal(solicitud.origen_calificacion || "");
      cargarMateriasPlan();
    }
  }, [isOpen, solicitud]);

  const cargarMateriasPlan = async () => {
    try {
      setLoadingMaterias(true);

      // Validar que la solicitud tenga id_carrera
      if (!solicitud.id_carrera) {
        setError("La solicitud no tiene una carrera asociada");
        return;
      }

      // Obtener las carreras del alumno para encontrar el plan asignado a esta carrera
      const responseAlumno = await api.get(
        `/equivalencia/admin/usuario/${solicitud.id_usuario_alumno}/carreras`
      );

      if (!responseAlumno.data || responseAlumno.data.length === 0) {
        setError("No se pudo obtener el plan de estudio del alumno");
        return;
      }

      // Buscar la carrera específica de la solicitud
      const carreraAlumno = responseAlumno.data.find(
        (c) => c.id_carrera === solicitud.id_carrera
      );

      if (!carreraAlumno) {
        setError("El alumno no está inscripto en la carrera de esta solicitud");
        return;
      }

      const planId = carreraAlumno.id_plan_estudio_asignado;

      if (!planId) {
        setError("El alumno no tiene un plan de estudio asignado para esta carrera");
        return;
      }

      // Obtener las materias del plan en el ciclo lectivo actual
      const responseMaterias = await api.get(
        `/admin/materia/materia-plan-ciclo/${planId}/materias-ciclo-actual`
      );
      setMateriasPlan(responseMaterias.data.materias || []);
    } catch (err) {
      console.error("Error al cargar materias:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message || "Error al cargar las materias del plan"
      );
    } finally {
      setLoadingMaterias(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idMateriaPlanCicloLectivo) {
      setError("Debe seleccionar una materia destino");
      return;
    }

    if (!notaFinal || notaFinal < 0 || notaFinal > 10) {
      setError("Debe ingresar una nota final válida (0-10)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onConfirm({
        idMateriaPlanCicloLectivo: parseInt(idMateriaPlanCicloLectivo),
        notaFinal: parseFloat(notaFinal),
        origenInstitucion: solicitud.origen_institucion,
        origenMateria: solicitud.origen_materia,
        origenCalificacion: solicitud.origen_calificacion,
        resolucion: solicitud.resolucion,
      });
      handleClose();
    } catch (err) {
      setError(err.message || "Error al aprobar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIdMateriaPlanCicloLectivo("");
    setNotaFinal("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Aprobar Solicitud de Equivalencia</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.alumnoInfo}>
            <p>
              <strong>Alumno:</strong> {solicitud?.alumno?.persona?.apellido},{" "}
              {solicitud?.alumno?.persona?.nombre}
            </p>
            <p>
              <strong>Carrera:</strong> {solicitud?.carrera?.nombre || "No especificada"}
            </p>
            <p>
              <strong>Materia de Origen:</strong> {solicitud?.origen_materia}
            </p>
            <p>
              <strong>Institución:</strong> {solicitud?.origen_institucion}
            </p>
            <p>
              <strong>Calificación Obtenida:</strong>{" "}
              {solicitud?.origen_calificacion}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="materiaDestino">
                Materia Destino <span className={styles.required}>*</span>
              </label>
              {loadingMaterias ? (
                <p className={styles.loading}>Cargando materias...</p>
              ) : (
                <select
                  id="materiaDestino"
                  className={styles.select}
                  value={idMateriaPlanCicloLectivo}
                  onChange={(e) => setIdMateriaPlanCicloLectivo(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Seleccione una materia</option>
                  {materiasPlan.map((materia) => (
                    <option key={materia.id} value={materia.id}>
                      {materia.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notaFinal">
                Nota Final <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="notaFinal"
                className={styles.input}
                value={notaFinal}
                onChange={(e) => setNotaFinal(e.target.value)}
                placeholder="Ingrese la nota final (0-10)"
                min="0"
                max="10"
                step="0.01"
                disabled={loading}
              />
              <small className={styles.hint}>
                Valor por defecto: calificación obtenida en origen
              </small>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnCancelar}
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.btnAceptar}
                disabled={loading || loadingMaterias}
              >
                {loading ? "Aprobando..." : "Confirmar Aprobación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAceptar;
