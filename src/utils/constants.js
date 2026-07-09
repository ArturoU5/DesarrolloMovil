import { ESTADOS, PRIORIDADES } from '../models/Solicitud';

export const COLORES = {
  primario: '#2E7DAF',
  primarioOscuro: '#1D5A80',
  fondo: '#F4F7FA',
  tarjeta: '#FFFFFF',
  texto: '#1C1C28',
  textoSecundario: '#6B7280',
  borde: '#E2E8F0',
  peligro: '#E24C4B',
  exito: '#2FA36B',
};

export const ESTADO_CONFIG = {
  [ESTADOS.PENDIENTE]: { label: 'Pendiente', color: '#F2A93B', bg: '#FEF3E2' },
  [ESTADOS.EN_ATENCION]: { label: 'En atención', color: '#2E7DAF', bg: '#E7F1F8' },
  [ESTADOS.FINALIZADO]: { label: 'Finalizado', color: '#2FA36B', bg: '#E7F6EE' },
};

export const PRIORIDAD_CONFIG = {
  [PRIORIDADES.ALTA]: { label: 'Alta', color: '#E24C4B', bg: '#FCEBEB' },
  [PRIORIDADES.MEDIA]: { label: 'Media', color: '#F2A93B', bg: '#FEF3E2' },
  [PRIORIDADES.BAJA]: { label: 'Baja', color: '#2FA36B', bg: '#E7F6EE' },
};

export const FILTROS_ESTADO = [
  { key: 'TODOS', label: 'Todos' },
  { key: ESTADOS.PENDIENTE, label: 'Pendiente' },
  { key: ESTADOS.EN_ATENCION, label: 'En atención' },
  { key: ESTADOS.FINALIZADO, label: 'Finalizado' },
];
