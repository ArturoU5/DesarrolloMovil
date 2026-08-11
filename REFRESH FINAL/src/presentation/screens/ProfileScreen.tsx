import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import Constants from 'expo-constants';
import { useAuth } from '../../infrastructure/context/AuthContext';
import { usePedidosProducto } from '../../infrastructure/context/PedidosProductoContext';
import { PedidoProducto, ESTADOS_PEDIDO_PRODUCTO } from '../../domain/models/PedidoProducto';
import { formatearFechaHora } from '../../shared/dateUtils';
import { COLORES } from '../../shared/constants';

/**
 * Pantalla informativa (perfil / acerca de), pedida por la rúbrica como
 * pantalla mínima. Además de los datos de contacto y la versión de la
 * app, muestra el historial de compras de productos del catálogo
 * (PedidoProducto), guardadas en SQLite:
 * - El cliente ve solo sus propias compras y puede cancelarlas si
 *   siguen pendientes.
 * - El personal ve todas las compras y puede marcarlas como
 *   entregadas o eliminarlas.
 */
export default function ProfileScreen() {
  const { auth, logout } = useAuth();
  const { pedidosProducto, actualizarPedidoProducto, eliminarPedidoProducto } =
    usePedidosProducto();

  const esAdmin = auth?.role === 'ADMIN';
  const nombreMostrado = auth?.role === 'CLIENTE' ? auth.nombre : 'Personal administrativo';
  const rolMostrado = esAdmin ? 'Administrador' : 'Cliente';

  const misCompras = esAdmin
    ? pedidosProducto
    : pedidosProducto.filter(
        (p) => auth?.role === 'CLIENTE' && p.clienteNombre === auth.nombre
      );

  const cancelarCompra = (pedido: PedidoProducto) => {
    Alert.alert('Cancelar compra', `¿Seguro que deseas cancelar "${pedido.productoTitulo}"?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: () =>
          actualizarPedidoProducto(pedido.id, { estado: ESTADOS_PEDIDO_PRODUCTO.CANCELADO }),
      },
    ]);
  };

  const marcarEntregado = (pedido: PedidoProducto) => {
    actualizarPedidoProducto(pedido.id, { estado: ESTADOS_PEDIDO_PRODUCTO.ENTREGADO });
  };

  const eliminarCompra = (pedido: PedidoProducto) => {
    Alert.alert('Eliminar compra', `¿Eliminar "${pedido.productoTitulo}" del historial?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => eliminarPedidoProducto(pedido.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarEmoji}>{esAdmin ? '🧑‍💼' : '🙋'}</Text>
        </View>
        <Text style={styles.nombre}>{nombreMostrado}</Text>
        <Text style={styles.rol}>{rolMostrado}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sobre RefreshProClean</Text>
          <InfoRow label="Rubro" value="Lavandería y limpieza de prendas" />
          <InfoRow label="Atención" value="Lunes a sábado, 8:00 a.m. - 7:00 p.m." />
          <InfoRow label="Contacto" value="contacto@refreshproclean.com" />
          <InfoRow label="Teléfono" value="987 654 321" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acerca de la app</Text>
          <InfoRow label="Versión" value={Constants.expoConfig?.version ?? '1.0.0'} />
          <InfoRow label="Almacenamiento" value="Local (SQLite en el dispositivo)" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {esAdmin ? `Compras registradas (${misCompras.length})` : `Mis compras (${misCompras.length})`}
          </Text>

          {misCompras.length === 0 ? (
            <Text style={styles.sinCompras}>Todavía no hay compras registradas.</Text>
          ) : (
            misCompras.map((pedido) => (
              <View key={pedido.id} style={styles.compraItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.compraTitulo} numberOfLines={1}>
                    {pedido.productoTitulo}
                  </Text>
                  <Text style={styles.compraDetalle}>
                    x{pedido.cantidad} · ${(pedido.precioUnitario * pedido.cantidad).toFixed(2)} ·{' '}
                    {formatearFechaHora(pedido.fechaRegistro)}
                  </Text>
                  {esAdmin && (
                    <Text style={styles.compraDetalle}>Cliente: {pedido.clienteNombre}</Text>
                  )}
                  <Text
                    style={[
                      styles.compraEstado,
                      pedido.estado === 'ENTREGADO' && { color: COLORES.exito },
                      pedido.estado === 'CANCELADO' && { color: COLORES.textoSecundario },
                    ]}
                  >
                    {pedido.estado}
                  </Text>
                </View>

                {esAdmin ? (
                  <View style={{ flexDirection: 'row' }}>
                    {pedido.estado === 'PENDIENTE' && (
                      <TouchableOpacity
                        style={styles.accionBoton}
                        onPress={() => marcarEntregado(pedido)}
                      >
                        <Text style={styles.accionBotonTexto}>Entregar</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.accionBoton, styles.accionBotonPeligro]}
                      onPress={() => eliminarCompra(pedido)}
                    >
                      <Text style={[styles.accionBotonTexto, { color: COLORES.peligro }]}>
                        Eliminar
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  pedido.estado === 'PENDIENTE' && (
                    <TouchableOpacity
                      style={[styles.accionBoton, styles.accionBotonPeligro]}
                      onPress={() => cancelarCompra(pedido)}
                    >
                      <Text style={[styles.accionBotonTexto, { color: COLORES.peligro }]}>
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.btnSalir} onPress={logout}>
          <Text style={styles.btnSalirTexto}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORES.fondo },
  scroll: { padding: 20, alignItems: 'center' },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORES.tarjeta,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  avatarEmoji: { fontSize: 34 },
  nombre: { fontSize: 18, fontWeight: '800', color: COLORES.texto },
  rol: { fontSize: 13, color: COLORES.textoSecundario, marginBottom: 20 },
  card: {
    width: '100%',
    backgroundColor: COLORES.tarjeta,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORES.texto, marginBottom: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoLabel: { fontSize: 13, color: COLORES.textoSecundario },
  infoValue: { fontSize: 13, color: COLORES.texto, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  sinCompras: { fontSize: 12.5, color: COLORES.textoSecundario },
  compraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
    paddingTop: 10,
    marginTop: 10,
  },
  compraTitulo: { fontSize: 13, fontWeight: '700', color: COLORES.texto },
  compraDetalle: { fontSize: 11, color: COLORES.textoSecundario, marginTop: 2 },
  compraEstado: { fontSize: 11, fontWeight: '700', color: COLORES.primarioOscuro, marginTop: 2 },
  accionBoton: {
    borderWidth: 1,
    borderColor: COLORES.primario,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 6,
  },
  accionBotonPeligro: { borderColor: COLORES.peligro },
  accionBotonTexto: { fontSize: 11, fontWeight: '700', color: COLORES.primario },
  btnSalir: {
    borderWidth: 1,
    borderColor: COLORES.peligro,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 8,
  },
  btnSalirTexto: { color: COLORES.peligro, fontWeight: '700' },
});
