import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "./ConfiguracionCuenta.module.css";
import Boton from "../../components/Boton/Boton";
import * as Yup from "yup";

const ConfiguracionCuenta = () => {
  const personalSchema = Yup.object({
    nombre: Yup.string().required("Campo obligatorio"),
    apellido: Yup.string().required("Campo obligatorio"),
    email: Yup.string().email("Formato inválido").required("Campo obligatorio"),
    telefono: Yup.string()
      .matches(/^[0-9]+$/, "Solo se permiten números")
      .min(10, "Debe tener al menos 10 dígitos")
      .max(15, "No puede superar los 15 dígitos")
      .required("Campo obligatorio"),
  });

  const passwordSchema = Yup.object({
    actual: Yup.string().required("Campo obligatorio"),
    nueva: Yup.string()
      .min(8, "Debe tener al menos 8 caracteres")
      .matches(/[A-Z]/, "Debe incluir una mayúscula")
      .matches(/[a-z]/, "Debe incluir una minúscula")
      .matches(/[0-9]/, "Debe incluir un número")
      .required("Campo obligatorio"),
    confirmar: Yup.string()
      .oneOf([Yup.ref("nueva"), null], "Las contraseñas no coinciden")
      .required("Campo obligatorio"),
  });

  const [editEmail, setEditEmail] = useState(false);
  const [editTelefono, setEditTelefono] = useState(false);

  const guardarDatosPersonales = (values) => {
    setEditEmail(false);
    setEditTelefono(false);
    alert("Datos personales actualizados correctamente");
  };

  const cambiarPassword = (values) => {
    alert("Contraseña cambiada correctamente");
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Configuración de Cuenta</h1>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Información personal</h2>
          <Formik
            initialValues={{
              email: "",
              telefono: "",
            }}
            validationSchema={personalSchema}
            onSubmit={guardarDatosPersonales}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className={styles.form}>
                <div className={styles.campo}>
                  <label>Correo electrónico</label>
                  <Field
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
                <div className={styles.campo}>
                  <label>Teléfono</label>
                  <Field
                    name="telefono"
                    type="tel"
                    inputMode="numeric"
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
                <Boton
                  type="submit"
                  size="md"
                  fullWidth
                  disabled={isSubmitting}
                >
                  Guardar cambios
                </Boton>
              </Form>
            )}
          </Formik>
        </div>
        <div className={styles.card}>
          <h2>Seguridad</h2>
          <Formik
            initialValues={{
              actual: "",
              nueva: "",
              confirmar: "",
            }}
            validationSchema={passwordSchema}
            onSubmit={cambiarPassword}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className={styles.form}>
                <div className={styles.campo}>
                  <label>Contraseña actual</label>
                  <Field
                    name="actual"
                    type="password"
                    placeholder="Ingrese su contraseña actual"
                    className={
                      errors.actual && touched.actual
                        ? "formikFieldError"
                        : "formikField"
                    }
                  />
                  <ErrorMessage
                    name="actual"
                    component="div"
                    className="formikFieldErrorText"
                  />
                </div>
                <div className={styles.campo}>
                  <label>Nueva Contraseña</label>
                  <Field
                    name="nueva"
                    type="password"
                    placeholder="Ingrese su nueva contraseña"
                    className={
                      errors.nueva && touched.nueva
                        ? "formikFieldError"
                        : "formikField"
                    }
                  />
                  <ErrorMessage
                    name="nueva"
                    component="div"
                    className="formikFieldErrorText"
                  />
                </div>
                <div className={styles.campo}>
                  <label>Confirmar nueva contraseña</label>
                  <Field
                    name="confirmar"
                    type="password"
                    placeholder="Confirma tu nueva contraseña"
                    className={
                      errors.confirmar && touched.confirmar
                        ? "formikFieldError"
                        : "formikField"
                    }
                  />
                  <ErrorMessage
                    name="confirmar"
                    component="div"
                    className="formikFieldErrorText"
                  />
                </div>
                <div className={styles.passwordHint}>
                  La contraseña debe tener al menos 8 caracteres, incluyendo
                  mayúsculas, minúsculas y números.
                </div>

                <Boton
                  type="submit"
                  size="md"
                  fullWidth
                  disabled={isSubmitting}
                >
                  Cambiar Contraseña
                </Boton>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionCuenta;