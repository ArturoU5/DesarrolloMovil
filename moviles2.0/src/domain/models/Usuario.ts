/**
 * Modelo Usuario (empleado de RefreshProClean)
 * Basado en la tabla SQL "Usuarios" (Id, Nombre, Apellido, Correo, Telefono, Cargo, Activo).
 * Se usa solo como estructura en memoria, no hay conexión a base de datos.
 */

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  cargo: string; // Ej: "Operario", "Recepcionista", "Repartidor"
  activo: boolean;
}

export interface CrearUsuarioParams {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  cargo: string;
  activo?: boolean;
}

export const crearUsuario = ({
  id,
  nombre,
  apellido,
  correo,
  telefono,
  cargo,
  activo = true,
}: CrearUsuarioParams): Usuario => ({
  id,
  nombre,
  apellido,
  correo,
  telefono,
  cargo,
  activo,
});
