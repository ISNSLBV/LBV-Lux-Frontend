import React, { useState, useEffect } from "react";
import styles from "./ModalVerificacion.module.css";
import Boton from "../Boton/Boton";
import { CircularProgress } from "@mui/material";

const ModalVerificacion = ({
  isOpen,
  onClose,
  onVerify,
  onCancel,
  campo,
  nuevoValor,
  isLoading,
  isCancelling,
  timeRemaining,
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
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCodigo(value);
    setError("");
  };

  if (!isOpen) return null;

  const campoLabel = campo === "email" ? "correo electrónico" : "teléfono";

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
            Para confirmar los cambios, ingresá el código de confirmación que
            enviamos a tu dirección de email.
          </p>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="codigo">Código de confirmación</label>
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
                variant="primary"
                type="button"
                onClick={onClose}
                disabled={isLoading || isCancelling}
                fullWidth
              >
                Cerrar
              </Boton>
              <Boton
                variant="success"
                type="submit"
                disabled={isLoading || isCancelling || codigo.length !== 6}
                fullWidth
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Verificar"
                )}
              </Boton>
            </div>
          </form>

          {onCancel && (
            <div className={styles.cancelSection}>
              <p className={styles.cancelText}>
                ¿No podés acceder al código o cambiaste de opinión?
              </p>
              <Boton
                variant="cancel"
                type="button"
                onClick={onCancel}
                disabled={isLoading || isCancelling}
                fullWidth
              >
                {isCancelling ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Cancelar solicitud de cambio"
                )}
              </Boton>
            </div>
          )}

          <div className={styles.help}>
            <p>
              Si no solicitaste este cambio, cerrá esta ventana y cambiá tu
              contraseña inmediatamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerificacion;
