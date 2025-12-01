/**
 * Utilidades para el manejo de fechas
 */

/**
 * Formatea una fecha en formato dd/mm/aaaa
 * @param {string|Date} fecha - La fecha a formatear
 * @returns {string} Fecha formateada como dd/mm/aaaa
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return "Sin fecha asignada";
  
  try {
    let day, month, year;
    
    // Si es string en formato ISO (YYYY-MM-DD o YYYY-MM-DDTHH:MM:SS)
    if (typeof fecha === 'string') {
      const match = fecha.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        [, year, month, day] = match;
        return `${day}/${month}/${year}`;
      }
    }
    
    // Si es objeto Date
    const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
    day = String(fechaObj.getDate()).padStart(2, '0');
    month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    year = fechaObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "Fecha inválida";
  }
};

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
      
      // Si no hay opciones personalizadas, usar formato dd/mm/aaaa directo
      if (Object.keys(options).length === 0) {
        return `${day}/${month}/${year}`;
      }
      
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
      
      // Forzar locale es-AR para formato dd/mm/aaaa
      return fechaLocal.toLocaleString("es-AR", { ...defaultOptions, ...options });
    }
    
    // Fallback - formato manual dd/mm/aaaa
    const fechaObj = new Date(fecha);
    const day = String(fechaObj.getDate()).padStart(2, '0');
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const year = fechaObj.getFullYear();
    
    return `${day}/${month}/${year}`;
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