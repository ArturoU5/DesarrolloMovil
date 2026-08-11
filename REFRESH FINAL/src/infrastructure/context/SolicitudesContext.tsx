import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import { SOLICITUDES_SEED, SERVICIOS_SEED, USUARIOS_SEED } from '../seedData';
import * as solicitudesRepo from '../repositories/solicitudesRepository';
import { Solicitud, ESTADOS, Estado } from '../../domain/models/Solicitud';
import { Servicio } from '../../domain/models/Servicio';
import { Usuario } from '../../domain/models/Usuario';

/**
 * Fuente de la verdad: SQLite (persiste entre reinicios de la app).
 * Este Context solo mantiene una "caché" en memoria (vía useReducer) que
 * se sincroniza con la base de datos en cada operación, para que la UI
 * no tenga que leer la base de datos en cada render.
 *
 * Flujo de arranque:
 * 1. Se abre/crea la base de datos (infrastructure/database/db.ts).
 * 2. Si la tabla está vacía (primera vez que se instala la app), se
 *    siembra con SOLICITUDES_SEED para que haya datos de ejemplo.
 * 3. Se cargan todas las solicitudes desde SQLite hacia el estado.
 *
 * A partir de ahí, crear/actualizar/eliminar escriben primero en SQLite
 * y luego reflejan el cambio en el estado en memoria.
 */

interface EstadoGlobal {
  solicitudes: Solicitud[];
  servicios: Servicio[];
  usuarios: Usuario[];
  cargando: boolean;
  error: string | null;
}

type Accion =
  | { type: 'CARGAR_OK'; payload: Solicitud[] }
  | { type: 'CARGAR_ERROR'; payload: string }
  | { type: 'CREAR'; payload: Solicitud }
  | { type: 'ACTUALIZAR'; payload: { id: string; cambios: Partial<Solicitud> } }
  | { type: 'ELIMINAR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const estadoInicial: EstadoGlobal = {
  solicitudes: [],
  servicios: SERVICIOS_SEED,
  usuarios: USUARIOS_SEED,
  cargando: true,
  error: null,
};

function solicitudesReducer(state: EstadoGlobal, action: Accion): EstadoGlobal {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, cargando: action.payload };

    case 'CARGAR_OK':
      return { ...state, solicitudes: action.payload, cargando: false, error: null };

    case 'CARGAR_ERROR':
      return { ...state, cargando: false, error: action.payload };

    case 'CREAR':
      return { ...state, solicitudes: [action.payload, ...state.solicitudes] };

    case 'ACTUALIZAR':
      return {
        ...state,
        solicitudes: state.solicitudes.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload.cambios } : s
        ),
      };

    case 'ELIMINAR':
      return {
        ...state,
        solicitudes: state.solicitudes.filter((s) => s.id !== action.payload),
      };

    default:
      return state;
  }
}

interface SolicitudesContextValue extends EstadoGlobal {
  contarPorEstado: Record<Estado, number>;
  crearSolicitud: (nuevaSolicitud: Solicitud) => Promise<void>;
  actualizarSolicitud: (id: string, cambios: Partial<Solicitud>) => Promise<void>;
  eliminarSolicitud: (id: string) => Promise<void>;
  refrescar: () => Promise<void>;
}

const SolicitudesContext = createContext<SolicitudesContextValue | null>(null);

export function SolicitudesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(solicitudesReducer, estadoInicial);

  const cargarDesdeDb = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const total = await solicitudesRepo.contarSolicitudes();
      if (total === 0) {
        // Primera vez que se abre la app: se siembra con datos de ejemplo.
        await solicitudesRepo.insertarVarias(SOLICITUDES_SEED);
      }
      const solicitudes = await solicitudesRepo.obtenerTodas();
      dispatch({ type: 'CARGAR_OK', payload: solicitudes });
    } catch (err) {
      dispatch({
        type: 'CARGAR_ERROR',
        payload: 'No se pudieron cargar las solicitudes guardadas en el dispositivo.',
      });
    }
  }, []);

  // Al montar la app: abre la base de datos SQLite y carga lo que haya
  // persistido de sesiones anteriores.
  useEffect(() => {
    cargarDesdeDb();
  }, [cargarDesdeDb]);

  const crearSolicitud = useCallback(async (nuevaSolicitud: Solicitud) => {
    await solicitudesRepo.crear(nuevaSolicitud);
    dispatch({ type: 'CREAR', payload: nuevaSolicitud });
  }, []);

  const actualizarSolicitud = useCallback(
    async (id: string, cambios: Partial<Solicitud>) => {
      await solicitudesRepo.actualizar(id, cambios);
      dispatch({ type: 'ACTUALIZAR', payload: { id, cambios } });
    },
    []
  );

  const eliminarSolicitud = useCallback(async (id: string) => {
    await solicitudesRepo.eliminar(id);
    dispatch({ type: 'ELIMINAR', payload: id });
  }, []);

  const refrescar = useCallback(async () => {
    await cargarDesdeDb();
  }, [cargarDesdeDb]);

  const contarPorEstado = useMemo(() => {
    return state.solicitudes.reduce(
      (acc, s) => {
        acc[s.estado] = (acc[s.estado] || 0) + 1;
        return acc;
      },
      {
        [ESTADOS.PENDIENTE]: 0,
        [ESTADOS.EN_ATENCION]: 0,
        [ESTADOS.FINALIZADO]: 0,
        [ESTADOS.CANCELADO]: 0,
      } as Record<Estado, number>
    );
  }, [state.solicitudes]);

  const value: SolicitudesContextValue = {
    ...state,
    contarPorEstado,
    crearSolicitud,
    actualizarSolicitud,
    eliminarSolicitud,
    refrescar,
  };

  return (
    <SolicitudesContext.Provider value={value}>{children}</SolicitudesContext.Provider>
  );
}

export function useSolicitudes(): SolicitudesContextValue {
  const ctx = useContext(SolicitudesContext);
  if (!ctx) {
    throw new Error('useSolicitudes debe usarse dentro de <SolicitudesProvider>');
  }
  return ctx;
}
