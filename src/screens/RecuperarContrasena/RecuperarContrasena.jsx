import React, { useState } from "react";
import styles from "./RecuperarContrasena.module.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Boton from "../../components/Boton/Boton";
import logo from "../../assets/logo.png";
import api from "../../api/axios";
import CircularProgress from "@mui/material/CircularProgress";

const RecuperarContrasena = () => {
  const navigate = useNavigate();
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);

  const solicitudSchema = Yup.object().shape({
    identifier: Yup.string()
      .required("Ingresá tu nombre de usuario o email")
      .min(3, "Debe tener al menos 3 caracteres"),
  });

  const handleSolicitud = async (values, { setSubmitting }) => {
    try {
      const { data } = await api.post("/auth/solicitar-recuperacion", {
        identifier: values.identifier,
      });

      setIdentifier(values.identifier);
      setExpiresIn(data.expiresIn || 900);
      setCodigoEnviado(true);
      toast.success(data.message);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Error al procesar la solicitud. Intentá nuevamente.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinuar = () => {
    navigate("/restablecer-contrasena", {
      state: { identifier, expiresIn },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img className={styles.logo} src={logo} alt="Logo del Instituto" />

        {!codigoEnviado ? (
          <>
            <h1 className={styles.title}>Recuperar Contraseña</h1>
            <p className={styles.subtitle}>
              Ingresá tu nombre de usuario o email registrado. Te enviaremos un
              código de verificación para restablecer tu contraseña.
            </p>

            <Formik
              initialValues={{ identifier: "" }}
              validationSchema={solicitudSchema}
              onSubmit={handleSolicitud}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="identifier">
                      Usuario o Email
                    </label>
                    <Field
                      id="identifier"
                      name="identifier"
                      type="text"
                      placeholder="Ingresá tu usuario o email"
                      className={
                        errors.identifier && touched.identifier
                          ? "formikFieldError"
                          : "formikField"
                      }
                      disabled={isSubmitting}
                    />
                    {errors.identifier && touched.identifier && (
                      <div className="formikFieldErrorText">
                        {errors.identifier}
                      </div>
                    )}
                  </div>

                  <div className={styles.actions}>
                    <Boton
                      variant="primary"
                      type="submit"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Enviar código"
                      )}
                    </Boton>

                    <Boton
                      variant="cancel"
                      type="button"
                      fullWidth
                      onClick={() => navigate("/login")}
                      disabled={isSubmitting}
                    >
                      Volver al inicio
                    </Boton>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Código Enviado</h2>
            <p className={styles.successText}>
              Si el usuario existe, enviamos un código de verificación a tu
              email registrado. Revisá tu bandeja de entrada y tu carpeta de spam.
            </p>
            <p className={styles.successInfo}>
              El código es válido por 15 minutos.
            </p>

            <div className={styles.actions}>
              <Boton
                variant="primary"
                type="button"
                fullWidth
                onClick={handleContinuar}
              >
                Continuar
              </Boton>
              <Boton
                variant="cancel"
                type="button"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Volver al inicio
              </Boton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecuperarContrasena;
