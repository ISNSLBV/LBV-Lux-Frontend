import React, { useState } from "react";
import api from "../../../api/axios";
import TablaGestion from "../../../components/Gestion/Tabla/TablaGestion";
import CardGestion from "../../../components/Gestion/Card/CardGestion";
import { Plus, SquarePen, X } from "lucide-react";
import styles from "./GestionPlanes.module.css";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Boton from "../../../components/Boton/Boton";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Esquema de validación para registrar plan de estudio
const registroPlanSchema = Yup.object({
  id_carrera: Yup.string().required("Este campo es obligatorio"),
  resolucion: Yup.string().required("Este campo es obligatorio"),
  anio_implementacion: Yup.number()
    .typeError("Debe ser un número válido")
    .required("Este campo es obligatorio")
    .integer("Debe ser un año válido")
    .min(1900, "El año debe ser mayor a 1900")
    .max(new Date().getFullYear() + 10, "El año no puede ser tan futuro"),
});

// Esquema de validación para editar plan de estudio
const edicionPlanSchema = Yup.object({
  id_carrera: Yup.string().required("Este campo es obligatorio"),
  resolucion: Yup.string().required("Este campo es obligatorio"),
  anio_implementacion: Yup.number()
    .typeError("Debe ser un número válido")
    .required("Este campo es obligatorio")
    .integer("Debe ser un año válido")
    .min(1900, "El año debe ser mayor a 1900")
    .max(new Date().getFullYear() + 10, "El año no puede ser tan futuro"),
  vigente: Yup.number(),
});

const fetchPlanes = async () => {
  const { data } = await api.get("/admin/plan-estudio/listar-planes");
  return data;
};

