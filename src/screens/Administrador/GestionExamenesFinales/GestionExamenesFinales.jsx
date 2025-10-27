import React, { useState } from "react";
import styles from "./GestionExamenesFinales.module.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import SearchBar from "../../../components/SearchBar/SearchBar";
import Boton from "../../../components/Boton/Boton";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { Plus, SquarePen, X } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import api from "../../../api/axios";
import * as Yup from "yup";
import { formatearFechaSinZonaHoraria } from "../../../utils/dateUtils";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";

const fetchExamenesFinales = async () => {
  const { data } = await api.get("/admin/examen-final/listar-examenes");
  return data.data;
};

const GestionExamenesFinales = () => {
  const [filtro, setFiltro] = useState("");
  const [registro, setRegistro] = useState(false);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const params = useParams();
  const mostrandoDetalle = !!params.idExamen;
  const [modoRegistro, setModoRegistro] = useState("basico");

  const queryClient = useQueryClient();

  const {
    data: examenesFinales = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["examenesFinales"],
    queryFn: fetchExamenesFinales,
  });

  const { data: materias = [], isLoading: isLoadingMaterias } = useQuery({
    queryKey: ["materiasExamenFinal"],
    queryFn: async () => {
      const { data } = await api.get(
        "/admin/materia/materia-plan-ciclo/listar-materias"
      );
      return data;
    },
    enabled: modoRegistro === "basico",
  });

  // Query para materias personalizadas (solo planes no vigentes)
  const { data: materiasPersonalizadas = [], isLoading: isLoadingMateriasPersonalizadas } = useQuery({
    queryKey: ["materiasExamenFinalPersonalizadas"],
    queryFn: async () => {
      const { data } = await api.get(
        "/admin/materia/materia-plan/listar-materias?soloNoVigentes=true"
      );
      return data;
    },
    enabled: modoRegistro === "personalizado",
  });

  const { data: profesoresInstituto = [], isLoading: cargandoProfesores } =
    useQuery({
      queryKey: ["profesoresInstituto"],
      queryFn: async () => {
        const { data } = await api.get("/admin/profesor/listar-profesores");
        return data;
      },
    });

  const materiaPlanSeleccionada = materiaSeleccionada
    ? parseInt(materiaSeleccionada, 10)
    : null;

  // Para modo básico: buscar profesores en MateriaPlanCicloLectivo
  const profesoresDisponibles = materiaPlanSeleccionada && modoRegistro === "basico"
    ? materias.find((m) => m.materiaPlan?.id === materiaPlanSeleccionada)
        ?.profesores || []
    : [];

  // Para modo personalizado: no hay profesores predefinidos
  const materiasAMostrar = modoRegistro === "basico" ? materias : materiasPersonalizadas;

  const registrarExamen = useMutation({
    mutationFn: ({ idMateria, fecha, idProfesor }) =>
      api.post("/admin/examen-final/registrar", {
        idMateria,
        fecha,
        idProfesor,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examenesFinales"] });
      toast.success("Examen registrado");
    },
    onError: (error) => {
      console.error("Error al registrar examen:", error);
      toast.error(
        error.response?.data?.message || "Error al registrar el examen"
      );
    },
  });

  const examenesFiltrados = examenesFinales.filter((e) =>
    e.materiaPlan?.materia?.nombre?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <BotonVolver />
      {!mostrandoDetalle && (
        <>
          <div className={styles.titulo}>
            {user.rol === "Administrador" ? (
              <>
                <h1>Examenes finales</h1>
                <p>Registrá y editá los examenes finales de las materias</p>
              </>
            ) : (
              <>
                <h1>Examenes finales asignados</h1>
                <p>Gestioná los examenes finales que te fueron asignados</p>
              </>
            )}
          </div>
          <div className={styles.barraAcciones}>
            <div className={styles.barraBusqueda}>
              <SearchBar
                placeholder="Buscar examen final por materia..."
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
                  Registrar examen final
                </Boton>
              </div>
            )}
          </div>
          <div className={styles.listaExamenes}>
            <h2>Listado de examenes</h2>
            {isLoading ? (
              <CircularProgress />
            ) : isError ? (
              <div>Error al cargar los examenes</div>
            ) : examenesFiltrados.length === 0 ? (
              <div>No se encontraron examenes</div>
            ) : (
              examenesFiltrados.map((e, idx) => {
                return (
                  <div key={e.id || idx} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3>
                        {e.materiaPlan?.materia?.nombre || "Materia sin nombre"}
                      </h3>
                      <span>
                        <strong>Estado: {e.estado || "PENDIENTE"}</strong>
                      </span>
                    </div>
                    <div className={styles.fechas}>
                      <div>
                        <p>Fecha del examen</p>
                        <span>
                          <strong>
                            {formatearFechaSinZonaHoraria(e.fecha)}
                          </strong>
                        </span>
                      </div>
                    </div>
                    <div className={styles.profesor}>
                      <p>Profesor designado</p>
                      <p>
                        <strong>
                          {e.Profesor?.persona?.nombre &&
                          e.Profesor?.persona?.apellido
                            ? `${e.Profesor.persona.nombre} ${e.Profesor.persona.apellido}`
                            : "Sin profesor asignado"}
                        </strong>
                      </p>
                    </div>
                    <div className={styles.carrera}>
                      <div className={styles.datos}>
                        <div>
                          <span>Carrera</span>
                          <p>
                            <strong>
                              {e.materiaPlan?.planEstudio?.carrera?.nombre ||
                                "Sin carrera"}
                            </strong>
                          </p>
                        </div>
                        <div>
                          <span>Resolución Nº</span>
                          <span>
                            <strong>
                              {e.materiaPlan?.planEstudio?.resolucion ||
                                "Sin resolución"}
                            </strong>
                          </span>
                        </div>
                      </div>
                      <div className={styles.accion}>
                        <Boton
                          variant="primary"
                          icono={<SquarePen />}
                          children="Administrar"
                          onClick={() => navigate(`${e.id}`)}
                        >
                          Administrar
                        </Boton>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {registro && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>Registrar examen final</h3>
                  <button
                    className={styles.closeButton}
                    onClick={() => {
                      setRegistro(false);
                      setMateriaSeleccionada("");
                      setModoRegistro("basico");
                    }}
                  >
                    <X />
                  </button>
                </div>
                <div className={styles.selector}>
                  <button
                    className={
                      modoRegistro === "basico"
                        ? styles.modoActivo
                        : styles.modo
                    }
                    onClick={() => {
                      setModoRegistro("basico");
                      setMateriaSeleccionada("");
                    }}
                  >
                    Registro básico
                  </button>
                  <button
                    className={
                      modoRegistro === "personalizado"
                        ? styles.modoActivo
                        : styles.modo
                    }
                    onClick={() => {
                      setModoRegistro("personalizado");
                      setMateriaSeleccionada("");
                    }}
                  >
                    Registro personalizado
                  </button>
                </div>
                <div className={styles.modoDescripcion}>
                  {modoRegistro === "basico" ? (
                    <p>
                      <strong>Registro básico:</strong> Para materias del ciclo lectivo actual con profesores asignados.
                    </p>
                  ) : (
                    <p>
                      <strong>Registro personalizado:</strong> Solo muestra materias de planes de estudio que ya NO están vigentes (ej: Plan 1002/04). Ideal para alumnos que continúan con su plan original.
                    </p>
                  )}
                </div>
                <Formik
                  initialValues={{
                    id_materia: "",
                    fecha: "",
                    id_profesor: "",
                    asignar_otro_profesor: false,
                    id_profesor_general: "",
                  }}
                  validationSchema={Yup.object({
                    id_materia: Yup.string().required(
                      "Este campo es obligatorio"
                    ),
                    fecha: Yup.date()
                      .nullable(true)
                      .transform((curr, orig) => (orig === "" ? null : curr)),
                    asignar_otro_profesor: Yup.boolean(),
                    id_profesor: Yup.string().when("asignar_otro_profesor", {
                      is: (val) => modoRegistro === "basico" && !val,
                      then: (schema) =>
                        schema.required("Este campo es obligatorio"),
                      otherwise: (schema) => schema.notRequired(),
                    }),
                    id_profesor_general: Yup.string().when(
                      "asignar_otro_profesor",
                      {
                        is: (val) => modoRegistro === "personalizado" || val,
                        then: (schema) =>
                          schema.required("Este campo es obligatorio"),
                        otherwise: (schema) => schema.notRequired(),
                      }
                    ),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    const fecha = values.fecha || null;
                    const idMateria = Number(values.id_materia);
                    
                    let idProfesorSeleccionado;
                    if (modoRegistro === "personalizado") {
                      idProfesorSeleccionado = Number(values.id_profesor_general);
                    } else {
                      idProfesorSeleccionado = values.asignar_otro_profesor
                        ? Number(values.id_profesor_general)
                        : Number(values.id_profesor);
                    }

                    registrarExamen.mutate({
                      idMateria,
                      fecha,
                      idProfesor: idProfesorSeleccionado,
                    });
                    resetForm();
                    setRegistro(false);
                    setMateriaSeleccionada("");
                    setModoRegistro("basico");
                  }}
                >
                  {({
                    isSubmitting,
                    touched,
                    errors,
                    setFieldValue,
                    values,
                  }) => (
                    <Form className={styles.form}>
                      <div className={styles.campos}>
                        <div>
                          <label htmlFor="id_materia">
                            Materia - Resolución
                          </label>
                          <Field
                            as="select"
                            id="id_materia"
                            name="id_materia"
                            className={
                              errors.id_materia && touched.id_materia
                                ? "formikFieldError"
                                : "formikField"
                            }
                            onChange={(e) => {
                              const valor = e.target.value;
                              setFieldValue("id_materia", valor);
                              setMateriaSeleccionada(valor);
                              setFieldValue("id_profesor", "");
                              setFieldValue("asignar_otro_profesor", false);
                              setFieldValue("id_profesor_general", "");
                            }}
                          >
                            <option value="">Seleccioná una materia</option>
                            {modoRegistro === "basico" && materias.map((m) => {
                              const materiaPlanId = m.materiaPlan?.id ?? "";

                              return (
                                <option
                                  value={materiaPlanId}
                                  key={materiaPlanId || m.id}
                                >
                                  {m.materiaPlan?.materia?.nombre} - (
                                  {m.materiaPlan?.planEstudio?.resolucion})
                                </option>
                              );
                            })}
                            {modoRegistro === "personalizado" && materiasPersonalizadas.map((mp) => {
                              const materiaPlanId = mp.id ?? "";

                              return (
                                <option
                                  value={materiaPlanId}
                                  key={materiaPlanId}
                                >
                                  {mp.materia?.nombre} - Plan {mp.planEstudio?.resolucion} ({mp.planEstudio?.carrera?.nombre})
                                </option>
                              );
                            })}
                          </Field>
                          <ErrorMessage
                            name="id_materia"
                            component="div"
                            className="formikFieldErrorText"
                          />
                        </div>
                        <div>
                          <label htmlFor="fecha">Fecha del examen</label>
                          <Field
                            type="date"
                            id="fecha"
                            name="fecha"
                            min={new Date().toISOString().split("T")[0]}
                            className={
                              errors.fecha && touched.fecha
                                ? "formikFieldError"
                                : "formikField"
                            }
                          />
                          <ErrorMessage
                            name="fecha"
                            component="div"
                            className="formikFieldErrorText"
                          />
                        </div>
                        <div>
                          <label htmlFor="id_profesor">
                            Profesor designado
                          </label>
                          {modoRegistro === "basico" && (
                            <>
                              <Field
                                as="select"
                                id="id_profesor"
                                name="id_profesor"
                                className={
                                  errors.id_profesor && touched.id_profesor
                                    ? "formikFieldError"
                                    : "formikField"
                                }
                                disabled={
                                  values.asignar_otro_profesor ||
                                  !materiaSeleccionada ||
                                  profesoresDisponibles.length === 0
                                }
                              >
                                <option value="">
                                  {!materiaSeleccionada
                                    ? "Primero seleccioná una materia"
                                    : profesoresDisponibles.length === 0
                                    ? "No hay profesores asignados a esta materia"
                                    : "Seleccioná un profesor"}
                                </option>
                                {profesoresDisponibles.map((profesor) => (
                                  <option
                                    value={profesor.profesor?.id}
                                    key={profesor.profesor?.id}
                                  >
                                    {profesor.profesor?.persona?.nombre}{" "}
                                    {profesor.profesor?.persona?.apellido}
                                    {profesor.rol && ` (${profesor.rol})`}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name="id_profesor"
                                component="div"
                                className="formikFieldErrorText"
                              />
                              <div className={styles.checkboxAlternativo}>
                                <Field
                                  type="checkbox"
                                  name="asignar_otro_profesor"
                                  checked={values.asignar_otro_profesor}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setFieldValue("asignar_otro_profesor", checked);
                                    if (checked) {
                                      setFieldValue("id_profesor", "");
                                    } else {
                                      setFieldValue("id_profesor_general", "");
                                    }
                                  }}
                                />
                                <label>Asignar otro profesor</label>
                              </div>
                            </>
                          )}
                          {(modoRegistro === "personalizado" || values.asignar_otro_profesor) && (
                            <div className={modoRegistro === "personalizado" ? "" : styles.selectAlternativo}>
                              {modoRegistro === "basico" && (
                                <label htmlFor="id_profesor_general">
                                  Profesor del instituto
                                </label>
                              )}
                              <Field
                                as="select"
                                id="id_profesor_general"
                                name="id_profesor_general"
                                className={
                                  errors.id_profesor_general &&
                                  touched.id_profesor_general
                                    ? "formikFieldError"
                                    : "formikField"
                                }
                              >
                                <option value="">
                                  {cargandoProfesores
                                    ? "Cargando profesores..."
                                    : "Seleccioná un profesor"}
                                </option>
                                {!cargandoProfesores &&
                                  profesoresInstituto.map((profesor) => (
                                    <option
                                      value={profesor.id}
                                      key={profesor.id}
                                    >
                                      {profesor.persona?.nombre}{" "}
                                      {profesor.persona?.apellido} - DNI{" "}
                                      {profesor.persona?.dni}
                                    </option>
                                  ))}
                              </Field>
                              <ErrorMessage
                                name="id_profesor_general"
                                component="div"
                                className="formikFieldErrorText"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.modalActions}>
                        <Boton
                          type="submit"
                          variant="success"
                          disabled={isSubmitting}
                          fullWidth
                        >
                          {isSubmitting ? "Registrando..." : "Registrar"}
                        </Boton>
                        <Boton
                          type="button"
                          onClick={() => {
                            setRegistro(false);
                            setMateriaSeleccionada("");
                          }}
                          fullWidth
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

export default GestionExamenesFinales;
