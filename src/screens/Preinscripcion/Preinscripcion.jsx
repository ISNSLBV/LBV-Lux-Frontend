import React from 'react'
import Header from '../../components/Header/Header'
import styles from './Preinscripcion.module.css'
import PreinscripcionForm from '../../components/preinscripcion/PreinscripcionForm'
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

const preinscripcionSchema = Yup.object().shape({
  numeroDocumento: Yup.string()
    .matches(/^[0-9]{7,10}$/, 'Debe ser un número válido')
    .required('El número de D.N.I. es obligatorio'),
  nombre: Yup.string()
    .min(2, 'Mínimo 2 caracteres')
    .required('El nombre es obligatorio'),
  apellido: Yup.string()
    .min(2, 'Mínimo 2 caracteres')
    .required('El apellido es obligatorio'),
  sexo: Yup.string()
    .oneOf(['M', 'F', 'X'], 'Seleccioná una opción')
    .required('El sexo es obligatorio'),
  fechaNacimiento: Yup.date()
    .max(new Date(), 'La fecha debe ser anterior a hoy')
    .required('La fecha de nacimiento es obligatoria'),
  email: Yup.string()
    .email('Formato de email inválido')
    .required('El email es obligatorio'),
  confirmarEmail: Yup.string()
    .oneOf([Yup.ref('email')], 'Los emails no coinciden')
    .required('Confirmá tu dirección de email'),
  calle: Yup.string().required('La calle es obligatoria'),
  altura: Yup.string().required('La altura es obligatoria'),
  localidad: Yup.string().required('La localidad es obligatoria'),
  carrera: Yup.string().required('La carrera es obligatoria'),
  telefono: Yup.string()
    .matches(/^\d{7,11}$/, 'Número de teléfono inválido')
    .required('El número de teléfono es obligatorio'),
  observaciones: Yup.string()
    .max(70, 'Máximo 70 caracteres')
    .nullable(),
});


const Preinscripcion = () => {
  return (
    <>
        <Header />
        <main className={styles.container}>
          <PreinscripcionForm />
        </main>
    </>
  )
}

export default Preinscripcion