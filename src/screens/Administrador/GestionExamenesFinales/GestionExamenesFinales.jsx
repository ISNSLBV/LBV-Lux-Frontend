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

const fetchExamenesFinales = async () => {
  const { data } = await api.get("/admin/examen-final/listar-examenes");
  return data.data; // Extraer el array de la propiedad 'data'
};

const GestionExamenesFinales = () => {
  const [filtro, setFiltro] = useState("");
  const [registro, setRegistro] = useState(false);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const params = useParams();
  const mostrandoDetalle = !!params.idExamen;

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
  });

  // Obtener profesores de la materia seleccionada
  const profesoresDisponibles =
    materias.find((m) => m.id === parseInt(materiaSeleccionada))?.profesores ||
    [];

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
    e.ciclo?.materiaPlan?.materia?.nombre
      ?.toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <>
      {!mostrandoDetalle && (
        <div>
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
                      <h3>{e.ciclo?.materiaPlan?.materia?.nombre || "Materia sin nombre"}</h3>
                      <span>
                        <strong>Estado: {e.estado || "PENDIENTE"}</strong>
                      </span>
                    </div>
                    <div className={styles.fechas}>
                      <div>
                        <p>Fecha del examen</p>
                        <span>
                          <strong>{formatearFechaSinZonaHoraria(e.fecha)}</strong>
                        </span>
                      </div>
                    </div>
                    <div className={styles.profesor}>
                      <p>Profesor designado</p>
                      <p>
                        <strong>
                          {e.Profesor?.persona?.nombre && e.Profesor?.persona?.apellido
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
                              {e.ciclo?.materiaPlan?.planEstudio?.carrera?.nombre || "Sin carrera"}
                            </strong>
                          </p>
                        </div>
                        <div>
                          <span>Resolución Nº</span>
                          <span>
                            <strong>
                              {e.ciclo?.materiaPlan?.planEstudio?.resolucion || "Sin resolución"}
                            </strong>
                          </span>
                        </div>
                      </div>
                      <div className={styles.accion}>
                        <Boton
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
                    }}
                  >
                    <X />
                  </button>
                </div>
                <Formik
                  initialValues={{
                    id_materia: "",
                    fecha: "",
                    id_profesor: "",
                  }}
                  validationSchema={Yup.object({
                    id_materia: Yup.string().required(
                      "Este campo es obligatorio"
                    ),
                    fecha: Yup.date()
                      .nullable(true)
                      .transform((curr, orig) => (orig === "" ? null : curr)),
                    id_profesor: Yup.string().required(
                      "Este campo es obligatorio"
                    ),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    const fecha = values.fecha || null;
                    registrarExamen.mutate({
                      idMateria: values.id_materia,
                      fecha,
                      idProfesor: values.id_profesor,
                    });
                    resetForm();
                    setRegistro(false);
                    setMateriaSeleccionada("");
                  }}
                >
                  {({
                    isSubmitting,
                    touched,
                    errors,
                    setFieldValue,
                    values,
                  }) => (
                    <Form>
                      <div>
                        <label htmlFor="id_materia">Materia - Resolución</label>
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
                            // Limpiar la selección de profesor cuando cambie la materia
                            setFieldValue("id_profesor", "");
                          }}
                        >
                          <option value="">Seleccioná una materia</option>
                          {materias.map((m) => (
                            <option value={m.id} key={m.id}>
                              {m.materiaPlan?.materia?.nombre} - (
                              {m.materiaPlan?.planEstudio?.resolucion})
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="id_materia"
                          component="div"
                          className="formikFieldErrorText"
                        />
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
                        <label htmlFor="id_profesor">Profesor designado</label>
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
                      </div>
                      <div className={styles.modalActions}>
                        <Boton
                          type="submit"
                          variant="success"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Registrando..." : "Registrar"}
                        </Boton>
                        <Boton
                          type="button"
                          onClick={() => {
                            setRegistro(false);
                            setMateriaSeleccionada("");
                          }}
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
        </div>
      )}
      <Outlet />
    </>
  );
};

export default GestionExamenesFinales;
