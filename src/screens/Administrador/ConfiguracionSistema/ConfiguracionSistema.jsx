import React, { useState, useEffect } from "react";
import styles from "./ConfiguracionSistema.module.css";
import Boton from "../../../components/Boton/Boton";
import api from "../../../api/axios";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";

const ConfiguracionSistema = () => {
  const [estadoPreinscripciones, setEstadoPreinscripciones] = useState(false);
  const [estadoInscripcionesMaterias, setEstadoInscripcionesMaterias] =
    useState(false);
  const [estadoInscripcionesFinales, setEstadoInscripcionesFinales] =
    useState(false);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoToggle, setTipoToggle] = useState(null); // 'preinscripciones', 'materias', 'finales'
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    obtenerEstadoActual();
  }, []);

  const obtenerEstadoActual = async () => {
    try {
      setCargando(true);
      const response = await api.get("/admin/configuracion");
      setEstadoPreinscripciones(response.data.preinscripciones_abiertas === 1);
      setEstadoInscripcionesMaterias(
        response.data.inscripciones_materias_abiertas === 1
      );
      setEstadoInscripcionesFinales(
        response.data.inscripciones_finales_abiertas === 1
      );
    } catch (error) {
      console.error("Error al obtener configuración del sistema:", error);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambioEstado = (tipo) => {
    setTipoToggle(tipo);
    setMostrarModal(true);
  };

  const confirmarCambio = async () => {
    try {
      setProcesando(true);
      let endpoint = "";

      switch (tipoToggle) {
        case "preinscripciones":
          endpoint = "/admin/configuracion/toggle-preinscripciones";
          break;
        case "materias":
          endpoint = "/admin/configuracion/toggle-inscripciones-materias";
          break;
        case "finales":
          endpoint = "/admin/configuracion/toggle-inscripciones-finales";
          break;
        default:
          return;
      }

      const response = await api.post(endpoint);

      // Actualizar el estado correspondiente
      switch (tipoToggle) {
        case "preinscripciones":
          setEstadoPreinscripciones(
            response.data.preinscripciones_abiertas === 1
          );
          break;
        case "materias":
          setEstadoInscripcionesMaterias(
            response.data.inscripciones_materias_abiertas === 1
          );
          break;
        case "finales":
          setEstadoInscripcionesFinales(
            response.data.inscripciones_finales_abiertas === 1
          );
          break;
      }

      setMostrarModal(false);
    } catch (error) {
      console.error("Error al cambiar configuración:", error);
      alert("Error al cambiar la configuración");
    } finally {
      setProcesando(false);
    }
  };

  const cancelarCambio = () => {
    setMostrarModal(false);
  };

  return (
    <>
      <BotonVolver />
      <h1>Configuración del sistema</h1>
      <div className={styles.listaConfiguraciones}>
        <div className={styles.opcionConfiguracion}>
          <div className={styles.descripcionOpcion}>
            <h3>Estado de preinscripciones</h3>
            <p>
              Abrí o cerrá las preinscripciones a las carreras del instituto
            </p>
          </div>
          <div className={styles.controlOpcion}>
            {cargando ? (
              <span>Cargando...</span>
            ) : (
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={estadoPreinscripciones}
                  onChange={() => manejarCambioEstado("preinscripciones")}
                />
                <span className={styles.slider}></span>
              </label>
            )}
            <span className={styles.estadoTexto}>
              {estadoPreinscripciones ? "Abiertas" : "Cerradas"}
            </span>
          </div>
        </div>

        <div className={styles.opcionConfiguracion}>
          <div className={styles.descripcionOpcion}>
            <h3>Inscripciones a materias</h3>
            <p>Abrí o cerrá las inscripciones de los alumnos a las materias</p>
          </div>
          <div className={styles.controlOpcion}>
            {cargando ? (
              <span>Cargando...</span>
            ) : (
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={estadoInscripcionesMaterias}
                  onChange={() => manejarCambioEstado("materias")}
                />
                <span className={styles.slider}></span>
              </label>
            )}
            <span className={styles.estadoTexto}>
              {estadoInscripcionesMaterias ? "Abiertas" : "Cerradas"}
            </span>
          </div>
        </div>

        <div className={styles.opcionConfiguracion}>
          <div className={styles.descripcionOpcion}>
            <h3>Inscripciones a exámenes finales</h3>
            <p>
              Abrí o cerrá las inscripciones de los alumnos a los exámenes
              finales
            </p>
          </div>
          <div className={styles.controlOpcion}>
            {cargando ? (
              <span>Cargando...</span>
            ) : (
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={estadoInscripcionesFinales}
                  onChange={() => manejarCambioEstado("finales")}
                />
                <span className={styles.slider}></span>
              </label>
            )}
            <span className={styles.estadoTexto}>
              {estadoInscripcionesFinales ? "Abiertas" : "Cerradas"}
            </span>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirmar cambio</h3>
            <p>
              ¿Estás seguro que deseas{" "}
              {(tipoToggle === "preinscripciones" && estadoPreinscripciones) ||
              (tipoToggle === "materias" && estadoInscripcionesMaterias) ||
              (tipoToggle === "finales" && estadoInscripcionesFinales)
                ? "cerrar"
                : "abrir"}{" "}
              {tipoToggle === "preinscripciones" && "las preinscripciones"}
              {tipoToggle === "materias" && "las inscripciones a materias"}
              {tipoToggle === "finales" &&
                "las inscripciones a exámenes finales"}
              ?
            </p>
            <div className={styles.botonesModal}>
              <Boton
                variant="cancel"
                onClick={cancelarCambio}
                disabled={procesando}
              >
                Cancelar
              </Boton>
              <Boton
                variant="success"
                onClick={confirmarCambio}
                disabled={procesando}
              >
                {procesando ? "Procesando..." : "Confirmar"}
              </Boton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfiguracionSistema;
