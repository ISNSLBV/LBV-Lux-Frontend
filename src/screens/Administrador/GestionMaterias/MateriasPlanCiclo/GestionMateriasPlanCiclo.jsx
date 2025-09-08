import React from "react";
import styles from "./GestionMateriasPlanCiclo.module.css";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import { Plus, X, SquarePen } from "lucide-react";
import Boton from "../../../../components/Boton/Boton";
import { useState } from "react";
import api from "../../../../api/axios";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const fetchMateriasPlanCiclo = async () => {
  const { data } = await api.get(
    "/admin/materia/materia-plan-ciclo/listar-materias"
  );
  return data;
};

const GestionMateriasPlanCiclo = () => {
  const [filtro, setFiltro] = useState("");
  const [registro, setRegistro] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const mostrandoDetalle = !!params.idMateria;

  // Función para formatear fecha a dd/mm/aaaa
  const formatearFecha = (fecha) => {
    if (!fecha || fecha === "0000-00-00") return "—";
    try {
      // Si la fecha viene en formato YYYY-MM-DD, parsearla manualmente
      // para evitar problemas de zona horaria
      if (typeof fecha === "string" && fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [año, mes, dia] = fecha.split("-");
        return `${dia}/${mes}/${año}`;
      }

      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) return "—";
      return fechaObj.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "—";
    }
  };

  const queryClient = useQueryClient();

  const {
    data: materiasPlanCiclo = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["materiasPlanCiclo"],
    queryFn: fetchMateriasPlanCiclo,
  });

  const { data: materiasPlan = [], isLoading: isLoadingMateriasPlan } =
    useQuery({
      queryKey: ["materiasPlan"],
      queryFn: async () => {
        const { data } = await api.get(
          "/admin/materia/materia-plan/listar-materias"
        );
        return data;
      },
    });

  const registrarMateria = useMutation({
    mutationFn: ({
      idMateriaPlan,
      cicloLectivo,
      fechaInicio,
      fechaCierre,
      tipoAprobacion,
    }) =>
      api.post("/admin/materia/materia-plan-ciclo/registrar-materia", {
        idMateriaPlan,
        cicloLectivo,
        fechaInicio,
        fechaCierre,
        tipoAprobacion,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiasPlanCiclo"] });
      toast.success("Materia registrada");
    },
    onError: () => toast.error("Error al registrar la materia"),
  });

  const materiasFiltradas = materiasPlanCiclo.filter((m) =>
    m.materiaPlan?.materia?.nombre?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      {!mostrandoDetalle && (
        <div>
          <div className={styles.titulo}>
            <h1>Materias por plan de estudio</h1>
            <p>Registrá y editá las materias por plan de estudio</p>
          </div>
          <div className={styles.barraAcciones}>
            <div className={styles.barraBusqueda}>
              <SearchBar
                placeholder="Buscar materia"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <div className={styles.botonAgregar}>
              <Boton
                variant="success"
                icono={<Plus />}
                onClick={() => setRegistro(true)}
              >
                Registrar materia
              </Boton>
            </div>
          </div>
          <div className={styles.listaMaterias}>
            <h2>Listado de materias</h2>
            {materiasFiltradas.map((m, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{m.materiaPlan.materia.nombre}</h3>
                  <span>
                    <strong>Año: {m.ciclo_lectivo}</strong>
                  </span>
                </div>
                <div className={styles.fechas}>
                  <div>
                    <p>Fecha de inicio</p>
                    <span>
                      <strong>{formatearFecha(m.fecha_inicio)}</strong>
                    </span>
                  </div>
                  <div>
                    <p>Fecha de cierre</p>
                    <span>
                      <strong>{formatearFecha(m.fecha_cierre)}</strong>
                    </span>
                  </div>
                </div>
                <div className={styles.profesor}>
                  <p>Profesor/es</p>
                  <p>
                    <strong>
                      {m.profesores && m.profesores.length > 0
                        ? m.profesores.length === 1
                          ? `${
                              m.profesores[0].profesor?.persona?.nombre || ""
                            } ${
                              m.profesores[0].profesor?.persona?.apellido || ""
                            }`.trim()
                          : m.profesores
                              .map((p) =>
                                `${p.profesor?.persona?.nombre || ""} ${
                                  p.profesor?.persona?.apellido || ""
                                }`.trim()
                              )
                              .join(", ")
                        : "Sin profesor"}
                    </strong>
                  </p>
                </div>
                <div className={styles.carrera}>
                  <div className={styles.datos}>
                    <div>
                      <span>Carrera</span>
                      <p>
                        <strong>
                          {m.materiaPlan.planEstudio.carrera.nombre}
                        </strong>
                      </p>
                    </div>
                    <div>
                      <span>Resolución Nº</span>
                      <span>
                        <strong>{m.materiaPlan.planEstudio.resolucion}</strong>
                      </span>
                    </div>
                  </div>
                  <div className={styles.accion}>
                    <Boton
                      children="Administrar"
                      icono={<SquarePen />}
                      onClick={() => navigate(`${m.id}`)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {registro && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>Registrar materia en ciclo lectivo</h3>
                  <button
                    className={styles.closeButton}
                    onClick={() => setRegistro(false)}
                  >
                    <X />
                  </button>
                </div>
                <Formik
                  initialValues={{
                    id_materia_plan: "",
                    ciclo_lectivo: new Date().getFullYear(),
                    fecha_inicio: "",
                    fecha_cierre: "",
                    tipo_aprobacion: "",
                  }}
                  validationSchema={Yup.object({
                    id_materia_plan: Yup.string().required(
                      "La materia es obligatoria"
                    ),
                    // Fecha inicio opcional
                    fecha_inicio: Yup.date()
                      .nullable(true)
                      .transform((curr, orig) => (orig === "" ? null : curr)),
                    // Fecha cierre opcional, si se ingresa debe ser >= fecha_inicio
                    fecha_cierre: Yup.date()
                      .nullable(true)
                      .transform((curr, orig) => (orig === "" ? null : curr))
                      .when("fecha_inicio", (fecha_inicio, schema) =>
                        fecha_inicio
                          ? schema.min(
                              fecha_inicio,
                              "La fecha de cierre no puede ser anterior a la de inicio"
                            )
                          : schema
                      ),
                    tipo_aprobacion: Yup.string().required(
                      "El tipo de aprobación es obligatorio"
                    ),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    // Mapear cadenas vacías a null
                    const fechaInicio = values.fecha_inicio || null;
                    const fechaCierre = values.fecha_cierre || null;
                    registrarMateria.mutate({
                      idMateriaPlan: values.id_materia_plan,
                      cicloLectivo: values.ciclo_lectivo,
                      fechaInicio,
                      fechaCierre,
                      tipoAprobacion: values.tipo_aprobacion,
                    });
                    resetForm();
                    setRegistro(false);
                  }}
                >
                  {({ isSubmitting, touched, errors }) => (
                    <Form>
                      <div className="mb-4">
                        <label htmlFor="id_materia_plan">
                          Materia - Resolución plan
                        </label>
                        <Field
                          as="select"
                          id="id_materia_plan"
                          name="id_materia_plan"
                          className={
                            errors.id_materia_plan && touched.id_materia_plan
                              ? "formikFieldError"
                              : "formikField"
                          }
                        >
                          <option value="">Seleccionar materia/plan</option>
                          {materiasPlan.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.materia?.nombre} - {m.planEstudio?.resolucion}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="id_materia_plan"
                          component="div"
                          className="formikFieldErrorText"
                        />
                        <label htmlFor="fecha_inicio">Fecha de inicio</label>
                        <Field
                          type="date"
                          id="fecha_inicio"
                          name="fecha_inicio"
                          min={new Date().toISOString().split("T")[0]}
                          className={
                            errors.fecha_inicio && touched.fecha_inicio
                              ? "formikFieldError"
                              : "formikField"
                          }
                        />
                        <ErrorMessage
                          name="fecha_inicio"
                          component="div"
                          className="formikFieldErrorText"
                        />
                        <label htmlFor="fecha_cierre">Fecha de cierre</label>
                        <Field
                          type="date"
                          id="fecha_cierre"
                          name="fecha_cierre"
                          min={new Date().toISOString().split("T")[0]}
                          className={
                            errors.fecha_cierre && touched.fecha_cierre
                              ? "formikFieldError"
                              : "formikField"
                          }
                        />
                        <ErrorMessage
                          name="fecha_cierre"
                          component="div"
                          className="formikFieldErrorText"
                        />
                        <label htmlFor="tipo_aprobacion">
                          Tipo de aprobación
                        </label>
                        <Field
                          as="select"
                          id="tipo_aprobacion"
                          name="tipo_aprobacion"
                          className={
                            errors.tipo_aprobacion && touched.tipo_aprobacion
                              ? "formikFieldError"
                              : "formikField"
                          }
                        >
                          <option value="">Seleccioná una opción</option>
                          <option value="EP">
                            Exclusivamente promocionable
                          </option>
                          <option value="P">Promocionable</option>
                          <option value="NP">No promocionable</option>
                        </Field>
                        <ErrorMessage
                          name="tipo_aprobacion"
                          component="div"
                          className="formikFieldErrorText"
                        />
                      </div>
                      <div className={styles.modalActions}>
                        <Boton
                          type="submit"
                          variant="success"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Creando..." : "Crear"}
                        </Boton>
                        <Boton type="button" onClick={() => setRegistro(false)}>
                          Cancelar
                        </Boton>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>
      )}
      <Outlet />
    </>
  );
};

export default GestionMateriasPlanCiclo;
