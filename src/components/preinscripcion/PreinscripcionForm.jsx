import React, { useState } from "react";
import { useFormik } from "formik";

import SeccionDatosPersonales from "./SeccionDatosPersonales";
import SeccionDatosDomicilio from "./SeccionDatosDomicilio";
import SeccionDatosAcademicos from "./SeccionDatosAcademicos";

import { schemaPreinscripcion } from "./utils/schemaPreinscripcion";
import "./estilos/PreinscripcionForm.css";
import Boton from "../Boton/Boton";
import PreinscripcionEnviada from "./PreinscripcionEnviada/PreinscripcionEnviada";

const PreinscripcionForm = () => {
  const [resultado, setResultado] = useState(null);

  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema: schemaPreinscripcion,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/preinscripcion`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        if (!res.ok) {
          const msg = await res.text();
          setResultado({
            exito: false,
            mensaje: msg || "No se pudo enviar la preinscripción.",
          });
          return;
        }

        const data = await res.json();
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
            "Ocurrió un error inesperado. Intentá nuevamente en unos minutos.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

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
      <form onSubmit={formik.handleSubmit} className="preinscripcionForm">
        <fieldset disabled={formik.isSubmitting}>
          <SeccionDatosPersonales formik={formik} />
          <SeccionDatosDomicilio formik={formik} />
          <SeccionDatosAcademicos formik={formik} />
        </fieldset>

        <div className="botonera">
          <Boton type="submit" fullWidth size="lg">
            Enviar preinscripción
          </Boton>
        </div>
      </form>
    </>
  );
};

export default PreinscripcionForm;
