import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { obtenerCatalogo, ProductoCatalogo } from '../../infrastructure/api/catalogoApi';
import { useSolicitudes } from '../../infrastructure/context/SolicitudesContext';
import { usePedidosProducto } from '../../infrastructure/context/PedidosProductoContext';
import { useAuth } from '../../infrastructure/context/AuthContext';
import { crearPedidoProducto } from '../../domain/models/PedidoProducto';
import { COLORES } from '../../shared/constants';
import type { AdminStackParamList, ClienteStackParamList } from '../navigation/types';

/**
 * Catálogo de RefreshProClean, con dos secciones:
 *
 * 1) SERVICIOS (lavado, planchado, promociones...): datos locales
 *    (ya definidos en Servicio/seedData). Botón "Solicitar" navega a
 *    la pantalla Crear con ese servicio ya preseleccionado -> crea
 *    una Solicitud real en SQLite (reutiliza el CRUD que ya existía).
 *
 * 2) PRODUCTOS (ropa + cuidado de ropa): se cargan con un GET real a
 *    una API REST pública (con loading/error, como pide la rúbrica),
 *    y el botón "Comprar" guarda un nuevo PedidoProducto en SQLite
 *    (tabla independiente, ver infrastructure/repositories).
 */

type NavigationProps = NativeStackNavigationProp<AdminStackParamList & ClienteStackParamList>;

type EstadoCarga = 'inicial' | 'cargando' | 'listo' | 'error';

