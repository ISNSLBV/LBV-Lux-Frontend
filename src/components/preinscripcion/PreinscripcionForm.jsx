// components/preinscripcion/PreinscripcionForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import SeccionDatosPersonales from './SeccionDatosPersonales';
import SeccionDatosDomicilio from './SeccionDatosDomicilio';
import SeccionDatosAcademicos from './SeccionDatosAcademicos';

import { schemaPreinscripcion } from './utils/schemaPreinscripcion';
import './estilos/PreinscripcionForm.css'
import Boton from '../Boton/Boton';

const PreinscripcionForm = () => {
  const formik = useFormik({
    initialValues: {
      numeroDocumento: '',
      nombre: '',
      apellido: '',
      sexo: '',
      fechaNacimiento: '',
      email: '',
      confirmarEmail: '',
      calle: '',
      altura: '',
      piso: '',
      departamento: '',
      codigoPostal: '',
      localidad: '',
      provincia: '',
      carrera: '',
    },
    validationSchema: schemaPreinscripcion, // definido en utils/schemaPreinscripcion.js
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/preinscripcion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        alert(`Preinscripción OK. ID Persona: ${data.personaId}`);
        resetForm();
      } catch (err) {
        console.error(err);
        alert('Error al enviar la preinscripción');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="preinscripcionForm">
      <fieldset disabled={formik.isSubmitting}>
        <SeccionDatosPersonales formik={formik} />
        <SeccionDatosDomicilio formik={formik} />
        <SeccionDatosAcademicos formik={formik} />
      </fieldset>

      <div className="botonera">
        <Boton type='submit' fullWidth size='lg'>
          Enviar preinscripción
        </Boton>
      </div>
    </form>
  );
};

export default PreinscripcionForm;
