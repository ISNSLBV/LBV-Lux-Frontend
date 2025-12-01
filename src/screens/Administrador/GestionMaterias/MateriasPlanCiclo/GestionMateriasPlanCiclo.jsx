import React from "react";
import styles from "./GestionMateriasPlanCiclo.module.css";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import { Plus, X, SquarePen } from "lucide-react";
import Boton from "../../../../components/Boton/Boton";
import { useState } from "react";
import api from "../../../../api/axios";
import { formatearFecha } from "../../../../utils/dateUtils";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../../../contexts/AuthContext";
import BotonVolver from "../../../../components/BotonVolver/BotonVolver";

const fetchMateriasPlanCiclo = async () => {
  const { data } = await api.get(
    "/admin/materia/materia-plan-ciclo/listar-materias"
  );
  return data;
};

const GestionMateriasPlanCiclo = () => {
  const [filtro, setFiltro] = useState("");
  const [filtroPlan, setFiltroPlan] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [registro, setRegistro] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const mostrandoDetalle = !!params.idMateria;
  const { user } = useAuth();

  const formatearFecha = (fecha) => {
    if (!fecha || fecha === "0000-00-00") return "—";
    try {
      if (typeof fecha === "string" && fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [año, mes, dia] = fecha.split("-");
        return `${dia}/${mes}/${año}`;
      }

      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) return "—";

      const dia = String(fechaObj.getDate()).padStart(2, "0");
      const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
      const año = fechaObj.getFullYear();
      return `${dia}/${mes}/${año}`;
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
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["materiasPlanCiclo"] });
      toast.success(message?.data?.message || "Materia registrada");
    },
    onError: (error) => {
      const mensaje =
        error.response?.data?.error || "Error al registrar la materia";
      toast.error(mensaje);
    },
  });

  const materiasFiltradas = materiasPlanCiclo.filter((m) => {
    const nombreMateria = m.materiaPlan?.materia?.nombre?.toLowerCase() || "";
    const resolucionPlan = m.materiaPlan?.planEstudio?.resolucion || "";
    const carrera =
      m.materiaPlan?.planEstudio?.carrera?.nombre?.toLowerCase() || "";
    const planCompleto = `${resolucionPlan} - ${carrera}`.toLowerCase();
    const anio = m.ciclo_lectivo?.toString() || "";

    const cumpleNombre = nombreMateria.includes(filtro.toLowerCase());
    const cumplePlan =
      filtroPlan === "" || planCompleto.includes(filtroPlan.toLowerCase());
    const cumpleAnio = filtroAnio === "" || anio === filtroAnio;

    return cumpleNombre && cumplePlan && cumpleAnio;
  });

  return (
    <>
      <BotonVolver />
      {!mostrandoDetalle && (
        <>
          <div className={styles.titulo}>
            {user.rol === "Administrador" ? (
              <>
                <h1>Materias por ciclo lectivo</h1>
                <p>Registrá y administrá las materias por ciclo lectivo</p>
              </>
            ) : (
              <>
                <h1>Materias asignadas</h1>
                <p>Gestioná las materias que te fueron asignadas</p>
              </>
            )}
          </div>
          <div className={styles.barraAcciones}>
            <div className={styles.barraBusqueda}>
              <SearchBar
                placeholder="Buscar materia"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            {user.rol === "Administrador" && (
              <div className={styles.botonAgregar}>
                <Boton
                  variant="success"
                  icono={<Plus />}
                  onClick={() => setRegistro(true)}
                >
                  Registrar materia
                </Boton>
              </div>
            )}
          </div>
          <div className={styles.listaMaterias}>
            <div className={styles.headerListado}>
              <h2>Listado de materias</h2>
              <div className={styles.filtrosListado}>
                <select
                  value={filtroPlan}
                  onChange={(e) => setFiltroPlan(e.target.value)}
                  className={styles.selectFiltro}
                >
                  <option value="">Todos los planes</option>
                  {[
                    ...new Set(
                      materiasPlanCiclo.map(
                        (m) =>
                          `${m.materiaPlan?.planEstudio?.resolucion} - ${m.materiaPlan?.planEstudio?.carrera?.nombre}`
                      )
                    ),
                  ]
                    .sort()
                    .map((plan, idx) => (
                      <option key={idx} value={plan}>
                        {plan}
                      </option>
                    ))}
                </select>
                <select
                  value={filtroAnio}
                  onChange={(e) => setFiltroAnio(e.target.value)}
                  className={styles.selectFiltro}
                >
                  <option value="">Todos los años</option>
                  {[...new Set(materiasPlanCiclo.map((m) => m.ciclo_lectivo))]
                    .sort((a, b) => b - a)
                    .map((anio, idx) => (
                      <option key={idx} value={anio}>
                        {anio}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {isLoading ? (
              <div className={styles.mensaje}>Cargando materias...</div>
            ) : isError ? (
              <div className={styles.mensaje}>Error al cargar las materias</div>
            ) : materiasFiltradas.length === 0 ? (
              <div className={styles.mensaje}>No se encontraron materias</div>
            ) : (
              materiasFiltradas.map((m, idx) => (
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
                                m.profesores[0].profesor?.persona?.apellido ||
                                ""
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
                          <strong>
                            {m.materiaPlan.planEstudio.resolucion}
                          </strong>
                        </span>
                      </div>
                    </div>
                    <div className={styles.accion}>
                      <Boton
                        variant="primary"
                        icono={<SquarePen />}
                        onClick={() => navigate(`${m.id}`)}
                      >
                        Administrar
                      </Boton>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {registro && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>Registrar materia en el ciclo lectivo actual</h3>
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

                    fecha_inicio: Yup.date()
                      .nullable(true)
                      .transform(function (curr, orig) {
                        // normalizar valores que pueden venir como ["undefined"], undefined, ""
                        let original = orig;
                        if (Array.isArray(original)) original = original[0];
                        if (
                          original === "" ||
                          original === undefined ||
                          original === null ||
                          original === "undefined"
                        ) {
                          return null;
                        }
                        // curr ya es un Date si Yup pudo parsearlo; si no, mantener curr para que Yup lo marque inválido
                        return curr;
                      })
                      .test(
                        "year-validation-inicio",
                        "La fecha debe ser del año del ciclo lectivo",
                        function (value) {
                          if (!value) return true; // null es válido
                          const fechaYear = new Date(value).getFullYear();
                          const cicloLectivo = this.parent.ciclo_lectivo;
                          return fechaYear === cicloLectivo;
                        }
                      ),

                    fecha_cierre: Yup.date()
                      .nullable(true)
                      .transform(function (curr, orig) {
                        let original = orig;
                        if (Array.isArray(original)) original = original[0];
                        if (
                          original === "" ||
                          original === undefined ||
                          original === null ||
                          original === "undefined"
                        ) {
                          return null;
                        }
                        return curr;
                      })
                      .test(
                        "year-validation-cierre",
                        "La fecha debe ser del año del ciclo lectivo",
                        function (value) {
                          if (!value) return true;
                          const fechaYear = new Date(value).getFullYear();
                          const cicloLectivo = this.parent.ciclo_lectivo;
                          return fechaYear === cicloLectivo;
                        }
                      )
                      .test(
                        "order-validation",
                        "La fecha de cierre no puede ser anterior a la de inicio",
                        function (fechaCierreValue) {
                          const fechaInicioValue = this.parent.fecha_inicio;
                          if (!fechaCierreValue || !fechaInicioValue)
                            return true; // si falta cualquiera, no aplicamos orden
                          // ambos están definidos: comparar fechas
                          const inicio = new Date(fechaInicioValue);
                          const cierre = new Date(fechaCierreValue);
                          if (
                            isNaN(inicio.getTime()) ||
                            isNaN(cierre.getTime())
                          )
                            return false;
                          return cierre >= inicio;
                        }
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
                      <div className={styles.form}>
                        <div>
                          <label htmlFor="id_materia_plan">
                            Materia - Resolución de plan de estudio
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
                                {m.materia?.nombre} -{" "}
                                {m.planEstudio?.resolucion}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="id_materia_plan"
                            component="div"
                            className="formikFieldErrorText"
                          />
                        </div>
                        <div>
                          <label htmlFor="fecha_inicio">
                            Fecha de inicio{" "}
                            <small
                              style={{ fontWeight: "normal", opacity: 0.7 }}
                            >
                              (opcional)
                            </small>
                          </label>
                          <Field
                            type="date"
                            id="fecha_inicio"
                            name="fecha_inicio"
                            min={`${new Date().getFullYear()}-01-01`}
                            max={`${new Date().getFullYear()}-12-31`}
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
                        </div>
                        <div>
                          <label htmlFor="fecha_cierre">
                            Fecha de cierre{" "}
                            <small
                              style={{ fontWeight: "normal", opacity: 0.7 }}
                            >
                              (opcional)
                            </small>
                          </label>
                          <Field
                            type="date"
                            id="fecha_cierre"
                            name="fecha_cierre"
                            min={`${new Date().getFullYear()}-01-01`}
                            max={`${new Date().getFullYear()}-12-31`}
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
                        </div>
                        <div>
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
        </>
      )}
      <Outlet />
    </>
  );
};

export default GestionMateriasPlanCiclo;
