/**
 * Utilidades para el manejo de fechas
 */

/**
 * Formatea una fecha tratándola como fecha local (sin conversión de zona horaria)
 * @param {string|Date} fecha - La fecha a formatear
 * @param {object} options - Opciones de formato para toLocaleDateString
 * @returns {string} Fecha formateada
 */
export const formatearFechaSinZonaHoraria = (fecha, options = {}) => {
  if (!fecha) return "Sin fecha asignada";
  
  try {
    // Extraer componentes de la fecha ISO string incluyendo hora
    const fechaStr = fecha.toString();
    const match = fechaStr.match(/(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2}))?/);
    
    if (match) {
      const [, year, month, day, hour = '00', minute = '00', second = '00'] = match;
      // Crear fecha local usando los componentes extraídos
      const fechaLocal = new Date(
        parseInt(year), 
        parseInt(month) - 1, 
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );
      
      const defaultOptions = {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric",
      };
      
      return fechaLocal.toLocaleString("es-ES", { ...defaultOptions, ...options });
    }
    
    // Fallback al método anterior si no es formato ISO
    const fechaObj = new Date(fecha);
    const defaultOptions = {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
    };
    
    return fechaObj.toLocaleString("es-ES", { ...defaultOptions, ...options });
  } catch (error) {
    return "Fecha inválida";
  }
};

/**
 * Convierte una fecha para input datetime-local tratándola como fecha local
 * @param {string|Date} fecha - La fecha a convertir
 * @returns {string} Fecha en formato para input
 */
export const formatearFechaParaInput = (fecha) => {
  if (!fecha) return "";
  
  try {
    // Extraer componentes de fecha ISO
    const fechaStr = fecha.toString();
    const match = fechaStr.match(/(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2}))?/);
    
    if (match) {
      const [, year, month, day, hour = '00', minute = '00'] = match;
      return `${year}-${month}-${day}T${hour}:${minute}`;
    }
    
    // Fallback - NO usar new Date() porque aplica zona horaria
    // Intentar parsear manualmente para evitar conversión UTC
    return "";
  } catch (error) {
    return "";
  }
};