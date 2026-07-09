import { Estado, Prioridad } from '../domain/models/Solicitud';

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

interface EstadoConfigItem {
  label: string;
  color: string;
  bg: string;
}

export const ESTADO_CONFIG: Record<Estado, EstadoConfigItem> = {
  PENDIENTE: { label: 'Pendiente', color: '#F2A93B', bg: '#FEF3E2' },
  EN_ATENCION: { label: 'En atención', color: '#2E7DAF', bg: '#E7F1F8' },
  FINALIZADO: { label: 'Finalizado', color: '#2FA36B', bg: '#E7F6EE' },
};

export const PRIORIDAD_CONFIG: Record<Prioridad, EstadoConfigItem> = {
  ALTA: { label: 'Alta', color: '#E24C4B', bg: '#FCEBEB' },
  MEDIA: { label: 'Media', color: '#F2A93B', bg: '#FEF3E2' },
  BAJA: { label: 'Baja', color: '#2FA36B', bg: '#E7F6EE' },
};

export interface FiltroEstadoItem {
  key: 'TODOS' | Estado;
  label: string;
}

export const FILTROS_ESTADO: FiltroEstadoItem[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'PENDIENTE', label: 'Pendiente' },
  { key: 'EN_ATENCION', label: 'En atención' },
  { key: 'FINALIZADO', label: 'Finalizado' },
];
