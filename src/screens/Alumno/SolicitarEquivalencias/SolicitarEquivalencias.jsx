import React from "react";
import styles from "./SolicitarEquivalencias.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Boton from "../../../components/Boton/Boton";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const SolicitarEquivalencias = () => {
  const queryClient = useQueryClient();

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
    <div className={styles.container}>
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
            origenInstitucion: "",
            origenMateria: "",
            origenCalificacion: "",
            resolucion: "",
          }}
          validationSchema={Yup.object({
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
    </div>
  );
};

export default SolicitarEquivalencias;
