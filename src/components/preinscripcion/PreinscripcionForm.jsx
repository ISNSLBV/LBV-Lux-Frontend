import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useQuery, useMutation } from "@tanstack/react-query";
import SeccionDatosPersonales from "./SeccionDatosPersonales";
import SeccionDatosDomicilio from "./SeccionDatosDomicilio";
import SeccionDatosAcademicos from "./SeccionDatosAcademicos";
import { schemaPreinscripcion } from "./utils/schemaPreinscripcion";
import "./estilos/PreinscripcionForm.css";
import Boton from "../Boton/Boton";
import PreinscripcionEnviada from "./PreinscripcionEnviada/PreinscripcionEnviada";
import api from "../../api/axios";
import { CircularProgress } from "@mui/material";
import PreinscripcionCerrada from "./PreinscripcionCerrada/PreinscripcionCerrada";

const estadoPreinscripcion = async () => {
  const { data } = await api.get("/preinscripcion/estado");
  return data;
};

const PreinscripcionForm = () => {
  const [resultado, setResultado] = useState(null);

  const {
    data: estadoData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["estadoPreinscripcion"],
    queryFn: estadoPreinscripcion,
    staleTime: 60 * 60 * 1000, // 1 hora
    retry: 3,
    retryDelay: 1000,
  });

  const registrarPreinscripcion = useMutation({
    mutationFn: async (values) => {
      const res = await api.post(
        `${import.meta.env.VITE_API_URL}/preinscripcion`,
        values
      );
      return res.data;
    },
  });

  const initialValues = {
    numeroDocumento: "",
    nombre: "",
    apellido: "",
    sexo: "",
    fechaNacimiento: "",
    email: "",
    confirmarEmail: "",
    calle: "",
    altura: "",
    piso: "",
    departamento: "",
    codigoPostal: "",
    localidad: "",
    provincia: "",
    carrera: "",
    telefono: "",
    observaciones: "",
  };

  const handleRegistrar = async (values, { resetForm }) => {
    try {
      const data = await registrarPreinscripcion.mutateAsync(values);
      setResultado({
        exito: true,
        mensaje:
          data.message ||
          "Preinscripción enviada con éxito. Te enviaremos un email con los pasos a seguir para completar tu inscripción.",
        successData: {
          registrationNumber: data.registrationNumber,
          submissionDate: data.submissionDate,
          submissionTime: data.submissionTime,
          studentData: data.studentData,
        },
      });

      resetForm();
    } catch (err) {
      setResultado({
        exito: false,
        mensaje:
          err.message ||
          "Ocurrió un error inesperado. Intentá nuevamente en unos minutos.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mensaje">
        <CircularProgress />
      </div>
    );
  }

  // Mostrar error si no se pudo cargar el estado
  if (error) {
    return (
      <div className="mensaje">
        <p>
          Error al cargar el estado de las preinscripciones. Por favor, intentá
          más tarde.
        </p>
      </div>
    );
  }

  // Verificar si las preinscripciones están cerradas
  if (estadoData && estadoData.abierta === 0) {
    return (
      <PreinscripcionCerrada />
    );
  }

  if (resultado) {
    return (
      <PreinscripcionEnviada
        exito={resultado.exito}
        mensaje={resultado.mensaje}
        successData={resultado.successData}
      />
    );
  }

  return (
    <>
      <h1>Formulario de Preinscripción</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={schemaPreinscripcion}
        onSubmit={handleRegistrar}
      >
        {({ isSubmitting }) => (
          <Form className="preinscripcionForm">
            <fieldset disabled={isSubmitting}>
              <SeccionDatosPersonales />
              <SeccionDatosDomicilio />
              <SeccionDatosAcademicos />
            </fieldset>

            <div className="botonera">
              <Boton type="submit" fullWidth size="lg">
                Enviar preinscripción
              </Boton>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PreinscripcionForm;
