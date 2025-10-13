/**
 * Utilidades para manejar estados de inscripciones de materias
 */

// Mapeo de estados del backend a labels amigables para el usuario
export const ESTADOS_INSCRIPCION = {
  Cursando: {
    label: 'Cursando',
    variant: 'info',
    description: 'Materia en curso'
  },
  Regularizada: {
    label: 'Regularizada',
    variant: 'success',
    description: 'Cursada aprobada, habilitado para final'
  },
  Aprobada: {
    label: 'Aprobada',
    variant: 'success',
    description: 'Materia aprobada completamente'
  },
  Desaprobada: {
    label: 'Desaprobada',
    variant: 'error',
    description: 'Cursada desaprobada'
  }
};

/**
 * Obtiene la información de display para un estado de inscripción
 * @param {string} estado - Estado de la inscripción
 * @returns {object} Información de display del estado
 */
export const getEstadoInfo = (estado) => {
  return ESTADOS_INSCRIPCION[estado] || {
    label: estado || 'Sin estado',
    variant: 'default',
    description: 'Estado no reconocido'
  };
};

/**
 * Determina si un estado permite inscripción a examen final
 * @param {string} estado - Estado de la inscripción
 * @returns {boolean} True si permite inscripción a final
 */
export const puedeInscribirseAFinal = (estado) => {
  return estado === 'Regularizada';
};

/**
 * Obtiene la clase CSS para un estado específico
 * @param {string} estado - Estado de la inscripción
 * @returns {string} Nombre de la clase CSS
 */
export const getEstadoClassName = (estado) => {
  const info = getEstadoInfo(estado);
  return `estado-${info.variant}`;
};

/**
 * Filtra estados que requieren atención del alumno
 * @param {string} estado - Estado de la inscripción
 * @returns {boolean} True si requiere atención
 */
export const requiereAtencion = (estado) => {
  return estado === 'Desaprobada' || estado === 'Cursando';
};

/**
 * Obtiene el mensaje de ayuda para un estado
 * @param {string} estado - Estado de la inscripción
 * @returns {string} Mensaje de ayuda
 */
export const getMensajeAyuda = (estado) => {
  switch (estado) {
    case 'Cursando':
      return 'Continúa asistiendo a clases y cumpliendo con las evaluaciones.';
    case 'Regularizada':
      return 'Ya puedes inscribirte al examen final de esta materia.';
    case 'Aprobada':
      return 'Materia completamente aprobada. ¡Felicidades!';
    case 'Desaprobada':
      return 'Debes recursar esta materia para poder aprobarla.';
    default:
      return 'Consulta con la secretaría académica sobre el estado de esta materia.';
  }
};