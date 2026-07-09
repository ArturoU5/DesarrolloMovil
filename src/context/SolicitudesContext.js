import React, { createContext, useContext, useEffect, useReducer, useMemo } from 'react';
import { SOLICITUDES_SEED, SERVICIOS_SEED, USUARIOS_SEED } from '../data/seedData';
import { ESTADOS } from '../models/Solicitud';

const SolicitudesContext = createContext(null);

const ACCIONES = {
  CARGAR: 'CARGAR',
  CREAR: 'CREAR',
  ACTUALIZAR: 'ACTUALIZAR',
  ELIMINAR: 'ELIMINAR',
  SET_LOADING: 'SET_LOADING',
};

const estadoInicial = {
  solicitudes: [],
  servicios: SERVICIOS_SEED,
  usuarios: USUARIOS_SEED,
  cargando: true,
};

function solicitudesReducer(state, action) {
  switch (action.type) {
    case ACCIONES.SET_LOADING:
      return { ...state, cargando: action.payload };

    case ACCIONES.CARGAR:
      return { ...state, solicitudes: action.payload, cargando: false };

    case ACCIONES.CREAR:
      return { ...state, solicitudes: [action.payload, ...state.solicitudes] };

    case ACCIONES.ACTUALIZAR:
      return {
        ...state,
        solicitudes: state.solicitudes.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload.cambios } : s
        ),
      };

    case ACCIONES.ELIMINAR:
      return {
        ...state,
        solicitudes: state.solicitudes.filter((s) => s.id !== action.payload),
      };

    default:
      return state;
  }
}

export function SolicitudesProvider({ children }) {
  const [state, dispatch] = useReducer(solicitudesReducer, estadoInicial);

  // useEffect: simula la carga inicial de datos (como si viniera de un servicio remoto)
  useEffect(() => {
    dispatch({ type: ACCIONES.SET_LOADING, payload: true });
    const timeoutId = setTimeout(() => {
      dispatch({ type: ACCIONES.CARGAR, payload: SOLICITUDES_SEED });
    }, 600); // pequeño delay simulado para mostrar loading

    return () => clearTimeout(timeoutId);
  }, []);

  const crearSolicitud = (nuevaSolicitud) => {
    dispatch({ type: ACCIONES.CREAR, payload: nuevaSolicitud });
  };

  const actualizarSolicitud = (id, cambios) => {
    dispatch({ type: ACCIONES.ACTUALIZAR, payload: { id, cambios } });
  };

  const eliminarSolicitud = (id) => {
    dispatch({ type: ACCIONES.ELIMINAR, payload: id });
  };

  const refrescar = () => {
    dispatch({ type: ACCIONES.SET_LOADING, payload: true });
    setTimeout(() => {
      dispatch({ type: ACCIONES.CARGAR, payload: state.solicitudes });
    }, 400);
  };

  const contarPorEstado = useMemo(() => {
    return state.solicitudes.reduce(
      (acc, s) => {
        acc[s.estado] = (acc[s.estado] || 0) + 1;
        return acc;
      },
      { [ESTADOS.PENDIENTE]: 0, [ESTADOS.EN_ATENCION]: 0, [ESTADOS.FINALIZADO]: 0 }
    );
  }, [state.solicitudes]);

  const value = {
    ...state,
    contarPorEstado,
    crearSolicitud,
    actualizarSolicitud,
    eliminarSolicitud,
    refrescar,
  };

  return (
    <SolicitudesContext.Provider value={value}>
      {children}
    </SolicitudesContext.Provider>
  );
}

export function useSolicitudes() {
  const ctx = useContext(SolicitudesContext);
  if (!ctx) {
    throw new Error('useSolicitudes debe usarse dentro de <SolicitudesProvider>');
  }
  return ctx;
}
