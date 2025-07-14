import React from 'react'
import PreguntasFrecuentesDesplegable from "../../components/FAQ/PreguntasFrecuentesDesplegable";
import estilos from "./AyudaAlumno.module.css";
import { datosPreguntas } from "../PreguntasFrecuentes/PreguntasFrecuentes";

const AyudaAlumno = () => {
  return (
    <>
      <h1 className={estilos.titulo}>Ayuda para el Alumno</h1>
      <PreguntasFrecuentesDesplegable items={datosPreguntas} />
    </>
  )
}

export default AyudaAlumno