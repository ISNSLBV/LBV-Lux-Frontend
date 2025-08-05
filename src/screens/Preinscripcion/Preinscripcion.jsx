import React from "react";
import Header from "../../components/Header/Header";
import styles from "./Preinscripcion.module.css";
import PreinscripcionForm from "../../components/preinscripcion/PreinscripcionForm";

const Preinscripcion = () => {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <PreinscripcionForm />
      </main>
    </>
  );
};

export default Preinscripcion;
