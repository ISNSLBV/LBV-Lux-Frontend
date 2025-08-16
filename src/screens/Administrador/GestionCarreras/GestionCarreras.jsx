import React from "react";
import { useState } from "react";
import styles from "./GestionCarreras.module.css";
import Boton from "../../../components/Boton/Boton";
import { Plus, SquarePen, X } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../../api/axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const schemaCarrera = Yup.object().shape({
  nombre: Yup.string()
    .min(10, "Nombre no válido")
    .required("Este campo es obligatorio"),
  duracion: Yup.number()
    .typeError("Debe ser un número")
    .min(1, "Duración mínima: 1 año")
    .max(10, "Duración máxima: 10 años")
    .required("Este campo es obligatorio"),
});

const fetchCarreras = async () => {
  const { data } = await api.get("/admin/carrera/listar-carreras");
  return data;
};

const GestionCarreras = () => {
  const [filtro, setFiltro] = useState("");
  const [edicion, setEdicion] = useState(false);
  const [registro, setRegistro] = useState(false);
  const [nuevaCarrera, setNuevaCarrera] = useState({
    nombre: "",
    duracion: "",
  });
  const [carreraEditada, setCarreraEditada] = useState({
    id: "",
    nombre: "",
    duracion: "",
  });

  const queryClient = useQueryClient();

  const {
    data: carreras = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["carreras"],
    queryFn: fetchCarreras,
  });

  const registrarCarrera = useMutation({
    mutationFn: ({ nombre, duracion }) =>
      api.post("/admin/carrera/registrar-carrera", { nombre, duracion }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carreras"] });
      toast.success("Carrera registrada");
    },
    onError: () => toast.error("Error al registrar la carrera"),
  });

  const editarCarrera = useMutation({
    mutationFn: ({ id, nombre, duracion }) =>
      api.put(`/admin/carrera/${id}`, { nombre, duracion }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carreras"] });
      toast.success("Carrera editada");
      setEdicion(false);
    },
    onError: () => toast.error("Error al editar la carrera"),
  });

  const carrerasFiltradas = carreras.filter((c) =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Carreras</h1>
        <p>Gestioná las carreras del instituto</p>
      </div>
      <div className={styles.listaCarreras}>
        <div className={styles.listaHeader}>
          <h2>Listado de carreras</h2>
          <Boton
            variant="success"
            icono={<Plus />}
            onClick={() => setRegistro(true)}
          >
            Registrar nueva carrera
          </Boton>
        </div>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Duración</th>
              <th>Plan de estudio vigente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 32 }}>
                  <CircularProgress color="inherit" />
                </td>
              </tr>
            ) : carrerasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 32 }}>
                  No se encontraron carreras
                </td>
              </tr>
            ) : (
              carrerasFiltradas.map((c) => (
                <tr key={c.id} className={styles.tablaFila}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.duracion} años</td>
                  <td>{c.plan_estudio_vigente}</td>
                  <td>
                    <Boton
                      variant="onlyIcon"
                      icono={<SquarePen />}
                      onClick={() => {
                        setCarreraEditada({
                          id: c.id,
                          nombre: c.nombre,
                          duracion: c.duracion,
                        });
                        setEdicion(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className={styles.cards}>
          {isLoading ? (
            <div style={{ textAlign: "center" }}>
              <CircularProgress color="inherit" />
            </div>
          ) : carrerasFiltradas.length === 0 ? (
            <div>
              <p>No se encontraron carreras</p>
            </div>
          ) : (
            carrerasFiltradas.map((m) => (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderContent}>
                    <div className={styles.cardHeaderTitle}>
                      <h3>{m.nombre}</h3>
                      <p>ID: {m.id}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div>
                    <div>
                      <h4>Duración</h4>
                      <p>{m.duracion} años</p>
                    </div>
                  </div>
                  <div>
                    <h4>Plan de estudio vigente</h4>
                    <div>{m.plan_estudio_vigente}</div>
                  </div>
                  <div className={styles.cardActions}>
                    <Boton fullWidth icono={<SquarePen />} variant="primary">
                      Editar
                    </Boton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de registro */}
      {registro && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Registrar nueva carrera</h3>
              <button
                className={styles.closeButton}
                onClick={() => setRegistro(false)}
              >
                <X />
              </button>
            </div>
            <Formik
              initialValues={{ nombre: "", duracion: "" }}
              validationSchema={schemaCarrera}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                registrarCarrera.mutate({
                  nombre: values.nombre.trim(),
                  duracion: values.duracion.trim(),
                });
                setSubmitting(false);
                resetForm();
                setRegistro(false);
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <div>
                    <label htmlFor="nombre">Nombre</label>
                    <Field
                      id="nombre"
                      name="nombre"
                      type="text"
                      className={
                        errors.nombre && touched.nombre
                          ? "formikFieldError"
                          : "formikField"
                      }
                    />
                    <ErrorMessage
                      name="nombre"
                      component="div"
                      className="formikFieldErrorText"
                    />
                  </div>
                  <div>
                    <label htmlFor="duracion">Duración (en años)</label>
                    <Field
                      id="duracion"
                      name="duracion"
                      type="text"
                      className={
                        errors.duracion && touched.duracion
                          ? "formikFieldError"
                          : "formikField"
                      }
                    />
                    <ErrorMessage
                      name="duracion"
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
                      Crear
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

      {edicion && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Editar carrera</h3>
              <button
                className={styles.closeButton}
                onClick={() => setEdicion(false)}
              >
                <X />
              </button>
            </div>
            <Formik
              initialValues={{
                nombre: carreraEditada.nombre,
                duracion: carreraEditada.duracion,
              }}
              validationSchema={schemaCarrera}
              enableReinitialize
              onSubmit={(values, { setSubmitting, resetForm }) => {
                editarCarrera.mutate({
                  id: carreraEditada.id,
                  nombre: values.nombre.trim(),
                  duracion: values.duracion.toString().trim(),
                });
                setSubmitting(false);
                resetForm();
                setEdicion(false);
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className={styles.modalForm}>
                  <div>
                    <label htmlFor="nombre">Nombre</label>
                    <Field
                      id="nombre"
                      name="nombre"
                      type="text"
                      className={
                        errors.nombre && touched.nombre
                          ? "formikFieldError"
                          : "formikField"
                      }
                      required
                    />
                    <ErrorMessage
                      name="nombre"
                      component="div"
                      className="formikFieldErrorText"
                    />
                  </div>
                  <div>
                    <label htmlFor="duracion">Duración (en años)</label>
                    <Field
                      id="duracion"
                      name="duracion"
                      type="number"
                      className={
                        errors.duracion && touched.duracion
                          ? "formikFieldError"
                          : "formikField"
                      }
                      required
                    />
                    <ErrorMessage
                      name="duracion"
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
                      Guardar
                    </Boton>
                    <Boton type="button" onClick={() => setEdicion(false)}>
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
  );
};

export default GestionCarreras;
