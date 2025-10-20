import React, { useState } from 'react'
import styles from './ModalRechazar.module.css'

const ModalRechazar = ({ isOpen, onClose, onConfirm, solicitud }) => {
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!motivoRechazo.trim()) {
      setError('Debe indicar el motivo del rechazo')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      await onConfirm(motivoRechazo)
      handleClose()
    } catch (err) {
      setError(err.message || 'Error al rechazar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setMotivoRechazo('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Rechazar Solicitud de Equivalencia</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.alumnoInfo}>
            <p><strong>Alumno:</strong> {solicitud?.alumno?.persona?.apellido}, {solicitud?.alumno?.persona?.nombre}</p>
            <p><strong>Materia:</strong> {solicitud?.origen_materia}</p>
            <p><strong>Institución:</strong> {solicitud?.origen_institucion}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="motivoRechazo">
                Motivo del Rechazo <span className={styles.required}>*</span>
              </label>
              <textarea
                id="motivoRechazo"
                className={styles.textarea}
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                placeholder="Indique el motivo por el cual se rechaza esta solicitud..."
                rows="5"
                disabled={loading}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnCancelar}
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.btnRechazar}
                disabled={loading}
              >
                {loading ? 'Rechazando...' : 'Confirmar Rechazo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalRechazar
