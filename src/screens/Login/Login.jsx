import React from "react";
import styles from "./Login.module.css";
import { useState } from "react";
import { toast } from "react-toastify";
import Boton from "../../components/Boton/Boton";
import logo from "../../assets/logo.png";
import api from "../../api/axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { validacionSchema } from "../../components/LoginForm/utils/validacionSchema";
import { useAuth } from "../../contexts/AuthContext";
import SelectorRol from "../../components/LoginForm/SelectorRol/SelectorRol";
import InputField from '../../components/FormCampos/InputField'

const Login = () => {
  const [seleccionandoRol, setSeleccionandoRol] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: validacionSchema,
    onSubmit: async (values, helpers) => {
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
          navigate("/");
        } catch (e) {
          toast.error("Error seleccionando rol");
        }
      } else {
        setSeleccionandoRol({ roles });
      }
      helpers.setSubmitting(false);
    },
  });

  const handleSeleccionarRol = async (rol) => {
    try {
      await api.post("/auth/seleccionar-rol", { rol });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al seleccionar rol");
    }
  };

  return (
    <div className={styles.container}>
      {seleccionandoRol && (
        <SelectorRol roles={seleccionandoRol.roles} onSelect={handleSeleccionarRol} />
      )}

      <form onSubmit={formik.handleSubmit} className={styles.loginForm}>
        <img className={styles.formLogo} src={logo} alt="Logo" />

        <fieldset disabled={formik.isSubmitting} className={styles.inputContainer}>
          <InputField
            name="username"
            type="text"
            placeholder="Ingresá tu nombre de usuario"
            formik={formik}
          />
          <InputField
            name="password"
            type="password"
            placeholder="Ingresá tu contraseña"
            formik={formik}
          />
        </fieldset>

        <Boton type='submit' fullWidth disabled={formik.isSubmitting}>
          Iniciar Sesión
        </Boton>

        <div className={styles.actionContainer}>
          <Link to="/">Olvidé mi contraseña</Link>
          <hr />
          <div>
            <p>¿Querés inscribirte al instituto?</p>
            <p>
              Completá el <Link to="/preinscripcion">Formulario de Preinscripción</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
