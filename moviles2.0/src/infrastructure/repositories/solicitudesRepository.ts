/**
 * Repositorio de Solicitudes: encapsula todo el SQL. El resto de la app
 * (Context, pantallas) nunca escribe SQL directamente, solo llama a estas
 * funciones. Así, si el día de mañana se cambia de motor de persistencia,
 * solo se toca este archivo.
 */
import { getDb } from '../database/db';
import { Solicitud } from '../../domain/models/Solicitud';

// Fila cruda tal como viene de SQLite (fechaReserva puede ser null en vez de undefined)
interface SolicitudRow {
  id: string;
  clienteNombre: string;
  telefono: string;
  direccion: string;
  servicioId: string | null;
  usuarioId: string | null;
  cantidadPrendas: number;
  precio: number;
  prioridad: string;
  descripcion: string;
  estado: string;
  fechaRegistro: string;
  fechaReserva: string | null;
}

function filaASolicitud(row: SolicitudRow): Solicitud {
  return {
    id: row.id,
    clienteNombre: row.clienteNombre,
    telefono: row.telefono,
    direccion: row.direccion,
    servicioId: row.servicioId,
    usuarioId: row.usuarioId,
    cantidadPrendas: row.cantidadPrendas,
    precio: row.precio,
    prioridad: row.prioridad as Solicitud['prioridad'],
    descripcion: row.descripcion,
    estado: row.estado as Solicitud['estado'],
    fechaRegistro: row.fechaRegistro,
    fechaReserva: row.fechaReserva ?? undefined,
  };
}

/** Cuenta cuántas filas hay en la tabla (para decidir si hay que sembrar datos demo). */
export async function contarSolicitudes(): Promise<number> {
  const db = await getDb();
  const fila = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) as total FROM solicitudes;'
  );
  return fila?.total ?? 0;
}

/** Inserta varias solicitudes de una sola vez (usado solo para la siembra inicial). */
export async function insertarVarias(solicitudes: Solicitud[]): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const s of solicitudes) {
      await db.runAsync(
        `INSERT OR REPLACE INTO solicitudes
          (id, clienteNombre, telefono, direccion, servicioId, usuarioId, cantidadPrendas, precio, prioridad, descripcion, estado, fechaRegistro, fechaReserva)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          s.id,
          s.clienteNombre,
          s.telefono,
          s.direccion,
          s.servicioId,
          s.usuarioId,
          s.cantidadPrendas,
          s.precio,
          s.prioridad,
          s.descripcion,
          s.estado,
          s.fechaRegistro,
          s.fechaReserva ?? null,
        ]
      );
    }
  });
}

/** Devuelve todas las solicitudes ordenadas de la más reciente a la más antigua. */
export async function obtenerTodas(): Promise<Solicitud[]> {
  const db = await getDb();
  const filas = await db.getAllAsync<SolicitudRow>(
    'SELECT * FROM solicitudes ORDER BY fechaRegistro DESC;'
  );
  return filas.map(filaASolicitud);
}

/** Inserta una nueva solicitud. */
export async function crear(solicitud: Solicitud): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO solicitudes
      (id, clienteNombre, telefono, direccion, servicioId, usuarioId, cantidadPrendas, precio, prioridad, descripcion, estado, fechaRegistro, fechaReserva)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      solicitud.id,
      solicitud.clienteNombre,
      solicitud.telefono,
      solicitud.direccion,
      solicitud.servicioId,
      solicitud.usuarioId,
      solicitud.cantidadPrendas,
      solicitud.precio,
      solicitud.prioridad,
      solicitud.descripcion,
      solicitud.estado,
      solicitud.fechaRegistro,
      solicitud.fechaReserva ?? null,
    ]
  );
}

/** Actualiza campos puntuales de una solicitud existente (update parcial). */
export async function actualizar(id: string, cambios: Partial<Solicitud>): Promise<void> {
  const db = await getDb();
  const campos = Object.keys(cambios) as Array<keyof Solicitud>;
  if (campos.length === 0) return;

  const setClause = campos.map((campo) => `${campo} = ?`).join(', ');
  const valores = campos.map((campo) => {
    const valor = cambios[campo];
    return valor === undefined ? null : (valor as string | number | null);
  });

  await db.runAsync(`UPDATE solicitudes SET ${setClause} WHERE id = ?;`, [...valores, id]);
}

/** Elimina una solicitud de forma permanente. */
export async function eliminar(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM solicitudes WHERE id = ?;', [id]);
}