export default function CatalogScreen() {
  const navigation = useNavigation<NavigationProps>();
  const { servicios } = useSolicitudes();
  const { crearPedidoProducto: guardarCompra } = usePedidosProducto();
  const { auth } = useAuth();

  const [productos, setProductos] = useState<ProductoCatalogo[]>([]);
  const [estado, setEstado] = useState<EstadoCarga>('inicial');
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const cargarProductos = async () => {
    setEstado('cargando');
    setMensajeError(null);
    try {
      const data = await obtenerCatalogo();
      setProductos(data);
      setEstado('listo');
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado al cargar el catálogo.';
      setMensajeError(mensaje);
      setEstado('error');
    }
  };

  const solicitarServicio = (servicioId: string) => {
    navigation.navigate('Crear', { servicioId });
  };

  const comprarProducto = async (producto: ProductoCatalogo, cantidad: number) => {
    const clienteNombre = auth?.role === 'CLIENTE' ? auth.nombre : 'Cliente en tienda';
    const telefono = auth?.role === 'CLIENTE' ? auth.telefono : '';

    const pedido = crearPedidoProducto({
      id: `P${Date.now()}`,
      clienteNombre,
      telefono,
      productoId: producto.id,
      productoTitulo: producto.title,
      productoImagen: producto.image,
      categoria: producto.category,
      precioUnitario: producto.price,
      cantidad,
    });

    try {
      await guardarCompra(pedido);
      Alert.alert(
        'Compra registrada',
        `${producto.title} x${cantidad} se guardó correctamente. Puedes verla en tu Perfil.`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la compra. Intenta nuevamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Catálogo</Text>
          <Text style={styles.headerSubtitle}>
            Servicios de lavandería y productos para el cuidado de tu ropa.
          </Text>
        </View>

        {/* ---------- SECCIÓN SERVICIOS (local, siempre visible) ---------- */}
        <Text style={styles.sectionTitle}>Servicios</Text>
        <View style={styles.serviciosList}>
          {servicios.map((sv) => (
            <View key={sv.id} style={styles.servicioCard}>
              <Text style={styles.servicioIcono}>{sv.icono}</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.servicioNombre}>{sv.nombre}</Text>
                <Text style={styles.servicioDescripcion} numberOfLines={2}>
                  {sv.descripcion}
                </Text>
                <Text style={styles.servicioPrecio}>Desde S/ {sv.precio.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.botonSolicitar}
                onPress={() => solicitarServicio(sv.id)}
              >
                <Text style={styles.botonSolicitarTexto}>Solicitar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ---------- SECCIÓN PRODUCTOS (API REST + compra en SQLite) ---------- */}
        <Text style={styles.sectionTitle}>Productos</Text>
        <Text style={styles.sectionSubtitle}>
          Ropa que atendemos y productos de cuidado de ropa. Precios referenciales.
        </Text>

        <TouchableOpacity
          style={styles.botonCargar}
          onPress={cargarProductos}
          disabled={estado === 'cargando'}
        >
          <Text style={styles.botonCargarTexto}>
            {estado === 'cargando'
              ? 'Cargando...'
              : estado === 'listo'
              ? 'Actualizar productos'
              : 'Cargar productos'}
          </Text>
        </TouchableOpacity>

        {estado === 'cargando' && (
          <View style={styles.centrado}>
            <ActivityIndicator size="large" color={COLORES.primario} />
            <Text style={styles.textoSecundario}>Consultando el catálogo...</Text>
          </View>
        )}

        {estado === 'error' && (
          <View style={styles.centrado}>
            <Text style={styles.errorIcono}>⚠️</Text>
            <Text style={styles.errorTexto}>{mensajeError}</Text>
            <TouchableOpacity style={styles.botonReintentar} onPress={cargarProductos}>
              <Text style={styles.botonReintentarTexto}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {estado === 'inicial' && (
          <View style={styles.centrado}>
            <Text style={styles.textoSecundario}>
              Toca "Cargar productos" para ver la ropa e insumos disponibles.
            </Text>
          </View>
        )}

        {estado === 'listo' && (
          <View style={styles.productosList}>
            {productos.map((item) => (
              <ProductoCard key={item.id} producto={item} onComprar={comprarProducto} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/** Tarjeta de producto con selector de cantidad y botón Comprar. */
function ProductoCard({
  producto,
  onComprar,
}: {
  producto: ProductoCatalogo;
  onComprar: (producto: ProductoCatalogo, cantidad: number) => void;
}) {
  const [cantidad, setCantidad] = useState(1);

  return (
    <View style={styles.productoCard}>
      <Image source={{ uri: producto.image }} style={styles.productoImagen} resizeMode="contain" />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.productoTitulo} numberOfLines={2}>
          {producto.title}
        </Text>
        <Text style={styles.productoCategoria}>{producto.category}</Text>
        <Text style={styles.productoPrecio}>${producto.price.toFixed(2)}</Text>

        <View style={styles.filaAcciones}>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperBoton}
              onPress={() => setCantidad((c) => Math.max(1, c - 1))}
            >
              <Text style={styles.stepperBotonTexto}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepperValor}>{cantidad}</Text>
            <TouchableOpacity
              style={styles.stepperBoton}
              onPress={() => setCantidad((c) => c + 1)}
            >
              <Text style={styles.stepperBotonTexto}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.botonComprar}
            onPress={() => onComprar(producto, cantidad)}
          >
            <Text style={styles.botonComprarTexto}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORES.fondo },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORES.texto },
  headerSubtitle: { fontSize: 12.5, color: COLORES.textoSecundario, marginTop: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORES.texto,
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORES.textoSecundario,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  serviciosList: { paddingHorizontal: 16 },
  servicioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.tarjeta,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  servicioIcono: { fontSize: 26 },
  servicioNombre: { fontSize: 14, fontWeight: '700', color: COLORES.texto },
  servicioDescripcion: { fontSize: 11.5, color: COLORES.textoSecundario, marginTop: 2 },
  servicioPrecio: { fontSize: 12.5, fontWeight: '700', color: COLORES.primarioOscuro, marginTop: 4 },
  botonSolicitar: {
    backgroundColor: COLORES.primario,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  botonSolicitarTexto: { color: '#fff', fontWeight: '700', fontSize: 12.5 },
  botonCargar: {
    backgroundColor: COLORES.primario,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  botonCargarTexto: { color: '#fff', fontWeight: '700' },
  centrado: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingVertical: 24 },
  textoSecundario: { color: COLORES.textoSecundario, fontSize: 13, marginTop: 8, textAlign: 'center' },
  errorIcono: { fontSize: 32, marginBottom: 8 },
  errorTexto: { color: COLORES.peligro, fontSize: 14, textAlign: 'center', marginBottom: 16 },
  botonReintentar: {
    borderWidth: 1,
    borderColor: COLORES.primario,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  botonReintentarTexto: { color: COLORES.primario, fontWeight: '700' },
  productosList: { paddingHorizontal: 16 },
  productoCard: {
    flexDirection: 'row',
    backgroundColor: COLORES.tarjeta,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  productoImagen: { width: 64, height: 64, backgroundColor: '#fff' },
  productoTitulo: { fontSize: 13.5, fontWeight: '700', color: COLORES.texto },
  productoCategoria: { fontSize: 11.5, color: COLORES.textoSecundario, marginTop: 2, textTransform: 'capitalize' },
  productoPrecio: { fontSize: 13.5, fontWeight: '800', color: COLORES.primarioOscuro, marginTop: 2 },
  filaAcciones: { flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'space-between' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: 8,
  },
  stepperBoton: { paddingHorizontal: 10, paddingVertical: 4 },
  stepperBotonTexto: { fontSize: 16, fontWeight: '700', color: COLORES.primario },
  stepperValor: { fontSize: 13, fontWeight: '700', color: COLORES.texto, minWidth: 20, textAlign: 'center' },
  botonComprar: {
    backgroundColor: COLORES.primario,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  botonComprarTexto: { color: '#fff', fontWeight: '700', fontSize: 12.5 },
});
