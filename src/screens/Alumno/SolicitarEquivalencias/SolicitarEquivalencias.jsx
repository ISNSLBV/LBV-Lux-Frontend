import React from "react";
import styles from "./SolicitarEquivalencias.module.css";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Boton from "../../../components/Boton/Boton";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../../api/axios";
import { toast } from "react-toastify";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";
import { useAuth } from "../../../contexts/AuthContext";

const obtenerCarreras = async () => {
  const { data } = await api.get("/alumno/carreras");
  return data;
};

const SolicitarEquivalencias = () => {
  const navigate = useNavigate();
  const { estadoCarreras } = useAuth();
  const queryClient = useQueryClient();

  const { data: carreras = [], isLoading: carrerasLoading } = useQuery({
    queryKey: ["carrerasInscripto"],
    queryFn: obtenerCarreras,
    onError: (error) => {
      console.error("Error al obtener las carreras: ", error);
    },
  });

  // Verificar si puede acceder
  React.useEffect(() => {
    if (estadoCarreras && !estadoCarreras.puedeAcceder) {
      toast.error("No tienes acceso a esta sección. Estás dado de baja en todas tus carreras.");
      navigate("/alumno");
    }
  }, [estadoCarreras, navigate]);

  const registrarSolicitud = useMutation({
    mutationFn: (payload) =>
      api.post("/equivalencia/alumno/solicitar", payload),
    onSuccess: () => {
      toast.success("Solicitud enviada correctamente");
      queryClient.invalidateQueries({ queryKey: ["solicitudesEquivalencias"] });
    },
    onError: () => {
      toast.error("Error al enviar la solicitud de equivalencias");
    },
  });
  return (
    <>
      <BotonVolver />
      <div className={styles.titulo}>
        <h1>Solicitar equivalencias</h1>
        <p>
          En caso de venir de otro instituto terciario o universitario y tener
          materias aprobadas, podés solicitar la equivalencia.
        </p>
      </div>
      <div className={styles.aviso}>
        <div>
          <h2>
            Que documentación debés presentar para solicitar equivalencias
          </h2>
          <ul>
            <li>Constancia de materias aprobadas en el instituto de origen</li>
            <li>Plan de estudios que cursabas en el instituto de origen</li>
            <li>Programa de cada materia por la que solicites equivalencia</li>
          </ul>
        </div>
        <div>
          <h2>A tener en cuenta</h2>
          <ul>
            <li>
              Si en tu instituto de origen cursabas el mismo plan de estudios
              que en nuestro instituto, no necesitas presentar el programa de
              cada materia.
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.formulario}>
        <h3>Formulario de solicitud de equivalencias</h3>
        <Formik
          initialValues={{
            idCarrera: carreras.length > 0 ? carreras[0].id : "",
            origenInstitucion: "",
            origenMateria: "",
            origenCalificacion: "",
            resolucion: "",
          }}
          validationSchema={Yup.object({
            idCarrera: carreras.length > 1
              ? Yup.string().required("Debes seleccionar una carrera")
              : Yup.string(),
            origenInstitucion: Yup.string().required(
              "Este campo es obligatorio"
            ),
            origenMateria: Yup.string().required(
              "Este campo es obligatorio"
            ),
            origenCalificacion: Yup.string().required(
              "Este campo es obligatorio"
            ),
            resolucion: Yup.string().required(
              "Este campo es obligatorio"
            ),
          })}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            registrarSolicitud.mutate(values, {
              onSuccess: () => {
                resetForm();
              },
              onSettled: () => setSubmitting(false),
            });
          }}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form>
              {carreras.length > 1 && (
                <div>
                  <label htmlFor="idCarrera">Carrera para la que solicitas la equivalencia</label>
                  <Field
                    as="select"
                    id="idCarrera"
                    name="idCarrera"
                    className={
                      errors.idCarrera && touched.idCarrera
                        ? "formikFieldError"
                        : "formikField"
                    }
                  >
                    <option value="">-- Selecciona una carrera --</option>
                    {carreras.map((carrera) => (
                      <option key={carrera.id} value={carrera.id}>
                        {carrera.nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="idCarrera"
                    component="div"
                    className="formikFieldErrorText"
                  />
                </div>
              )}

              <div>
                <label htmlFor="origenInstitucion">Instituto de origen</label>
                <Field
                  id="origenInstitucion"
                  name="origenInstitucion"
                  className={
                    errors.origenInstitucion && touched.origenInstitucion
                      ? "formikFieldError"
                      : "formikField"
                  }
                />
                <ErrorMessage
                  name="origenInstitucion"
                  component="div"
                  className="formikFieldErrorText"
                />
              </div>

              <div>
                <label htmlFor="origenMateria">
                  Nombre completo de la materia
                </label>
                <Field
                  id="origenMateria"
                  name="origenMateria"
                  className={
                    errors.origenMateria && touched.origenMateria
                      ? "formikFieldError"
                      : "formikField"
                  }
                />
                <ErrorMessage
                  name="origenMateria"
                  component="div"
                  className="formikFieldErrorText"
                />
              </div>

              <div>
                <label htmlFor="origenCalificacion">
                  Calificación obtenida en origen
                </label>
                <Field
                  id="origenCalificacion"
                  name="origenCalificacion"
                  className={
                    errors.origenCalificacion && touched.origenCalificacion
                      ? "formikFieldError"
                      : "formikField"
                  }
                />
                <ErrorMessage
                  name="origenCalificacion"
                  component="div"
                  className="formikFieldErrorText"
                />
              </div>

              <div>
                <label htmlFor="resolucion">
                  Resolución de plan de estudios de origen
                </label>
                <Field
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
              <div className={styles.accion}>
                <Boton
                  type="submit" 
                  variant="success" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Solicitar equivalencias"}
                </Boton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SolicitarEquivalencias;
