import React, { useState, useEffect } from "react";
import styles from "./RestablecerContrasena.module.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Boton from "../../components/Boton/Boton";
import api from "../../api/axios";
import CircularProgress from "@mui/material/CircularProgress";

const RECOVERY_TOKEN_KEY = "recoveryToken";

const RestablecerContrasena = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(0);
  const [identificador, setIdentificador] = useState("");
  const [reenviando, setReenviando] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeFromState = async () => {
      const stateData = location.state;
      
      // Si viene data del state de navegación, usarla
      if (stateData?.identificador) {
        setIdentificador(stateData.identificador);
        if (stateData.expiresIn) {
          setCountdown(stateData.expiresIn);
        }
        if (stateData.recoveryToken) {
          setRecoveryToken(stateData.recoveryToken);
        }
        setLoading(false);
        return;
      }
      
      // Si no hay state, intentar recuperar del localStorage
      const savedToken = localStorage.getItem(RECOVERY_TOKEN_KEY);
      
      if (savedToken) {
        try {
          const { data } = await api.post("/auth/verificar-recovery-token", {
            recoveryToken: savedToken,
          });

          if (data.valid) {
            setIdentificador(data.identificador);
            setCountdown(data.timeRemaining);
            setRecoveryToken(savedToken);
            setLoading(false);
            return;
          }
        } catch (error) {
          // Token inválido
        }
        
        // Si llegamos acá, el token no es válido
        localStorage.removeItem(RECOVERY_TOKEN_KEY);
      }
      
      // No hay sesión válida, redirigir
      toast.error("No hay una sesión de recuperación activa. Por favor, iniciá el proceso nuevamente.");
      navigate("/recuperar-contrasena");
    };

    initializeFromState();
  }, [location.state, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleReenviarCodigo = async () => {
    if (!identificador) {
      toast.error("No se puede reenviar el código. Volvé a iniciar el proceso.");
      navigate("/recuperar-contrasena");
      return;
    }

    setReenviando(true);
    try {
      const { data } = await api.post("/auth/solicitar-recuperacion", {
        identificador: identificador,
        forzarReenvio: true,
      });

      if (data.sent) {
        toast.success("Nuevo código enviado a tu email");
        setCountdown(data.expiresIn || 900); // 15 minutos por defecto
      } else {
        toast.info(data.message);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Error al reenviar el código. Intentá nuevamente.";
      toast.error(message);
    } finally {
      setReenviando(false);
    }
  };

  const resetSchema = Yup.object().shape({
    codigo: Yup.string()
      .matches(/^[0-9]{6}$/, "El código debe tener 6 dígitos")
      .required("Ingresá el código de verificación"),
    nuevaPassword: Yup.string()
      .min(8, "Debe tener al menos 8 caracteres")
      .matches(/[A-Z]/, "Debe incluir una mayúscula")
      .matches(/[a-z]/, "Debe incluir una minúscula")
      .matches(/[0-9]/, "Debe incluir un número")
      .required("Ingresá tu nueva contraseña"),
    confirmarPassword: Yup.string()
      .oneOf([Yup.ref("nuevaPassword"), null], "Las contraseñas no coinciden")
      .required("Confirmá tu nueva contraseña"),
  });

  const handleReset = async (values, { setSubmitting }) => {
    try {
      const { data } = await api.post("/auth/restablecer-contrasena", {
        identificador: identificador,
        codigo: values.codigo,
        nuevaPassword: values.nuevaPassword,
      });

      // Limpiar el token de recuperación del localStorage
      localStorage.removeItem(RECOVERY_TOKEN_KEY);

      toast.success(data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Error al restablecer la contraseña. Verificá el código e intentá nuevamente.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Mostrar loading mientras verifica el token
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
            <CircularProgress size={40} />
            <p>Verificando sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h1 className={styles.titulo}>Restablecer Contraseña</h1>
        <p className={styles.subtitulo}>
          Ingresá el código de verificación que enviamos a {identificador && `${identificador}`} y tu nueva
          contraseña.
        </p>

        <Formik
          initialValues={{
            codigo: "",
            nuevaPassword: "",
            confirmarPassword: "",
          }}
          validationSchema={resetSchema}
          onSubmit={handleReset}
        >
          {({ isSubmitting, errors, touched, values, setFieldValue }) => (
            <Form className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="codigo">Código de Verificación</label>
                <Field
                  id="codigo"
                  name="codigo"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  className={
                    errors.codigo && touched.codigo
                      ? "formikFieldError"
                      : "formikField"
                  }
                  disabled={isSubmitting}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setFieldValue("codigo", value);
                  }}
                />
                {errors.codigo && touched.codigo && (
                  <div className="formikFieldErrorText">{errors.codigo}</div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="nuevaPassword">Nueva Contraseña</label>
                <Field
                  id="nuevaPassword"
                  name="nuevaPassword"
                  type="password"
                  placeholder="Ingresá tu nueva contraseña"
                  className={
                    errors.nuevaPassword && touched.nuevaPassword
                      ? "formikFieldError"
                      : "formikField"
                  }
                  disabled={isSubmitting}
                />
                {errors.nuevaPassword && touched.nuevaPassword && (
                  <div className="formikFieldErrorText">
                    {errors.nuevaPassword}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmarPassword">
                  Confirmar Nueva Contraseña
                </label>
                <Field
                  id="confirmarPassword"
                  name="confirmarPassword"
                  type="password"
                  placeholder="Confirmá tu nueva contraseña"
                  className={
                    errors.confirmarPassword && touched.confirmarPassword
                      ? "formikFieldError"
                      : "formikField"
                  }
                  disabled={isSubmitting}
                />
                {errors.confirmarPassword && touched.confirmarPassword && (
                  <div className="formikFieldErrorText">
                    {errors.confirmarPassword}
                  </div>
                )}
              </div>

              <div className={styles.infoBox}>
                <p>
                  La contraseña debe tener al menos 8 caracteres, incluyendo
                  al menos una mayúscula, una minúscula y un número.
                </p>
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
                    "Restablecer contraseña"
                  )}
                </Boton>

                <Boton
                  variant="cancel"
                  type="button"
                  fullWidth
                  onClick={() => navigate("/login")}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Boton>
              </div>
            </Form>
          )}
        </Formik>

        <div className={styles.help}>
          <p>
            ¿No recibiste el código?{" "}
            <button
              className={styles.linkButton}
              onClick={handleReenviarCodigo}
              disabled={reenviando}
            >
              {reenviando ? "Enviando..." : "Solicitar uno nuevo"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestablecerContrasena;
