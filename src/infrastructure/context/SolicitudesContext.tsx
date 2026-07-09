import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  ReactNode,
} from 'react';
import { SOLICITUDES_SEED, SERVICIOS_SEED, USUARIOS_SEED } from '../seedData';
import { Solicitud, ESTADOS, Estado } from '../../domain/models/Solicitud';
import { Servicio } from '../../domain/models/Servicio';
import { Usuario } from '../../domain/models/Usuario';

interface EstadoGlobal {
  solicitudes: Solicitud[];
  servicios: Servicio[];
  usuarios: Usuario[];
  cargando: boolean;
}

type Accion =
  | { type: 'CARGAR'; payload: Solicitud[] }
  | { type: 'CREAR'; payload: Solicitud }
  | { type: 'ACTUALIZAR'; payload: { id: string; cambios: Partial<Solicitud> } }
  | { type: 'ELIMINAR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const estadoInicial: EstadoGlobal = {
  solicitudes: [],
  servicios: SERVICIOS_SEED,
  usuarios: USUARIOS_SEED,
  cargando: true,
};

function solicitudesReducer(state: EstadoGlobal, action: Accion): EstadoGlobal {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, cargando: action.payload };

    case 'CARGAR':
      return { ...state, solicitudes: action.payload, cargando: false };

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
  crearSolicitud: (nuevaSolicitud: Solicitud) => void;
  actualizarSolicitud: (id: string, cambios: Partial<Solicitud>) => void;
  eliminarSolicitud: (id: string) => void;
  refrescar: () => void;
}

const SolicitudesContext = createContext<SolicitudesContextValue | null>(null);

export function SolicitudesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(solicitudesReducer, estadoInicial);

  // useEffect: simula la carga inicial de datos (como si viniera de un servicio remoto)
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const timeoutId = setTimeout(() => {
      dispatch({ type: 'CARGAR', payload: SOLICITUDES_SEED });
    }, 600); // pequeño delay simulado para mostrar loading

    return () => clearTimeout(timeoutId);
  }, []);

  const crearSolicitud = (nuevaSolicitud: Solicitud) => {
    dispatch({ type: 'CREAR', payload: nuevaSolicitud });
  };

  const actualizarSolicitud = (id: string, cambios: Partial<Solicitud>) => {
    dispatch({ type: 'ACTUALIZAR', payload: { id, cambios } });
  };

  const eliminarSolicitud = (id: string) => {
    dispatch({ type: 'ELIMINAR', payload: id });
  };

  const refrescar = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    setTimeout(() => {
      dispatch({ type: 'CARGAR', payload: state.solicitudes });
    }, 400);
  };

  const contarPorEstado = useMemo(() => {
    return state.solicitudes.reduce(
      (acc, s) => {
        acc[s.estado] = (acc[s.estado] || 0) + 1;
        return acc;
      },
      { [ESTADOS.PENDIENTE]: 0, [ESTADOS.EN_ATENCION]: 0, [ESTADOS.FINALIZADO]: 0 } as Record<
        Estado,
        number
      >
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
