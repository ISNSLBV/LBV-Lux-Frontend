import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import SeccionDatosPersonales from "./SeccionDatosPersonales";
import SeccionDatosDomicilio from "./SeccionDatosDomicilio";
import SeccionDatosAcademicos from "./SeccionDatosAcademicos";
import { schemaPreinscripcion } from "./utils/schemaPreinscripcion";
import "./estilos/PreinscripcionForm.css";
import Boton from "../Boton/Boton";
import PreinscripcionEnviada from "./PreinscripcionEnviada/PreinscripcionEnviada";
import api from "../../api/axios";

const PreinscripcionForm = () => {
  const [resultado, setResultado] = useState(null);

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
