/**
 * Modelo Solicitud (equivalente al "pedido" de la rúbrica, adaptado al
 * negocio de lavandería). Persistido en SQLite
 * (ver infrastructure/database y infrastructure/repositories).
 *
 * Campos mínimos exigidos por la rúbrica y su equivalente aquí:
 *   id            -> id
 *   clienteNombre -> clienteNombre
 *   producto      -> servicioId (tipo de servicio de lavandería solicitado)
 *   cantidad      -> cantidadPrendas (cantidad de prendas/kilos a lavar)
 *   precio        -> precio (precio estimado del servicio)
 *   estado        -> estado
 *   fechaRegistro -> fechaRegistro
 */

export type Estado = 'PENDIENTE' | 'EN_ATENCION' | 'FINALIZADO' | 'CANCELADO';
export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';

export const ESTADOS: Record<'PENDIENTE' | 'EN_ATENCION' | 'FINALIZADO' | 'CANCELADO', Estado> = {
  PENDIENTE: 'PENDIENTE',
  EN_ATENCION: 'EN_ATENCION',
  FINALIZADO: 'FINALIZADO',
  CANCELADO: 'CANCELADO',
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
  servicioId: string | null; // referencia a Servicio.id ("producto" solicitado)
  usuarioId: string | null; // referencia a Usuario.id (empleado asignado)
  cantidadPrendas: number; // cantidad de prendas/kilos a lavar ("cantidad")
  precio: number; // precio estimado del servicio, en soles
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
  cantidadPrendas: number;
  precio: number;
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
  cantidadPrendas,
  precio,
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
  cantidadPrendas,
  precio,
  prioridad,
  descripcion,
  estado,
  fechaRegistro,
  fechaReserva,
});
