import React, { useState } from "react";
import * as Yup from "yup";
import Boton from "../../../components/Boton/Boton";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./GestionProfesores.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import api from "../../../api/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schemaPreinscripcion } from "../../../components/preinscripcion/utils/schemaPreinscripcion";
import { Plus, X, SquarePen } from "lucide-react";

const fetchProfesores = async () => {
  const { data } = await api.get("/admin/profesor/listar-profesores");
  return data;
};

export default function GestionProfesores() {
  const [filtro, setFiltro] = useState("");
  const [registro, setRegistro] = useState(false);
  const [vinculando, setVinculando] = useState(false);
  const [edicion, setEdicion] = useState(false);
  const [modoRegistro, setModoRegistro] = useState("dni");

  const queryClient = useQueryClient();

  const {
    data: profesores = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profesores"],
    queryFn: fetchProfesores,
  });

  const registrarProfesor = useMutation({
    mutationFn: (datos) => api.post("/admin/profesor/registrar-profesor", datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profesores"] });
      toast.success("Profesor registrado");
    },
    onError: () => toast.error("Error al registrar al profesor"),
  });

  const profesoresFiltrados = profesores.filter((p) =>
    p.persona?.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Profesores</h1>
        <p>Gestioná los profesores del instituto</p>
      </div>
      <div className={styles.barraAcciones}>
        <div className={styles.barraBusqueda}>
          <SearchBar
            placeholder="Buscar profesor"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <div>
          <Boton
            variant="success"
            icono={<Plus />}
            onClick={() => setRegistro(true)}
          >
            Registrar profesor
          </Boton>
        </div>
      </div>
      <div className={styles.listaProfesores}>
        <h2>Listado de profesores</h2>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Rol(es)</th>
              <th>Materias actuales</th>
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
            ) : profesoresFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 32 }}>
                  No se encontraron profesores
                </td>
              </tr>
            ) : (
              profesoresFiltrados.map((p) => (
                <tr key={p.id} className={styles.tablaFila}>
                  <td>{p.persona?.dni}</td>
                  <td>{`${p.persona?.nombre} ${p.persona?.apellido}`}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>
                    <Boton
                      variant="onlyIcon"
                      icono={<SquarePen />}
                      onClick={() => {
                        setEdicion(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {registro && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Registrar profesor</h3>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setRegistro(false);
                  setModoRegistro("dni");
                }}
              >
                <X />
              </button>
            </div>

            {/* OPCIONES: Tabs o Botones */}
            <div className={styles.modoSwitch}>
              <button
                className={
                  modoRegistro === "dni" ? styles.tabActivo : styles.tab
                }
                onClick={() => setModoRegistro("dni")}
              >
                Registrar por DNI
              </button>
              <button
                className={
                  modoRegistro === "completo" ? styles.tabActivo : styles.tab
                }
                onClick={() => setModoRegistro("completo")}
              >
                Registro completo
              </button>
            </div>

            {modoRegistro === "dni" && (
              <Formik
                initialValues={{ dni: "" }}
                validationSchema={Yup.object({
                  dni: Yup.string().required("Ingrese el DNI"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  registrarProfesor.mutate(
                    { dni: values.dni.trim() },
                    {
                      onSuccess: () => {
                        setRegistro(false);
                        resetForm();
                      },
                      onError: (err) => {
                        if (err.response && err.response.status === 404) {
                          setModoRegistro("completo");
                        }
                      },
                    }
                  );
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <div>
                      <label htmlFor="dni">DNI</label>
                      <Field
                        id="dni"
                        name="dni"
                        type="text"
                        className={
                          errors.dni && touched.dni
                            ? "formikFieldError"
                            : "formikField"
                        }
                      />
                      <ErrorMessage
                        name="dni"
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
                        Registrar por DNI
                      </Boton>
                      <Boton type="button" onClick={() => setRegistro(false)}>
                        Cancelar
                      </Boton>
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {/* FORMULARIO "REGISTRO COMPLETO" */}
            {modoRegistro === "completo" && (
              <Formik
                initialValues={{
                  nombre: "",
                  apellido: "",
                  sexo: "",
                  email: "",
                  dni: "",
                  telefono: "",
                  fecha_nacimiento: "",
                }}
                validationSchema={Yup.object({
                  nombre: Yup.string().required("Ingrese el nombre"),
                  apellido: Yup.string().required("Ingrese el apellido"),
                  sexo: Yup.string()
                    .oneOf(["F", "M", "X"])
                    .required("Seleccione el sexo"),
                  email: Yup.string()
                    .email("Email inválido")
                    .required("Ingrese el email"),
                  dni: Yup.string().required("Ingrese el DNI"),
                  telefono: Yup.string().required("Ingrese el teléfono"),
                  fecha_nacimiento: Yup.string().required(
                    "Ingrese la fecha de nacimiento"
                  ),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  registrarProfesor.mutate(
                    {
                      nombre: values.nombre.trim(),
                      apellido: values.apellido.trim(),
                      sexo: values.sexo,
                      email: values.email.trim(),
                      dni: values.dni.trim(),
                      telefono: values.telefono.trim(),
                      fecha_nacimiento: values.fecha_nacimiento,
                    },
                    {
                      onSuccess: () => {
                        setRegistro(false);
                        resetForm();
                      },
                    }
                  );
                  setSubmitting(false);
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
                      <label htmlFor="apellido">Apellido</label>
                      <Field
                        id="apellido"
                        name="apellido"
                        type="text"
                        className={
                          errors.apellido && touched.apellido
                            ? "formikFieldError"
                            : "formikField"
                        }
                      />
                      <ErrorMessage
                        name="apellido"
                        component="div"
                        className="formikFieldErrorText"
                      />
                    </div>
                    <div>
                      <label htmlFor="sexo">Sexo</label>
                      <Field
                        as="select"
                        id="sexo"
                        name="sexo"
                        className={
                          errors.sexo && touched.sexo
                            ? "formikFieldError"
                            : "formikField"
                        }
                      >
                        <option value="">Seleccione...</option>
                        <option value="F">Femenino</option>
                        <option value="M">Masculino</option>
                        <option value="O">Otro</option>
                      </Field>
                      <ErrorMessage
                        name="sexo"
                        component="div"
                        className="formikFieldErrorText"
                      />
                    </div>
                    <div>
                      <label htmlFor="email">Email</label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className={
                          errors.email && touched.email
                            ? "formikFieldError"
                            : "formikField"
                        }
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="formikFieldErrorText"
                      />
                    </div>
                    <div>
                      <label htmlFor="dni">DNI</label>
                      <Field
                        id="dni"
                        name="dni"
                        type="text"
                        className={
                          errors.dni && touched.dni
                            ? "formikFieldError"
                            : "formikField"
                        }
                      />
                      <ErrorMessage
                        name="dni"
                        component="div"
                        className="formikFieldErrorText"
                      />
                    </div>
                    <div>
                      <label htmlFor="telefono">Teléfono</label>
                      <Field
                        id="telefono"
                        name="telefono"
                        type="text"
                        className={
                          errors.telefono && touched.telefono
                            ? "formikFieldError"
                            : "formikField"
                        }
                      />
                      <ErrorMessage
                        name="telefono"
                        component="div"
                        className="formikFieldErrorText"
                      />
                    </div>
                    <div>
                      <label htmlFor="fecha_nacimiento">
                        Fecha de nacimiento
                      </label>
                      <Field
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        type="date"
                        className={
                          errors.fecha_nacimiento && touched.fecha_nacimiento
                            ? "formikFieldError"
                            : "formikField"
                        }
                      />
                      <ErrorMessage
                        name="fecha_nacimiento"
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
                        Registrar
                      </Boton>
                      <Boton type="button" onClick={() => setRegistro(false)}>
                        Cancelar
                      </Boton>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
