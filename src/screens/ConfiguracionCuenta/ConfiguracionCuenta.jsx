import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "./ConfiguracionCuenta.module.css";
import Boton from "../../components/Boton/Boton";
import ModalVerificacion from "../../components/ModalVerificacion/ModalVerificacion";
import * as Yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import BotonVolver from "../../components/BotonVolver/BotonVolver";

const ConfiguracionCuenta = () => {
  const { user } = useAuth();
  const idUsuario = user.id;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Estados para el modal de verificación
  const [modalOpen, setModalOpen] = useState(false);
  const [campoAVerificar, setCampoAVerificar] = useState(null);
  const [nuevoValorPendiente, setNuevoValorPendiente] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);

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

  // Query para verificar si hay verificaciones pendientes
  const { data: verificacionesPendientes } = useQuery({
    queryKey: ["verificacionesPendientes", idUsuario],
    queryFn: async () => {
      const { data } = await api.get(`/usuario/${idUsuario}/verificaciones-pendientes`);
      return data.pendientes;
    },
    refetchOnMount: true,
  });

  // Efecto para restaurar el modal si hay verificaciones pendientes
  useEffect(() => {
    if (verificacionesPendientes) {
      // Verificar si hay alguna verificación pendiente para email o teléfono
      if (verificacionesPendientes.email) {
        setCampoAVerificar('email');
        setNuevoValorPendiente(verificacionesPendientes.email.newValue);
        setTimeRemaining(verificacionesPendientes.email.timeRemaining);
        setModalOpen(true);
      } else if (verificacionesPendientes.telefono) {
        setCampoAVerificar('telefono');
        setNuevoValorPendiente(verificacionesPendientes.telefono.newValue);
        setTimeRemaining(verificacionesPendientes.telefono.timeRemaining);
        setModalOpen(true);
      }
    }
  }, [verificacionesPendientes]);

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

  // Mutación para solicitar cambio de dato
  const solicitarCambio = useMutation({
    mutationFn: ({ campo, nuevoValor }) =>
      api.post(`/usuario/${idUsuario}/solicitar-cambio-dato`, {
        campo,
        nuevoValor,
      }),
    onSuccess: (response, variables) => {
      const expiresIn = response.data.expiresIn || 900; // 15 minutos por defecto
      setTimeRemaining(expiresIn);
      setCampoAVerificar(variables.campo);
      setNuevoValorPendiente(variables.nuevoValor);
      setModalOpen(true);
      toast.success(response.data.message);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Error al solicitar cambio";
      toast.error(message);
    },
  });

  // Mutación para verificar el código
  const verificarCambio = useMutation({
    mutationFn: ({ campo, codigo }) =>
      api.post(`/usuario/${idUsuario}/verificar-cambio-dato`, {
        campo,
        codigo,
      }),
    onSuccess: (response) => {
      setModalOpen(false);
      setCampoAVerificar(null);
      setNuevoValorPendiente("");
      queryClient.invalidateQueries({
        queryKey: ["datosPersonales", idUsuario],
      });
      queryClient.invalidateQueries({
        queryKey: ["verificacionesPendientes", idUsuario],
      });
      toast.success(response.data.message);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Código inválido o expirado";
      toast.error(message);
    },
  });

  // Mutación para cancelar cambio pendiente
  const cancelarCambio = useMutation({
    mutationFn: (campo) =>
      api.post(`/usuario/${idUsuario}/cancelar-cambio-dato`, {
        campo,
      }),
    onSuccess: () => {
      setModalOpen(false);
      setCampoAVerificar(null);
      setNuevoValorPendiente("");
      setTimeRemaining(0);
      queryClient.invalidateQueries({
        queryKey: ["verificacionesPendientes", idUsuario],
      });
      toast.success("Solicitud de cambio cancelada");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Error al cancelar cambio";
      toast.error(message);
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

  // Manejar el envío del formulario de datos personales
  const handlePersonalDataSubmit = (values, actions) => {
    const emailChanged = values.email !== datosPersonales?.email;
    const telefonoChanged = values.telefono !== datosPersonales?.telefono;

    if (emailChanged) {
      solicitarCambio.mutate({ campo: "email", nuevoValor: values.email });
      actions.setSubmitting(false);
    } else if (telefonoChanged) {
      solicitarCambio.mutate({ campo: "telefono", nuevoValor: values.telefono });
      actions.setSubmitting(false);
    } else {
      toast.info("No hay cambios para guardar");
      actions.setSubmitting(false);
    }
  };

  // Manejar la verificación del código
  const handleVerificarCodigo = (codigo) => {
    verificarCambio.mutate({ campo: campoAVerificar, codigo });
  };

  // Manejar la cancelación de la verificación
  const handleCancelarVerificacion = () => {
    if (campoAVerificar) {
      cancelarCambio.mutate(campoAVerificar);
    }
  };

  return (
    <>
      <BotonVolver />
      <h1 className={styles.title}>Configuración de Cuenta</h1>
      
      {/* Modal de verificación */}
      <ModalVerificacion
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onVerify={handleVerificarCodigo}
        onCancel={handleCancelarVerificacion}
        campo={campoAVerificar}
        nuevoValor={nuevoValorPendiente}
        isLoading={verificarCambio.isPending}
        isCancelling={cancelarCambio.isPending}
        timeRemaining={timeRemaining}
      />

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
              onSubmit={handlePersonalDataSubmit}
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
                  <div className={styles.infoBox}>
                    Al cambiar tu email o teléfono, vas a recibir un código de 
                    confirmación.
                  </div>
                  <Boton
                    variant="primary"
                    type="submit"
                    size="md"
                    fullWidth
                    disabled={isSubmitting || solicitarCambio.isPending}
                  >
                    {solicitarCambio.isPending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Guardar cambios"
                    )}
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
    </>
  );
};

export default ConfiguracionCuenta;
