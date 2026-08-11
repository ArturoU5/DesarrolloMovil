/**
 * Modelo PedidoProducto: representa la compra de un producto del
 * catálogo (ropa o insumos de cuidado de ropa), a diferencia de
 * Solicitud, que representa un servicio de lavandería (lavado,
 * planchado, etc.).
 *
 * Se persiste en SQLite igual que Solicitud (ver
 * infrastructure/database y infrastructure/repositories).
 */

export type EstadoPedidoProducto = 'PENDIENTE' | 'ENTREGADO' | 'CANCELADO';

export const ESTADOS_PEDIDO_PRODUCTO: Record<EstadoPedidoProducto, EstadoPedidoProducto> = {
  PENDIENTE: 'PENDIENTE',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
};

export interface PedidoProducto {
  id: string;
  clienteNombre: string;
  telefono: string;
  productoId: number;
  productoTitulo: string;
  productoImagen: string;
  categoria: string;
  precioUnitario: number;
  cantidad: number;
  estado: EstadoPedidoProducto;
  fechaRegistro: string; // ISO string
}

export interface CrearPedidoProductoParams {
  id: string;
  clienteNombre: string;
  telefono: string;
  productoId: number;
  productoTitulo: string;
  productoImagen: string;
  categoria: string;
  precioUnitario: number;
  cantidad: number;
  estado?: EstadoPedidoProducto;
  fechaRegistro?: string;
}

export const crearPedidoProducto = ({
  id,
  clienteNombre,
  telefono,
  productoId,
  productoTitulo,
  productoImagen,
  categoria,
  precioUnitario,
  cantidad,
  estado = ESTADOS_PEDIDO_PRODUCTO.PENDIENTE,
  fechaRegistro = new Date().toISOString(),
}: CrearPedidoProductoParams): PedidoProducto => ({
  id,
  clienteNombre,
  telefono,
  productoId,
  productoTitulo,
  productoImagen,
  categoria,
  precioUnitario,
  cantidad,
  estado,
  fechaRegistro,
});
