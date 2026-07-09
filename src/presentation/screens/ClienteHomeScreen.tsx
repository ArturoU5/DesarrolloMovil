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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import SolicitudCard from '../components/SolicitudCard';
import { useSolicitudes } from '../../infrastructure/context/SolicitudesContext';
import { useAuth } from '../../infrastructure/context/AuthContext';
import { COLORES } from '../../shared/constants';
import type { ClienteStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ClienteStackParamList, 'MisSolicitudes'>;

export default function ClienteHomeScreen({ navigation }: Props) {
  const { solicitudes, servicios, cargando, refrescar } = useSolicitudes();
  const { auth, logout } = useAuth();

  // En esta pantalla auth siempre es de rol CLIENTE (garantizado por App.tsx)
  const clienteAuth = auth as { role: 'CLIENTE'; nombre: string; telefono: string };

  const misSolicitudes = useMemo(() => {
    return solicitudes.filter((s) => s.telefono === clienteAuth.telefono);
  }, [solicitudes, clienteAuth.telefono]);

  const buscarServicio = (servicioId: string | null) =>
    servicios.find((sv) => sv.id === servicioId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.saludo}>Hola, {clienteAuth.nombre.split(' ')[0]} 👋</Text>
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
          !cargando ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Todavía no tienes solicitudes registradas. Crea la primera con
                el botón de arriba.
              </Text>
            </View>
          ) : null
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
