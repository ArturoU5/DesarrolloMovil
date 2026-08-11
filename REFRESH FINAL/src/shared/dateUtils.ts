/**
 * Utilidad para formatear fechas siempre en la hora de Perú
 * (America/Lima, UTC-5), sin depender de Intl/toLocaleString ni de
 * cómo esté configurado el reloj/zona horaria del dispositivo o
 * emulador donde corre la app.
 *
 * Las fechas se guardan en SQLite como ISO string en UTC (estándar,
 * correcto). El problema era solo de VISUALIZACIÓN: motores JS de
 * algunos emuladores no aplican bien `timeZone` en `toLocaleString`
 * (a veces sin siquiera lanzar error), así que en vez de confiar en
 * eso, el desfase de -5 horas se calcula a mano.
 *
 * Formato de salida: "D/MM/AAAA, HH:mm" (24 horas), ej. "2/08/2026, 19:45".
 */

const OFFSET_LIMA_MINUTOS = -5 * 60; // Perú es UTC-5 todo el año (sin horario de verano)

function aFechaLima(fechaISO: string): Date {
  const fecha = new Date(fechaISO);
  // Se corre el reloj interno para que los getters "UTC" den directamente
  // la hora de Lima (truco estándar para no depender de Intl).
  return new Date(fecha.getTime() + OFFSET_LIMA_MINUTOS * 60 * 1000);
}

export function formatearFechaHora(fechaISO: string): string {
  const fechaLima = aFechaLima(fechaISO);
  const dd = fechaLima.getUTCDate(); // sin cero a la izquierda, ej. "2"
  const mm = String(fechaLima.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = fechaLima.getUTCFullYear();
  const hh = String(fechaLima.getUTCHours()).padStart(2, '0'); // 24 horas
  const min = String(fechaLima.getUTCMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy}, ${hh}:${min}`;
}

export function formatearFecha(fechaISO: string): string {
  const fechaLima = aFechaLima(fechaISO);
  const dd = fechaLima.getUTCDate();
  const mm = String(fechaLima.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = fechaLima.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
