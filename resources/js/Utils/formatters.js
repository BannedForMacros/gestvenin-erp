/**
 * Formatea un número eliminando decimales innecesarios
 * @param {number|string} value - El valor a formatear
 * @param {number} maxDecimals - Máximo de decimales a mostrar (default: 2)
 * @returns {string} - Número formateado
 */
export function formatNumber(value, maxDecimals = 2) {
    if (!value || value === 0) return '0';
    
    const num = parseFloat(value);
    
    // Si es entero, devolver sin decimales
    if (num === Math.floor(num)) {
        return num.toString();
    }
    
    // Si tiene decimales, limitar a maxDecimals
    return num.toFixed(maxDecimals).replace(/\.?0+$/, '');
}

/**
 * Formatea un factor de conversión
 * Muestra enteros sin decimales, decimales con máximo 4 dígitos
 */
export function formatFactor(value) {
    if (!value || value === 0) return '0';
    
    const num = parseFloat(value);
    
    // Si es entero
    if (num === Math.floor(num)) {
        return num.toString();
    }
    
    // Si tiene decimales, máximo 4
    return num.toFixed(4).replace(/\.?0+$/, '');
}