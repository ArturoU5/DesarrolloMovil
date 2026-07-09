/**
 * Modelo Servicio
 * Basado en la tabla SQL "Servicios" (Id, Nombre, Descripcion, Precio, DuracionEstimada, Activo).
 */

/**
 * @typedef {Object} Servicio
 * @property {string} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {number} precio
 * @property {number} duracionEstimada - en minutos
 * @property {boolean} activo
 * @property {string} icono - emoji/ícono representativo del tipo de servicio
 */

export const crearServicio = ({
  id,
  nombre,
  descripcion,
  precio,
  duracionEstimada,
  activo = true,
  icono = '🧺',
}) => ({
  id,
  nombre,
  descripcion,
  precio,
  duracionEstimada,
  activo,
  icono,
});
