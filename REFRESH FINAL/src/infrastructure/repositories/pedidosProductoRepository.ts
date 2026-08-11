/**
 * Repositorio de PedidoProducto: mismo patrón que
 * solicitudesRepository.ts, pero para las compras de productos del
 * catálogo (ropa / cuidado de ropa).
 */
import { getDb } from '../database/db';
import { PedidoProducto } from '../../domain/models/PedidoProducto';

interface PedidoProductoRow {
  id: string;
  clienteNombre: string;
  telefono: string;
  productoId: number;
  productoTitulo: string;
  productoImagen: string;
  categoria: string;
  precioUnitario: number;
  cantidad: number;
  estado: string;
  fechaRegistro: string;
}

function filaAPedido(row: PedidoProductoRow): PedidoProducto {
  return {
    id: row.id,
    clienteNombre: row.clienteNombre,
    telefono: row.telefono,
    productoId: row.productoId,
    productoTitulo: row.productoTitulo,
    productoImagen: row.productoImagen,
    categoria: row.categoria,
    precioUnitario: row.precioUnitario,
    cantidad: row.cantidad,
    estado: row.estado as PedidoProducto['estado'],
    fechaRegistro: row.fechaRegistro,
  };
}

export async function obtenerTodos(): Promise<PedidoProducto[]> {
  const db = await getDb();
  const filas = await db.getAllAsync<PedidoProductoRow>(
    'SELECT * FROM pedidos_productos ORDER BY fechaRegistro DESC;'
  );
  return filas.map(filaAPedido);
}

export async function crear(pedido: PedidoProducto): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO pedidos_productos
      (id, clienteNombre, telefono, productoId, productoTitulo, productoImagen, categoria, precioUnitario, cantidad, estado, fechaRegistro)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      pedido.id,
      pedido.clienteNombre,
      pedido.telefono,
      pedido.productoId,
      pedido.productoTitulo,
      pedido.productoImagen,
      pedido.categoria,
      pedido.precioUnitario,
      pedido.cantidad,
      pedido.estado,
      pedido.fechaRegistro,
    ]
  );
}

export async function actualizar(id: string, cambios: Partial<PedidoProducto>): Promise<void> {
  const db = await getDb();
  const campos = Object.keys(cambios) as Array<keyof PedidoProducto>;
  if (campos.length === 0) return;

  const setClause = campos.map((campo) => `${campo} = ?`).join(', ');
  const valores = campos.map((campo) => {
    const valor = cambios[campo];
    return valor === undefined ? null : (valor as string | number | null);
  });

  await db.runAsync(`UPDATE pedidos_productos SET ${setClause} WHERE id = ?;`, [...valores, id]);
}

export async function eliminar(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM pedidos_productos WHERE id = ?;', [id]);
}
