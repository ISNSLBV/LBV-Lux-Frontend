import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../../../../../api/axios";
import styles from "./FinalizarExamen.module.css";
import { toast } from "react-toastify";

const FinalizarExamen = ({ examen }) => {
  const { idExamen } = useParams();
  const queryClient = useQueryClient();
  const [libro, setLibro] = useState("");
  const [folio, setFolio] = useState("");
  const [idProfesorVocal, setIdProfesorVocal] = useState("");

  // Obtener profesores vocales disponibles
  const { data: profesoresVocales, isLoading: loadingProfesores } = useQuery({
    queryKey: ["profesoresVocales", idExamen],
    queryFn: async () => {
      const { data } = await api.get(
        `/admin/examen-final/${idExamen}/profesores-vocales`
      );
      return data.data;
    },
    enabled: !!idExamen && examen?.estado === "Pendiente",
  });

  // Mutación para finalizar examen
  const finalizarMutation = useMutation({
    mutationFn: async (datos) => {
      const { data } = await api.put(
        `/admin/examen-final/${idExamen}/finalizar`,
        datos
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Examen finalizado correctamente");
      queryClient.invalidateQueries(["detalleExamen", idExamen]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error al finalizar el examen"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!libro.trim()) {
      toast.error("El número de libro es requerido");
      return;
    }

    if (!folio.trim()) {
      toast.error("El número de folio es requerido");
      return;
    }

    if (!idProfesorVocal) {
      toast.error("Debe seleccionar un profesor vocal");
      return;
    }

    finalizarMutation.mutate({
      libro: libro.trim(),
      folio: folio.trim(),
      id_profesor_vocal: parseInt(idProfesorVocal),
    });
  };

  // Si el examen ya está finalizado, mostrar información
  if (examen?.estado === "Finalizado") {
    return (
      <div className={styles.container}>
        <div className={styles.info}>
          <h3>Examen Finalizado</h3>
          <div className={styles.detalles}>
            <div className={styles.detalle}>
              <span className={styles.label}>Libro:</span>
              <span className={styles.valor}>{examen.libro || "N/A"}</span>
            </div>
            <div className={styles.detalle}>
              <span className={styles.label}>Folio:</span>
              <span className={styles.valor}>{examen.folio || "N/A"}</span>
            </div>
            <div className={styles.detalle}>
              <span className={styles.label}>Profesor Vocal:</span>
              <span className={styles.valor}>
                {examen.profesorVocal
                  ? `${examen.profesorVocal.nombre} ${examen.profesorVocal.apellido}`
                  : "N/A"}
              </span>
            </div>
          </div>
          <p className={styles.mensaje}>
            Este examen ya ha sido finalizado y no puede modificarse.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Finalizar Examen</h3>
        <p className={styles.descripcion}>
          Complete la información para finalizar el examen. Esta acción cambiará
          el estado del examen a "Finalizado".
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="libro">
            Número de Libro <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="libro"
            value={libro}
            onChange={(e) => setLibro(e.target.value)}
            placeholder="Ingrese el número de libro"
            className={styles.input}
            disabled={finalizarMutation.isPending}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="folio">
            Número de Folio <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="folio"
            value={folio}
            onChange={(e) => setFolio(e.target.value)}
            placeholder="Ingrese el número de folio"
            className={styles.input}
            disabled={finalizarMutation.isPending}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="profesorVocal">
            Profesor Vocal <span className={styles.required}>*</span>
          </label>
          {loadingProfesores ? (
            <p>Cargando profesores disponibles...</p>
          ) : profesoresVocales && profesoresVocales.length > 0 ? (
            <select
              id="profesorVocal"
              value={idProfesorVocal}
              onChange={(e) => setIdProfesorVocal(e.target.value)}
              className={styles.select}
              disabled={finalizarMutation.isPending}
            >
              <option value="">Seleccione un profesor</option>
              {profesoresVocales.map((profesor) => (
                <option key={profesor.id} value={profesor.id}>
                  {profesor.apellido}, {profesor.nombre}
                </option>
              ))}
            </select>
          ) : (
            <p className={styles.noDisponibles}>
              No hay profesores disponibles para actuar como vocal. El profesor
              vocal debe tener asignado un examen final para el mismo día.
            </p>
          )}
          <small className={styles.hint}>
            Solo se muestran profesores que tengan exámenes asignados el mismo
            día que este examen
          </small>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.btnFinalizar}
            disabled={
              finalizarMutation.isPending ||
              loadingProfesores ||
              !profesoresVocales ||
              profesoresVocales.length === 0
            }
          >
            {finalizarMutation.isPending ? "Finalizando..." : "Finalizar Examen"}
          </button>
        </div>

        {profesoresVocales && profesoresVocales.length === 0 && (
          <div className={styles.advertencia}>
            <strong>Importante:</strong> Para poder finalizar el examen, debe
            haber al menos un profesor con un examen asignado para el mismo día.
          </div>
        )}
      </form>
    </div>
  );
};

export default FinalizarExamen;
