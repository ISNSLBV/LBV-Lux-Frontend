import React, { useState, useEffect } from "react";
import styles from "./RestablecerContrasena.module.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Boton from "../../components/Boton/Boton";
import logo from "../../assets/logo.png";
import api from "../../api/axios";
import CircularProgress from "@mui/material/CircularProgress";

const RestablecerContrasena = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(0);
  const [identifier, setIdentifier] = useState("");

  useEffect(() => {
    // Obtener datos del state de navegación
    const stateData = location.state;
    
    if (stateData?.identifier) {
      setIdentifier(stateData.identifier);
      if (stateData.expiresIn) {
        setCountdown(stateData.expiresIn);
      }
    }
  }, [location.state]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
        identifier: identifier,
        codigo: values.codigo,
        nuevaPassword: values.nuevaPassword,
      });

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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img className={styles.logo} src={logo} alt="Logo del Instituto" />

        <h1 className={styles.title}>Restablecer Contraseña</h1>
        <p className={styles.subtitle}>
          Ingresá el código de verificación que enviamos a tu email {identifier && `asociado a: ${identifier}`} y tu nueva
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
                {countdown > 0 && (
                  <div className={styles.countdown}>
                    Código válido por: <strong>{formatTime(countdown)}</strong>
                  </div>
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
                  variant="primary"
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
              onClick={() => navigate("/recuperar-contrasena")}
            >
              Solicitar uno nuevo
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestablecerContrasena;
