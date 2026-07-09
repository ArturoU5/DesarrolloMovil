/**
 * Modelo Solicitud
 * Equivalente a la tabla SQL "Reservas", pero manejado 100% en memoria
 * (useState/useReducer/Context), tal como exige la rúbrica: "no es
 * obligatorio usar base de datos; la información debe manejarse en
 * memoria con useReducer + Context API".
 */

export type Estado = 'PENDIENTE' | 'EN_ATENCION' | 'FINALIZADO';
export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';

export const ESTADOS: Record<'PENDIENTE' | 'EN_ATENCION' | 'FINALIZADO', Estado> = {
  PENDIENTE: 'PENDIENTE',
  EN_ATENCION: 'EN_ATENCION',
  FINALIZADO: 'FINALIZADO',
};

export const PRIORIDADES: Record<'ALTA' | 'MEDIA' | 'BAJA', Prioridad> = {
  ALTA: 'ALTA',
  MEDIA: 'MEDIA',
  BAJA: 'BAJA',
};

export interface Solicitud {
  id: string;
  clienteNombre: string;
  telefono: string;
  direccion: string; // lugar de recojo/entrega (dato propio de Reservas)
  servicioId: string | null; // referencia a Servicio.id
  usuarioId: string | null; // referencia a Usuario.id (empleado asignado)
  prioridad: Prioridad;
  descripcion: string;
  estado: Estado;
  fechaRegistro: string; // ISO string
  fechaReserva?: string; // ISO string, fecha/hora programada de atención
}

export interface CrearSolicitudParams {
  id: string;
  clienteNombre: string;
  telefono: string;
  direccion: string;
  servicioId: string | null;
  usuarioId: string | null;
  prioridad?: Prioridad;
  descripcion: string;
  estado?: Estado;
  fechaRegistro?: string;
  fechaReserva?: string;
}

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
}: CrearSolicitudParams): Solicitud => ({
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
