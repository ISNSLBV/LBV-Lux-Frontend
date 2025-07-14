import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import api from '../../api/axios';
import SeccionDatosPersonales from './SeccionDatosPersonales';
import SeccionDatosDomicilio from './SeccionDatosDomicilio';
import SeccionDatosAcademicos from './SeccionDatosAcademicos';
import { schemaPreinscripcion } from './utils/schemaPreinscripcion';
import './estilos/PreinscripcionForm.css'
import Boton from '../Boton/Boton';
import PreinscripcionEnviada from './PreinscripcionEnviada/PreinscripcionEnviada';

const PreinscripcionForm = () => {
  const [resultado, setResultado] = useState(null);
    const registrarPreinscripcion = useMutation({
    mutationFn: async () => {
      const res = await api.get('/preinscripcion');
      if (!res.ok) {
        throw new Error((await res.text()) || 'No se pudo enviar la preinscripción.');
      }
      return res.json();
    },
    onSuccess: () => {
      setResultado({
        exito: true,
        mensaje:
          'Preinscripción enviada con éxito. Te enviaremos un email con los pasos a seguir para completar tu inscripción.',
      });
    },
    onError: (err) => {
      setResultado({
        exito: false,
        mensaje:
          err.message || 'Ocurrió un error inesperado. Intentá nuevamente en unos minutos.',
      });
    },
  });
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
      telefono: '',
    },
    validationSchema: schemaPreinscripcion, // definido en utils/schemaPreinscripcion.js
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await registrarPreinscripcion.mutateAsync(values, {
        onSuccess: () => resetForm(),
      });
      setSubmitting(false);
    },
  });

  if (resultado) {
    return (
      <PreinscripcionEnviada exito={resultado.exito} mensaje={resultado.mensaje} />
    );
  }

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