const GestionPlanes = () => {
  const [filtro, setFiltro] = useState("");
  const [edicion, setEdicion] = useState(false);
  const [registro, setRegistro] = useState(false);
  const [planEditado, setPlanEditado] = useState({
    id: "",
    id_carrera: "",
    resolucion: "",
    anio_implementacion: "",
    vigente: "",
  });
  const [confirmarVigente, setConfirmarVigente] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: planes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["planes"],
    queryFn: fetchPlanes,
  });

  const campos = [
    {
      label: "ID",
      accessor: (p) => p.id,
    },
    {
      label: "Resolución",
      accessor: (p) => p.resolucion,
    },
    {
      label: "Carrera",
      accessor: (p) => p.carrera?.nombre,
    },
    {
      label: "Año de implementación",
      accessor: (p) => p.anio_implementacion,
    },
    {
      label: "Vigente",
      accessor: (p) => (p.vigente === 1 ? "Sí" : "No"),
    },
  ];

  const registrarPlan = useMutation({
    mutationFn: ({ idCarrera, resolucion, anio_implementacion }) =>
      api.post(`/admin/plan-estudio/${idCarrera}/registrar-plan`, {
        resolucion,
        anio_implementacion,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      toast.success("Plan de estudio registrado");
    },
    onError: () => toast.error("Error al registrar el plan de estudio"),
  });

  const editarPlan = useMutation({
    mutationFn: ({ id, id_carrera, resolucion, anio_implementacion }) =>
      api.put(`/admin/plan-estudio/${id}/modificar`, {
        carrera: id_carrera,
        resolucion,
        anio_implementacion,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      toast.success("Plan de estudio actualizado");
      setEdicion(false);
    },
    onError: () => toast.error("Error al actualizar el plan de estudio"),
  });

  const cambiarVigencia = useMutation({
    mutationFn: ({ id, vigente }) =>
      api.patch(`/admin/plan-estudio/${id}/cambiar-estado`, { vigente }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      toast.success("Estado de vigencia actualizado");
    },
    onError: () => toast.error("Error al cambiar el estado"),
  });

  const planesFiltrados = planes.filter((p) =>
    p.resolucion.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <BotonVolver />
      <div className={styles.titulo}>
        <h1>Planes de estudio</h1>
        <p>Registrá y editá los planes de estudio del instituto</p>
      </div>
      <div className={styles.listaPlanes}>
        <div className={styles.listaHeader}>
          <h2>Listado de planes de estudio</h2>
          <Boton
            variant="success"
            icono={<Plus />}
            onClick={() => setRegistro(true)}
          >
            Registrar plan de estudio
          </Boton>
        </div>
        <TablaGestion
          columnas={campos}
          data={planesFiltrados}
          isLoading={isLoading}
          vacioTexto="No se encontraron planes de estudio"
          renderAcciones={(p) => (
            <Boton
              variant="onlyIcon"
              icono={<SquarePen />}
              onClick={() => {
                setPlanEditado({
                  id: p.id,
                  id_carrera: p.id_carrera,
                  resolucion: p.resolucion,
                  anio_implementacion: p.anio_implementacion,
                  vigente: p.vigente,
                });
                setEdicion(true);
              }}
            />
          )}
        />
        <CardGestion
          data={planesFiltrados}
          campos={campos}
          isLoading={isLoading}
          vacioTexto="No se encontraron planes de estudio"
          renderAcciones={(plan) => (
            <Boton
              fullWidth
              icono={<SquarePen />}
              variant="primary"
              onClick={() => {
                setPlanEditado({
                  id: plan.id,
                  id_carrera: plan.id_carrera,
                  resolucion: plan.resolucion,
                  anio_implementacion: plan.anio_implementacion,
                  vigente: plan.vigente,
                });
                setEdicion(true);
              }}
            >
              Editar
            </Boton>
          )}
        />
      </div>

      {/* Modal de registro */}
      {registro && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Registrar nuevo plan de estudio</h3>
              <button
                className={styles.closeButton}
                onClick={() => setRegistro(false)}
              >
                <X />
              </button>
            </div>
            <Formik
              initialValues={{
                id_carrera: "",
                resolucion: "",
                anio_implementacion: "",
              }}
              validationSchema={registroPlanSchema}
              onSubmit={(values, { resetForm }) => {
                registrarPlan.mutate({
                  idCarrera: values.id_carrera,
                  resolucion: values.resolucion,
                  anio_implementacion: values.anio_implementacion,
                });
                resetForm();
                setRegistro(false);
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <div className={styles.modalForm}>
                    <div>
                      <label htmlFor="resolucion" className="block mb-1">
                        Resolución Nº
                      </label>
                      <Field
                        type="text"
                        id="resolucion"
                        name="resolucion"
                        className={
                          errors.resolucion && touched.resolucion
                            ? "formikFieldError"
                            : "formikField"
                        }
                      />
                      <ErrorMessage
                        name="resolucion"
                        component="div"
                        className="formikFieldErrorText"
                      />
                    </div>

                    <div>
                      <label htmlFor="carrera" className="block mb-1">
                        Carrera
                      </label>
                      <Field
                        as="select"
                        name="id_carrera"
                        id="carrera"
                        className={
                          errors.id_carrera && touched.id_carrera
                            ? "formikFieldError"
                            : "formikField"
                        }
                      >
                        <option value="">Seleccioná una opción</option>
                        <option value="1">Técnico Analista de Sistemas</option>
                        <option value="2">Técnico en Redes Informáticas</option>
                      </Field>
                      <ErrorMessage
                        name="id_carrera"
                        component="div"
                        className="formikFieldErrorText"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="anio_implementacion"
                        className="block mb-1"
                      >
                        Año de implementación
                      </label>
                      <Field
                        type="number"
                        id="anio_implementacion"
                        name="anio_implementacion"
                        className={
                          errors.anio_implementacion &&
                          touched.anio_implementacion
                            ? "formikFieldError"
                            : "formikField"
                        }
                      />
                      <ErrorMessage
                        name="anio_implementacion"
                        component="div"
                        className="formikFieldErrorText"
                      />
                    </div>
                  </div>
                  <div className={styles.modalActions}>
                    <Boton
                      type="submit"
                      variant="success"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creando..." : "Crear"}
                    </Boton>
                    <Boton
                      variant="cancel"
                      type="button"
                      onClick={() => setRegistro(false)}
                    >
                      Cancelar
                    </Boton>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {edicion && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Editar plan de estudio</h3>
              <button
                className={styles.closeButton}
                onClick={() => setEdicion(false)}
              >
                <X />
              </button>
            </div>
            <Formik
              initialValues={{
                id_carrera: planEditado.id_carrera || "",
                resolucion: planEditado.resolucion || "",
                anio_implementacion: planEditado.anio_implementacion || "",
                vigente: planEditado.vigente || 0,
              }}
              validationSchema={edicionPlanSchema}
              enableReinitialize
              onSubmit={(values) => {
                editarPlan.mutate({
                  id: planEditado.id,
                  id_carrera: values.id_carrera,
                  resolucion: values.resolucion,
                  anio_implementacion: values.anio_implementacion,
                });
              }}
            >
              {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                <Form>
                  <div className={styles.modalForm}>
                    <div>
                      <label htmlFor="resolucion-edit" className="block mb-1">
                        Resolución Nº
                      </label>
                      <Field
                        type="text"
                        id="resolucion-edit"
                        name="resolucion"
                        className={
                          errors.resolucion && touched.resolucion
                            ? "formikFieldError"
                            : "formikField"
                        }
                      />
                      <ErrorMessage
                        name="resolucion"
                        component="div"
                        className="formikFieldErrorText"
                      />
                    </div>

                    <div>
                      <label htmlFor="carrera-edit" className="block mb-1">
                        Carrera
                      </label>
                      <Field
                        as="select"
                        name="id_carrera"
                        id="carrera-edit"
                        className={
                          errors.id_carrera && touched.id_carrera
                            ? "formikFieldError"
                            : "formikField"
                        }
                      >
                        <option value="">Seleccioná una opción</option>
                        <option value="1">Técnico Analista de Sistemas</option>
                        <option value="2">Técnico en Redes Informáticas</option>
                      </Field>
                      <ErrorMessage
                        name="id_carrera"
                        component="div"
                        className="formikFieldErrorText"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="anio_implementacion-edit"
                        className="block mb-1"
                      >
                        Año de implementación
                      </label>
                      <Field
                        type="number"
                        id="anio_implementacion-edit"
                        name="anio_implementacion"
                        className={
                          errors.anio_implementacion &&
                          touched.anio_implementacion
                            ? "formikFieldError"
                            : "formikField"
                        }
                      />
                      <ErrorMessage
                        name="anio_implementacion"
                        component="div"
                        className="formikFieldErrorText"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Estado</label>
                      <div className={styles.switchContainer}>
                        <input
                          type="checkbox"
                          id="vigente-switch"
                          checked={!!values.vigente}
                          onChange={() => setConfirmarVigente(!values.vigente)}
                          className={styles.switchInput}
                        />
                        <label
                          htmlFor="vigente-switch"
                          className={styles.switchLabel}
                        >
                          <span className={styles.switchSlider}></span>
                          <span className={styles.switchText}>
                            {values.vigente ? "Vigente" : "No vigente"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className={styles.modalActions}>
                    <Boton
                      type="submit"
                      variant="success"
                      disabled={isSubmitting || editarPlan.isLoading}
                    >
                      {isSubmitting || editarPlan.isLoading
                        ? "Guardando..."
                        : "Guardar"}
                    </Boton>
                    <Boton
                      variant="cancel"
                      type="button"
                      onClick={() => setEdicion(false)}
                    >
                      Cancelar
                    </Boton>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
      {confirmarVigente !== null && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>¿Confirmar cambio de estado?</h3>
            </div>
            <p>
              ¿Estás seguro de marcar el plan como{" "}
              <b>{confirmarVigente ? "Vigente" : "No vigente"}</b>?
            </p>
            <div className={styles.modalActions}>
              <Boton
                variant="success"
                onClick={() => {
                  cambiarVigencia.mutate({
                    id: planEditado.id,
                    vigente: Number(confirmarVigente),
                  });
                  setPlanEditado((prev) => ({
                    ...prev,
                    vigente: Number(confirmarVigente),
                  }));
                  setConfirmarVigente(null);
                }}
              >
                Sí, confirmar
              </Boton>
              <Boton variant="cancel" onClick={() => setConfirmarVigente(null)}>
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GestionPlanes;
