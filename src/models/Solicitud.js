/**
 * Modelo Solicitud
 * Equivalente a la tabla SQL "Reservas", pero manejado 100% en memoria
 * (useState/useReducer/Context), tal como exige la rúbrica: "Proyecto React
 * Native ejecutable sin base de datos".
 *
 * Campos mínimos exigidos por la rúbrica (adaptados de mascotaNombre -> direccion,
 * ya que el caso de negocio es una lavandería y no una clínica veterinaria):
 */

/**
 * @typedef {Object} Solicitud
 * @property {string} id
 * @property {string} clienteNombre
 * @property {string} telefono
 * @property {string} direccion       - lugar de recojo/entrega (dato propio de Reservas)
 * @property {string} servicioId      - referencia a Servicio.id
 * @property {string} usuarioId       - referencia a Usuario.id (empleado asignado)
 * @property {'ALTA'|'MEDIA'|'BAJA'} prioridad
 * @property {string} descripcion
 * @property {'PENDIENTE'|'EN_ATENCION'|'FINALIZADO'} estado
 * @property {string} fechaRegistro   - ISO string
 * @property {string} fechaReserva    - ISO string, fecha/hora programada de atención
 */

export const ESTADOS = {
  PENDIENTE: 'PENDIENTE',
  EN_ATENCION: 'EN_ATENCION',
  FINALIZADO: 'FINALIZADO',
};

export const PRIORIDADES = {
  ALTA: 'ALTA',
  MEDIA: 'MEDIA',
  BAJA: 'BAJA',
};

export const crearSolicitud = ({
  id,
  clienteNombre,
  telefono,
  direccion,
  servicioId,
  usuarioId,
  prioridad = PRIORIDADES.MEDIA,
  descripcion,
  estado = ESTADOS.PENDIENTE,
  fechaRegistro = new Date().toISOString(),
  fechaReserva,
}) => ({
  id,
  clienteNombre,
  telefono,
  direccion,
  servicioId,
  usuarioId,
  prioridad,
  descripcion,
  estado,
  fechaRegistro,
  fechaReserva,
});
