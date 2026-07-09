/**
 * Modelo Servicio
 * Basado en la tabla SQL "Servicios" (Id, Nombre, Descripcion, Precio, DuracionEstimada, Activo).
 */

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionEstimada: number; // en minutos
  activo: boolean;
  icono: string; // emoji/ícono representativo del tipo de servicio
}

export interface CrearServicioParams {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionEstimada: number;
  activo?: boolean;
  icono?: string;
}

export const crearServicio = ({
  id,
  nombre,
  descripcion,
  precio,
  duracionEstimada,
  activo = true,
  icono = '🧺',
}: CrearServicioParams): Servicio => ({
  id,
  nombre,
  descripcion,
  precio,
  duracionEstimada,
  activo,
  icono,
});
