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
} from 'react-native';
import { obtenerCatalogo, ProductoCatalogo } from '../../infrastructure/api/catalogoApi';
import { COLORES } from '../../shared/constants';

/**
 * Consumo básico de API REST (GET) pedido por la rúbrica:
 * - botón "Cargar productos" -> dispara la petición
 * - estado de carga (ActivityIndicator + texto)
 * - visualización de datos (lista de productos)
 * - mensaje de error si falla la petición, con botón para reintentar
 *
 * No se guarda nada de esto en SQLite: es solo un catálogo de
 * referencia externo, tal como indica la consigna ("no es obligatorio
 * guardar los datos obtenidos desde la API REST en SQLite").
 */
type EstadoCarga = 'inicial' | 'cargando' | 'listo' | 'error';

export default function CatalogScreen() {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catálogo</Text>
        <Text style={styles.headerSubtitle}>
          Prendas que atendemos y productos de cuidado de ropa (catálogo
          consumido vía API REST). Precios referenciales.
        </Text>
      </View>

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
            Toca "Cargar productos" para consultar el catálogo.
          </Text>
        </View>
      )}

      {estado === 'listo' && (
        <FlatList
          data={productos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.imagen} resizeMode="contain" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.titulo} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.categoria}>{item.category}</Text>
                <Text style={styles.precio}>${item.price.toFixed(2)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORES.fondo },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORES.texto },
  headerSubtitle: { fontSize: 12.5, color: COLORES.textoSecundario, marginTop: 4 },
  botonCargar: {
    backgroundColor: COLORES.primario,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  botonCargarTexto: { color: '#fff', fontWeight: '700' },
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
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
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORES.tarjeta,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  imagen: { width: 56, height: 56, backgroundColor: '#fff' },
  titulo: { fontSize: 14, fontWeight: '700', color: COLORES.texto },
  categoria: { fontSize: 12, color: COLORES.textoSecundario, marginTop: 2, textTransform: 'capitalize' },
  precio: { fontSize: 14, fontWeight: '800', color: COLORES.primarioOscuro, marginTop: 4 },
});