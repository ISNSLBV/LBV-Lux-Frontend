import React from 'react'
import Header from '../../components/Header/Header'
import styles from './Preinscripcion.module.css'
import PreinscripcionForm from '../../components/preinscripcion/PreinscripcionForm'
import * as Yup from 'yup'

const Preinscripcion = () => {
  return (
    <>
        <Header />
        <main className={styles.container}>
          <h1>Formulario de Preinscripción</h1>
          <PreinscripcionForm />
        </main>
    </>
  )
}

export default Preinscripcion