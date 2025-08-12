import React from "react";
import styles from "./Login.module.css";
import { useState } from "react";
import { toast } from "react-toastify";
import Boton from "../../components/Boton/Boton";
import logo from "../../assets/logo.png";
import api from "../../api/axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .matches(/^[A-Za-z0-9_]{1,30}$/, "Nombre de usuario incorrecto")
    .required("Ingresá tu nombre de usuario"),
  password: Yup.string()
    .matches(/^.{4,}$/, "Contraseña incorrecta")
    .required("Ingresá tu contraseña"),
});

const SelectorRol = ({ roles, onSelect, onClose }) => {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>¿Con qué rol querés ingresar?</h3>
        <div className={styles.opciones}>
          {roles.map((r) => (
            <Boton
              variant="primary"
              fullWidth
              key={r}
              onClick={() => onSelect(r)}
            >
              {r}
            </Boton>
          ))}
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [seleccionandoRol, setSeleccionandoRol] = useState(null);
  const { login, refetchUser } = useAuth();
  const navigate = useNavigate();

  const handleSeleccionarRol = async (rol) => {
    try {
      await api.post("/auth/seleccionar-rol", { rol });
      await refetchUser();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al seleccionar rol");
    }
  };

  return (
    <div className={styles.container}>
      {seleccionandoRol && (
        <SelectorRol
          roles={seleccionandoRol.roles}
          onSelect={handleSeleccionarRol}
        />
      )}

      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={async (values, helpers) => {
          const { success, error, roles } = await login(
            values.username,
            values.password
          );

          if (!success) {
            toast.error(error || "Error al iniciar sesión");
            helpers.setSubmitting(false);
            return;
          }

          if (!roles || roles.length === 0) {
            toast.error("Este usuario no tiene un rol asignado");
            helpers.setSubmitting(false);
            return;
          }

          if (roles.length === 1) {
            try {
              await api.post("/auth/seleccionar-rol", { rol: roles[0] });
              await refetchUser();
              navigate("/");
            } catch {
              toast.error("Error seleccionando rol");
            }
          } else {
            setSeleccionandoRol({ roles });
          }
          helpers.setSubmitting(false);
        }}
      >
        {(formik) => (
          <Form className={styles.loginForm}>
            <img className={styles.formLogo} src={logo} alt="Logo" />
            <fieldset
              disabled={formik.isSubmitting}
              className={styles.inputContainer}
            >
              <div>
                <Field
                  name="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  className='formikField'
                />
              </div>
              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  className='formikField'
                />
              </div>
            </fieldset>
            <Boton type="submit" fullWidth disabled={formik.isSubmitting}>
              Iniciar sesión
            </Boton>
            <div className={styles.actionContainer}>
              <Link className={styles.link} to="/">Olvidé mi contraseña</Link>
              <hr />
              <div>
                <p>¿Querés inscribirte al instituto?</p>
                <p>
                  Completá el{" "}
                  <Link className={styles.link} to="/preinscripcion">Formulario de Preinscripción</Link>
                </p>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
