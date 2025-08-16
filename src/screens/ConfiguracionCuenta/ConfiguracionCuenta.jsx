import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './ConfiguracionCuenta.module.css';
import Boton from '../../components/Boton/Boton';
import * as Yup from 'yup';

const ConfiguracionCuenta = () => {
  const personalSchema = Yup.object({
    nombre: Yup.string().required('Campo obligatorio'),
    apellido: Yup.string().required('Campo obligatorio'),
    email: Yup.string().email('Formato inválido').required('Campo obligatorio'),
    telefono: Yup.string()
      .matches(/^[0-9]+$/, 'Solo se permiten números')
      .min(10, 'Debe tener al menos 10 dígitos')
      .max(15, 'No puede superar los 15 dígitos')
      .required('Campo obligatorio'),
  });

  const passwordSchema = Yup.object({
    actual: Yup.string().required('Campo obligatorio'),
    nueva: Yup.string()
      .min(8, 'Debe tener al menos 8 caracteres')
      .matches(/[A-Z]/, 'Debe incluir una mayúscula')
      .matches(/[a-z]/, 'Debe incluir una minúscula')
      .matches(/[0-9]/, 'Debe incluir un número')
      .required('Campo obligatorio'),
    confirmar: Yup.string()
      .oneOf([Yup.ref('nueva'), null], 'Las contraseñas no coinciden')
      .required('Campo obligatorio'),
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
    <div className={styles.wrapper}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Configuración de Cuenta</h1>

        <div className={styles.container}>
          {/* Información Personal */}
          <div className={styles.card}>
            <h2>Información personal</h2>
            <Formik
              initialValues={{
                email: '',
                telefono: '',
              }}
              validationSchema={personalSchema}
              onSubmit={guardarDatosPersonales}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <label>Correo electrónico</label>
                  <div className={styles.fieldWithButton}>
                    <Field
                      name="email"
                      type="email"
                      className={`${styles.input} ${
                        errors.email && touched.email ? styles.inputError : ''
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className={styles.error}
                  />

                  <label>Teléfono</label>
                  <div className={styles.fieldWithButton}>
                    <Field
                      name="telefono"
                      type="tel"
                      inputMode="numeric"
                      className={`${styles.input} ${
                        errors.telefono && touched.telefono ? styles.inputError : ''
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="telefono"
                    component="div"
                    className={styles.error}
                  />

                  <Boton type="submit" size="md" fullWidth disabled={isSubmitting}>
                    Guardar cambios
                  </Boton>
                </Form>
              )}
            </Formik>
          </div>

          {/* Seguridad */}
          <div className={styles.card}>
            <h2>Seguridad</h2>
            <Formik
              initialValues={{
                actual: '',
                nueva: '',
                confirmar: '',
              }}
              validationSchema={passwordSchema}
              onSubmit={cambiarPassword}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <label>Contraseña actual</label>
                  <Field
                    name="actual"
                    type="password"
                    placeholder="Ingrese su contraseña actual"
                    className={`${styles.input} ${
                      errors.actual && touched.actual ? styles.inputError : ''
                    }`}
                  />
                  <ErrorMessage name="actual" component="div" className={styles.error} />

                  <label>Nueva Contraseña</label>
                  <Field
                    name="nueva"
                    type="password"
                    placeholder="Ingrese su nueva contraseña"
                    className={`${styles.input} ${
                      errors.nueva && touched.nueva ? styles.inputError : ''
                    }`}
                  />
                  <ErrorMessage name="nueva" component="div" className={styles.error} />

                  <label>Confirmar nueva contraseña</label>
                  <Field
                    name="confirmar"
                    type="password"
                    placeholder="Confirma tu nueva contraseña"
                    className={`${styles.input} ${
                      errors.confirmar && touched.confirmar ? styles.inputError : ''
                    }`}
                  />
                  <ErrorMessage name="confirmar" component="div" className={styles.error} />

                  <div className={styles.passwordHint}>
                    La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas,
                    minúsculas y números.
                  </div>

                  <Boton type="submit" size="md" fullWidth disabled={isSubmitting}>
                    Cambiar Contraseña
                  </Boton>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionCuenta;
