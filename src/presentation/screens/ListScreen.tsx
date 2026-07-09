import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { COLORES, FILTROS_ESTADO } from '../../shared/constants';
import type { AdminStackParamList } from '../navigation/types';
import type { Estado } from '../../domain/models/Solicitud';

type Props = NativeStackScreenProps<AdminStackParamList, 'Listado'>;

export default function ListScreen({ navigation }: Props) {
  const { solicitudes, servicios, cargando, refrescar } = useSolicitudes();
  const { logout } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<'TODOS' | Estado>('TODOS');

  const listaFiltrada = useMemo(() => {
    return solicitudes.filter((s) => {
      const coincideEstado = filtro === 'TODOS' || s.estado === filtro;
      const coincideBusqueda =
        !busqueda.trim() ||
        s.clienteNombre.toLowerCase().includes(busqueda.trim().toLowerCase());
      return coincideEstado && coincideBusqueda;
    });
  }, [solicitudes, filtro, busqueda]);

  const buscarServicio = (servicioId: string | null) =>
    servicios.find((sv) => sv.id === servicioId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solicitudes</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Crear')}
          >
            <Text style={styles.addButtonText}>+ Nueva</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={{ marginLeft: 12 }}>
            <Text style={styles.logout}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Buscar por cliente..."
        placeholderTextColor="#A0AEC0"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        data={FILTROS_ESTADO}
        horizontal
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosLista}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filtroChip,
              filtro === item.key && styles.filtroChipActivo,
            ]}
            onPress={() => setFiltro(item.key)}
          >
            <Text
              style={[
                styles.filtroChipText,
                filtro === item.key && styles.filtroChipTextActivo,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={cargando} onRefresh={refrescar} />
        }
        ListEmptyComponent={
          !cargando ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No hay solicitudes que coincidan con la búsqueda o filtro.
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORES.texto },
  addButton: {
    backgroundColor: COLORES.primario,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  logout: { color: COLORES.peligro, fontWeight: '700', fontSize: 13 },
  search: {
    marginHorizontal: 16,
    backgroundColor: COLORES.tarjeta,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORES.borde,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    color: COLORES.texto,
  },
  filtrosLista: { flexGrow: 0, marginBottom: 8 },
  filtroChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORES.tarjeta,
    borderWidth: 1,
    borderColor: COLORES.borde,
    marginRight: 8,
  },
  filtroChipActivo: { backgroundColor: COLORES.primario, borderColor: COLORES.primario },
  filtroChipText: { color: COLORES.textoSecundario, fontWeight: '600', fontSize: 13 },
  filtroChipTextActivo: { color: '#fff' },
  listContent: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },
  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyText: { color: COLORES.textoSecundario, textAlign: 'center', fontSize: 14 },
});
