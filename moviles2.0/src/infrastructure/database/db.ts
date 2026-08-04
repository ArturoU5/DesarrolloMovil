/**
 * Acceso a la base de datos local SQLite.
 *
 * Se usa expo-sqlite (API asíncrona moderna: openDatabaseAsync/execAsync/
 * runAsync/getAllAsync). Toda la app comparte una única conexión abierta
 * de forma perezosa (lazy) la primera vez que se necesita.
 *
 * La tabla `solicitudes` es la que da persistencia real: los datos
 * sobreviven a cerrar y reabrir la app, a diferencia de la versión
 * anterior que solo vivía en memoria (useState/useReducer).
 */
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'refreshproclean.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function crearEsquema(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS solicitudes (
      id TEXT PRIMARY KEY NOT NULL,
      clienteNombre TEXT NOT NULL,
      telefono TEXT NOT NULL,
      direccion TEXT NOT NULL,
      servicioId TEXT,
      usuarioId TEXT,
      cantidadPrendas INTEGER NOT NULL DEFAULT 1,
      precio REAL NOT NULL DEFAULT 0,
      prioridad TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      estado TEXT NOT NULL,
      fechaRegistro TEXT NOT NULL,
      fechaReserva TEXT
    );
  `);
}

/**
 * Devuelve la conexión (abriéndola y creando el esquema la primera vez).
 * Llamadas posteriores reutilizan la misma promesa/conexión.
 */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME).then(async (db) => {
      await crearEsquema(db);
      return db;
    });
  }
  return dbPromise;
}
