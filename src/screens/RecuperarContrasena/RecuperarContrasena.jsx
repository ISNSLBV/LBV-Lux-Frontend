import React, { useState, useEffect } from "react";
import styles from "./RecuperarContrasena.module.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Boton from "../../components/Boton/Boton";
import api from "../../api/axios";
import CircularProgress from "@mui/material/CircularProgress";

const RECOVERY_TOKEN_KEY = "recoveryToken";

const RecuperarContrasena = () => {
  const navigate = useNavigate();
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [identificador, setIdentificador] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [recoveryToken, setRecoveryToken] = useState(null);
  const [checkingToken, setCheckingToken] = useState(true);
  const [pendingSession, setPendingSession] = useState(null);

  // Al cargar, verificar si hay un token de recuperación guardado
  useEffect(() => {
    const checkExistingToken = async () => {
      const savedToken = localStorage.getItem(RECOVERY_TOKEN_KEY);
      
      if (!savedToken) {
        setCheckingToken(false);
        return;
      }

      try {
        const { data } = await api.post("/auth/verificar-recovery-token", {
          recoveryToken: savedToken,
        });

        if (data.valid) {
          setPendingSession({
            identificador: data.identificador,
            email: data.email,
            timeRemaining: data.timeRemaining,
            token: savedToken,
          });
        } else {
          // Token inválido o expirado, limpiar
          localStorage.removeItem(RECOVERY_TOKEN_KEY);
        }
      } catch (error) {
        // Si hay error, limpiar el token
        localStorage.removeItem(RECOVERY_TOKEN_KEY);
      } finally {
        setCheckingToken(false);
      }
    };

    checkExistingToken();
  }, []);

  const solicitudSchema = Yup.object().shape({
    identificador: Yup.string()
      .required("Debes ingresar tu usuario o email")
      .min(3, "Debe tener al menos 3 caracteres"),
  });

  const handleSolicitud = async (values, { setSubmitting }) => {
    try {
      const { data } = await api.post("/auth/solicitar-recuperacion", {
        identificador: values.identificador,
      });

      setIdentificador(values.identificador);
      setExpiresIn(data.expiresIn || 900);
      setCodigoEnviado(true);

      // Guardar el token de recuperación en localStorage
      if (data.recoveryToken) {
        localStorage.setItem(RECOVERY_TOKEN_KEY, data.recoveryToken);
        setRecoveryToken(data.recoveryToken);
      }
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
      state: { identificador, expiresIn, recoveryToken },
    });
  };

  const handleContinuarSesionPendiente = () => {
    navigate("/restablecer-contrasena", {
      state: { 
        identificador: pendingSession.identificador, 
        expiresIn: pendingSession.timeRemaining,
        recoveryToken: pendingSession.token 
      },
    });
  };

  const handleCancelarSesionPendiente = async () => {
    try {
      // Cancelar en el backend
      await api.post("/auth/cancelar-recuperacion", {
        recoveryToken: pendingSession.token,
      });
    } catch (error) {
      // Si falla, igual continuamos (puede que ya haya expirado)
      console.error("Error al cancelar recuperación:", error);
    }
    
    // Limpiar localStorage y estado
    localStorage.removeItem(RECOVERY_TOKEN_KEY);
    setPendingSession(null);
  };

  // Mostrar loading mientras verifica token
  if (checkingToken) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loading}>
            <CircularProgress size={40} />
            <p>Verificando sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si hay una sesión pendiente, mostrar opción de continuar
  if (pendingSession) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.pendingSession}>
            <h1 className={styles.titulo}>Recuperación en Progreso</h1>
            <p className={styles.subtitulo}>
              Tenés una solicitud de recuperación activa para el usuario{" "}
              <strong>{pendingSession.identificador}</strong>.
            </p>
            <p className={styles.emailInfo}>
              El código fue enviado a: <strong>{pendingSession.email}</strong>
            </p>
            <p className={styles.tiempoRestante}>
              Tiempo restante: {Math.floor(pendingSession.timeRemaining / 60)}:{String(pendingSession.timeRemaining % 60).padStart(2, '0')} minutos
            </p>

            <div className={styles.actions}>
              <Boton
                variant="success"
                type="button"
                fullWidth
                onClick={handleContinuarSesionPendiente}
              >
                Continuar recuperación
              </Boton>
              <Boton
                variant="cancel"
                type="button"
                fullWidth
                onClick={handleCancelarSesionPendiente}
              >
                Iniciar nueva solicitud
              </Boton>
              <Boton
                variant="primary"
                type="button"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Volver al inicio
              </Boton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {!codigoEnviado ? (
          <>
            <h1 className={styles.titulo}>Recuperar Contraseña</h1>
            <p className={styles.subtitulo}>
              Ingresá tu nombre de usuario o email registrado. Te enviaremos un
              código de verificación para restablecer tu contraseña.
            </p>

            <Formik
              initialValues={{ identificador: "" }}
              validationSchema={solicitudSchema}
              onSubmit={handleSolicitud}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className={styles.form}>
                  <div className={styles.inputGroup}>
                    <Field
                      id="identificador"
                      name="identificador"
                      type="text"
                      placeholder="Ingresá tu usuario o email"
                      className={
                        errors.identificador && touched.identificador
                          ? "formikFieldError"
                          : "formikField"
                      }
                      disabled={isSubmitting}
                    />
                    {errors.identificador && touched.identificador && (
                      <div className="formikFieldErrorText">
                        {errors.identificador}
                      </div>
                    )}
                  </div>

                  <div className={styles.actions}>
                    <Boton
                      variant="success"
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
                      variant="primary"
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
              Si el usuario existe, vamos a enviar un código de verificación a tu
              email registrado. Revisá tu bandeja de entrada y tu carpeta de spam.
            </p>
            <p className={styles.successInfo}>
              El código es válido por 15 minutos.
            </p>

            <div className={styles.actions}>
              <Boton
                variant="success"
                type="button"
                fullWidth
                onClick={handleContinuar}
              >
                Continuar a recuperación
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
