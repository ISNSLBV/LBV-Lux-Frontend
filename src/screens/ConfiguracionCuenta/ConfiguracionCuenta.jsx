import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "./ConfiguracionCuenta.module.css";
import Boton from "../../components/Boton/Boton";
import * as Yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import BotonVolver from "../../components/BotonVolver/BotonVolver";

const ConfiguracionCuenta = () => {
  const { user } = useAuth();
  const idUsuario = user.id;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const personalSchema = Yup.object({
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

  const fetchDatos = async () => {
    const { data } = await api.get(`/usuario/${idUsuario}/datos-personales`);
    return data;
  };

  const {
    data: datosPersonales,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["datosPersonales", idUsuario],
    queryFn: fetchDatos,
  });

  const actualizarDatosPersonales = useMutation({
    mutationFn: ({ email, telefono }) =>
      api.put(`/usuario/${idUsuario}/actualizar-datos-personales`, {
        email,
        telefono,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["datosPersonales", idUsuario],
      });
      toast.success("Datos personales actualizados correctamente");
    },
    onError: () => {
      toast.error("Error al actualizar los datos personales");
    },
  });

  const actualizarPassword = useMutation({
    mutationFn: ({ actual, nueva }) =>
      api.put(`/usuario/${idUsuario}/actualizar-password`, {
        actual,
        nueva,
      }),
    onSuccess: () => {
      toast.success("Contraseña cambiada correctamente");
    },
    onError: () => {
      toast.error("Error al cambiar la contraseña");
    },
  });

  return (
    <div className={styles.formContainer}>
      <BotonVolver />
      <h1 className={styles.title}>Configuración de Cuenta</h1>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Información personal</h2>
          {isLoading ? (
            <CircularProgress color="inherit" />
          ) : isError ? (
            <p>Error al cargar los datos</p>
          ) : (
            <Formik
              enableReinitialize
              initialValues={{
                email: datosPersonales?.email || "",
                telefono: datosPersonales?.telefono || "",
              }}
              validationSchema={personalSchema}
              onSubmit={(values, { setSubmitting }) => {
                actualizarDatosPersonales.mutate(values);
                setSubmitting(false);
              }}
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
                    variant="primary"
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
          )}
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
            onSubmit={(values, { setSubmitting, resetForm }) => {
              actualizarPassword.mutate({
                actual: values.actual,
                nueva: values.nueva,
              });
              setSubmitting(false);
              resetForm();
            }}
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
                  variant="primary"
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
