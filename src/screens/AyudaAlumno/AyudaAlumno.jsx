import React from 'react'
import Header from '../../components/Header/Header'
import PreguntasFrecuentesDesplegable from "../../components/FAQ/PreguntasFrecuentesDesplegable";
import estilos from "./AyudaAlumno.module.css";

const AyudaAlumno = () => {
  return (
    <>
    <Header/>
    <main className={estilos.main}>
        <h1 className={estilos.titulo}>Ayuda para el Alumno</h1>
        <PreguntasFrecuentesDesplegable items={datosPreguntas} />
    </main>
    
    </>
  )
}

export default AyudaAlumno