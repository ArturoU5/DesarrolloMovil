import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import SolicitudCard from '../components/SolicitudCard';
import { useSolicitudes } from '../context/SolicitudesContext';
import { useAuth } from '../context/AuthContext';
import { COLORES } from '../utils/constants';

export default function ClienteHomeScreen({ navigation }) {
  const { solicitudes, servicios, cargando, refrescar } = useSolicitudes();
  const { auth, logout } = useAuth();

  const misSolicitudes = useMemo(() => {
    return solicitudes.filter((s) => s.telefono === auth.telefono);
  }, [solicitudes, auth.telefono]);

  const buscarServicio = (servicioId) => servicios.find((sv) => sv.id === servicioId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.saludo}>Hola, {auth.nombre.split(' ')[0]} 👋</Text>
          <Text style={styles.headerTitle}>Mis solicitudes</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Crear')}
      >
        <Text style={styles.addButtonText}>+ Nueva solicitud</Text>
      </TouchableOpacity>

      <FlatList
        data={misSolicitudes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={cargando} onRefresh={refrescar} />
        }
        ListEmptyComponent={
          !cargando && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Todavía no tienes solicitudes registradas. Crea la primera con
                el botón de arriba.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <SolicitudCard
            solicitud={item}
            servicio={buscarServicio(item.servicioId)}
            onPress={() => navigation.navigate('Detalle', { id: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORES.fondo },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  saludo: { fontSize: 13, color: COLORES.textoSecundario },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORES.texto },
  logout: { color: COLORES.peligro, fontWeight: '700', fontSize: 13, marginTop: 4 },
  addButton: {
    backgroundColor: COLORES.primario,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: { color: '#fff', fontWeight: '700' },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyText: { color: COLORES.textoSecundario, textAlign: 'center', fontSize: 14 },
});
