/**
 * Modelo Usuario (empleado de RefreshProClean)
 * Basado en la tabla SQL "Usuarios" (Id, Nombre, Apellido, Correo, Telefono, Cargo, Activo).
 * Se usa solo como estructura en memoria, no hay conexión a base de datos.
 */

/**
 * @typedef {Object} Usuario
 * @property {string} id
 * @property {string} nombre
 * @property {string} apellido
 * @property {string} correo
 * @property {string} telefono
 * @property {string} cargo      - Ej: "Operario", "Recepcionista", "Repartidor"
 * @property {boolean} activo
 */

export const crearUsuario = ({
  id,
  nombre,
  apellido,
  correo,
  telefono,
  cargo,
  activo = true,
}) => ({
  id,
  nombre,
  apellido,
  correo,
  telefono,
  cargo,
  activo,
});
