import React, { useState, useEffect } from "react";
import styles from "./ModalVerificacion.module.css";
import Boton from "../Boton/Boton";
import { CircularProgress } from "@mui/material";

const ModalVerificacion = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  campo, 
  nuevoValor, 
  isLoading,
  timeRemaining 
}) => {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(timeRemaining || 0);

  useEffect(() => {
    if (timeRemaining) {
      setCountdown(timeRemaining);
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (codigo.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }

    setError("");
    onVerify(codigo);
  };

  const handleCodigoChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCodigo(value);
    setError("");
  };

  if (!isOpen) return null;

  const campoLabel = campo === 'email' ? 'correo electrónico' : 'teléfono';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Verificación requerida</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.info}>
            Hemos enviado un código de verificación a tu {campoLabel} actual.
          </p>

          <div className={styles.changeInfo}>
            <strong>Nuevo {campoLabel}:</strong> {nuevoValor}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="codigo">Código de verificación</label>
              <input
                id="codigo"
                type="text"
                inputMode="numeric"
                value={codigo}
                onChange={handleCodigoChange}
                placeholder="000000"
                className={styles.codeInput}
                maxLength={6}
                autoFocus
              />
              {error && <div className={styles.error}>{error}</div>}
            </div>

            {countdown > 0 && (
              <div className={styles.countdown}>
                Código válido por: <strong>{formatTime(countdown)}</strong>
              </div>
            )}

            <div className={styles.actions}>
              <Boton
                variant="secondary"
                type="button"
                onClick={onClose}
                disabled={isLoading}
                fullWidth
              >
                Cancelar
              </Boton>
              <Boton
                variant="primary"
                type="submit"
                disabled={isLoading || codigo.length !== 6}
                fullWidth
              >
                {isLoading ? <CircularProgress size={20} color="inherit" /> : "Verificar"}
              </Boton>
            </div>
          </form>

          <div className={styles.help}>
            <p>
              ⚠️ Si no solicitaste este cambio, cierra esta ventana y 
              cambia tu contraseña inmediatamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerificacion;
