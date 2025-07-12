import { useState, useEffect } from 'react';
import api from '../../api/axios';
import logo from '../../assets/logo.png';
import styles from './LoginForm.module.css';
import Boton from '../Boton/Boton';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { validacionSchema } from './utils/validacionSchema';
import InputField from '../FormCampos/InputField';
import SelectorRol from './SelectorRol/SelectorRol';

const LoginForm = () => {
  const [pending, setPending] = useState(null);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: validacionSchema,
    onSubmit: async (values, helpers) => {
      try {
        const { roles } = await api.post('/api/auth/login', values).then(r => r.data);

        if (!roles || roles.length === 0) {
          toast.error('Este usuario no tiene un rol asignado')
          return;
        }
        if (roles.length === 1) {
          await api.post('/api/auth/seleccionar-rol', { rol: roles[0] });
          window.location.href = '/';
        } else {
          setPending({ roles });
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error de red');
      } finally {
        helpers.setSubmitting(false);
      }
    }
  });

  const handleRoleSelect = async (rol) => {
    try {
      await api.post('/api/auth/seleccionar-rol', { rol });
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.message || 'Error al seleccionar rol');
    }
  };

  return (
    <>
      {pending && (
        <SelectorRol roles={pending.roles} onSelect={handleRoleSelect} />
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
    </>
  );
};

export default LoginForm;
