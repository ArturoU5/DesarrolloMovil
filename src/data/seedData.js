import { crearUsuario } from '../models/Usuario';
import { crearServicio } from '../models/Servicio';
import { crearSolicitud, ESTADOS, PRIORIDADES } from '../models/Solicitud';

/**
 * Data semilla, usada solo para simular la carga inicial (useEffect) y
 * el CRUD en memoria (useReducer + Context). No hay conexión real a
 * RefreshProCleanDB; los nombres de campos se tomaron de ese esquema SQL
 * como referencia del modelo de datos.
 */

export const USUARIOS_SEED = [
  crearUsuario({
    id: 'U1',
    nombre: 'Karen',
    apellido: 'Flores',
    correo: 'karen.flores@refreshproclean.com',
    telefono: '987654321',
    cargo: 'Recepcionista',
  }),
  crearUsuario({
    id: 'U2',
    nombre: 'Luis',
    apellido: 'Ramírez',
    correo: 'luis.ramirez@refreshproclean.com',
    telefono: '987654322',
    cargo: 'Operario',
  }),
  crearUsuario({
    id: 'U3',
    nombre: 'Ana',
    apellido: 'Torres',
    correo: 'ana.torres@refreshproclean.com',
    telefono: '987654323',
    cargo: 'Repartidor',
  }),
];

export const SERVICIOS_SEED = [
  crearServicio({
    id: 'S1',
    nombre: 'Lavado estándar',
    descripcion: 'Lavado y secado de ropa en general.',
    precio: 25,
    duracionEstimada: 90,
    icono: '🧺',
  }),
  crearServicio({
    id: 'S2',
    nombre: 'Lavado en seco',
    descripcion: 'Ideal para prendas delicadas o de vestir.',
    precio: 45,
    duracionEstimada: 120,
    icono: '🧥',
  }),
  crearServicio({
    id: 'S3',
    nombre: 'Planchado',
    descripcion: 'Planchado profesional de prendas.',
    precio: 15,
    duracionEstimada: 40,
    icono: '👔',
  }),
  crearServicio({
    id: 'S4',
    nombre: 'Lavado de edredones',
    descripcion: 'Lavado de edredones, cobertores y frazadas.',
    precio: 35,
    duracionEstimada: 100,
    icono: '🛏️',
  }),
];

export const SOLICITUDES_SEED = [
  crearSolicitud({
    id: 'R1',
    clienteNombre: 'María Gómez',
    telefono: '912345678',
    direccion: 'Av. Los Álamos 234, Chimbote',
    servicioId: 'S1',
    usuarioId: 'U2',
    prioridad: PRIORIDADES.MEDIA,
    descripcion: 'Bolsa grande de ropa de uso diario para lavar y secar.',
    estado: ESTADOS.PENDIENTE,
    fechaRegistro: new Date().toISOString(),
    fechaReserva: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
  }),
  crearSolicitud({
    id: 'R2',
    clienteNombre: 'Jorge Salinas',
    telefono: '923456789',
    direccion: 'Jr. Bolognesi 512, Chimbote',
    servicioId: 'S2',
    usuarioId: 'U2',
    prioridad: PRIORIDADES.ALTA,
    descripcion: 'Dos ternos para lavado en seco, se necesitan con urgencia.',
    estado: ESTADOS.EN_ATENCION,
    fechaRegistro: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    fechaReserva: new Date(Date.now() + 3600 * 1000 * 6).toISOString(),
  }),
  crearSolicitud({
    id: 'R3',
    clienteNombre: 'Rosa Ibáñez',
    telefono: '934567890',
    direccion: 'Calle Los Pinos 88, Chimbote',
    servicioId: 'S4',
    usuarioId: 'U3',
    prioridad: PRIORIDADES.BAJA,
    descripcion: 'Un edredón king size con manchas de humedad.',
    estado: ESTADOS.FINALIZADO,
    fechaRegistro: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    fechaReserva: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
  }),
];
