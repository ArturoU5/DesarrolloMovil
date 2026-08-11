import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import * as pedidosProductoRepo from '../repositories/pedidosProductoRepository';
import { PedidoProducto } from '../../domain/models/PedidoProducto';

/**
 * Mismo patrón que SolicitudesContext: la fuente de la verdad es
 * SQLite; este Context mantiene una caché en memoria (useReducer)
 * sincronizada con la base de datos en cada operación.
 */

interface EstadoGlobal {
  pedidosProducto: PedidoProducto[];
  cargando: boolean;
  error: string | null;
}

type Accion =
  | { type: 'CARGAR_OK'; payload: PedidoProducto[] }
  | { type: 'CARGAR_ERROR'; payload: string }
  | { type: 'CREAR'; payload: PedidoProducto }
  | { type: 'ACTUALIZAR'; payload: { id: string; cambios: Partial<PedidoProducto> } }
  | { type: 'ELIMINAR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const estadoInicial: EstadoGlobal = {
  pedidosProducto: [],
  cargando: true,
  error: null,
};

function reducer(state: EstadoGlobal, action: Accion): EstadoGlobal {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, cargando: action.payload };
    case 'CARGAR_OK':
      return { ...state, pedidosProducto: action.payload, cargando: false, error: null };
    case 'CARGAR_ERROR':
      return { ...state, cargando: false, error: action.payload };
    case 'CREAR':
      return { ...state, pedidosProducto: [action.payload, ...state.pedidosProducto] };
    case 'ACTUALIZAR':
      return {
        ...state,
        pedidosProducto: state.pedidosProducto.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.cambios } : p
        ),
      };
    case 'ELIMINAR':
      return {
        ...state,
        pedidosProducto: state.pedidosProducto.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

interface PedidosProductoContextValue extends EstadoGlobal {
  crearPedidoProducto: (pedido: PedidoProducto) => Promise<void>;
  actualizarPedidoProducto: (id: string, cambios: Partial<PedidoProducto>) => Promise<void>;
  eliminarPedidoProducto: (id: string) => Promise<void>;
  refrescar: () => Promise<void>;
}

const PedidosProductoContext = createContext<PedidosProductoContextValue | null>(null);

export function PedidosProductoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, estadoInicial);

  const cargarDesdeDb = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const pedidos = await pedidosProductoRepo.obtenerTodos();
      dispatch({ type: 'CARGAR_OK', payload: pedidos });
    } catch (err) {
      dispatch({
        type: 'CARGAR_ERROR',
        payload: 'No se pudieron cargar tus compras guardadas en el dispositivo.',
      });
    }
  }, []);

  useEffect(() => {
    cargarDesdeDb();
  }, [cargarDesdeDb]);

  const crearPedidoProducto = useCallback(async (pedido: PedidoProducto) => {
    await pedidosProductoRepo.crear(pedido);
    dispatch({ type: 'CREAR', payload: pedido });
  }, []);

  const actualizarPedidoProducto = useCallback(
    async (id: string, cambios: Partial<PedidoProducto>) => {
      await pedidosProductoRepo.actualizar(id, cambios);
      dispatch({ type: 'ACTUALIZAR', payload: { id, cambios } });
    },
    []
  );

  const eliminarPedidoProducto = useCallback(async (id: string) => {
    await pedidosProductoRepo.eliminar(id);
    dispatch({ type: 'ELIMINAR', payload: id });
  }, []);

  const refrescar = useCallback(async () => {
    await cargarDesdeDb();
  }, [cargarDesdeDb]);

  const value: PedidosProductoContextValue = {
    ...state,
    crearPedidoProducto,
    actualizarPedidoProducto,
    eliminarPedidoProducto,
    refrescar,
  };

  return (
    <PedidosProductoContext.Provider value={value}>{children}</PedidosProductoContext.Provider>
  );
}

export function usePedidosProducto(): PedidosProductoContextValue {
  const ctx = useContext(PedidosProductoContext);
  if (!ctx) {
    throw new Error('usePedidosProducto debe usarse dentro de <PedidosProductoProvider>');
  }
  return ctx;
}
