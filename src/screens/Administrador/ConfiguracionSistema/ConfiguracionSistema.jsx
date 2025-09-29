import React, { useState, useEffect } from 'react'
import styles from './ConfiguracionSistema.module.css'
import Boton from '../../../components/Boton/Boton'
import api from '../../../api/axios'
import BotonVolver from '../../../components/BotonVolver/BotonVolver'

const ConfiguracionSistema = () => {
    const [estadoPreinscripciones, setEstadoPreinscripciones] = useState(false)
    const [cargando, setCargando] = useState(true)
    const [mostrarModal, setMostrarModal] = useState(false)
    const [procesando, setProcesando] = useState(false)

    useEffect(() => {
        obtenerEstadoActual()
    }, [])

    const obtenerEstadoActual = async () => {
        try {
            setCargando(true)
            const response = await api.get('/preinscripcion/estado')
            setEstadoPreinscripciones(response.data.abierta === 1)
        } catch (error) {
            console.error('Error al obtener estado de preinscripciones:', error)
        } finally {
            setCargando(false)
        }
    }

    const manejarCambioEstado = () => {
        setMostrarModal(true)
    }

    const confirmarCambio = async () => {
        try {
            setProcesando(true)
            const response = await api.post('/preinscripcion/cambiar-estado')
            setEstadoPreinscripciones(response.data.abierta === 1)
            setMostrarModal(false)
        } catch (error) {
            console.error('Error al cambiar estado de preinscripciones:', error)
            alert('Error al cambiar el estado de las preinscripciones')
        } finally {
            setProcesando(false)
        }
    }

    const cancelarCambio = () => {
        setMostrarModal(false)
    }

    return (
        <div className={styles.container}>
            <BotonVolver />
            <h1>Configuración del sistema</h1>
            <div className={styles.listaConfiguraciones}>
                <div className={styles.opcionConfiguracion}>
                    <div className={styles.descripcionOpcion}>
                        <h3>Estado de preinscripciones</h3>
                        <p>Abrí o cerrá las preinscripciones a las carreras del instituto</p>
                    </div>
                    <div className={styles.controlOpcion}>
                        {cargando ? (
                            <span>Cargando...</span>
                        ) : (
                            <label className={styles.switch}>
                                <input 
                                    type="checkbox" 
                                    checked={estadoPreinscripciones}
                                    onChange={manejarCambioEstado}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        )}
                        <span className={styles.estadoTexto}>
                            {estadoPreinscripciones ? 'Abiertas' : 'Cerradas'}
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
                            ¿Estás seguro que deseas {estadoPreinscripciones ? 'cerrar' : 'abrir'} las preinscripciones?
                        </p>
                        <div className={styles.botonesModal}>
                            <Boton 
                                variant="secondary" 
                                onClick={cancelarCambio}
                                disabled={procesando}
                            >
                                Cancelar
                            </Boton>
                            <Boton 
                                onClick={confirmarCambio}
                                disabled={procesando}
                            >
                                {procesando ? 'Procesando...' : 'Confirmar'}
                            </Boton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ConfiguracionSistema