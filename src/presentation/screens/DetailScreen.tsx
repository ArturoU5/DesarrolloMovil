import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import InputField from '../components/InputField';
import ConfirmDialog from '../components/ConfirmDialog';
import Chip from '../components/Chip';
import { useSolicitudes } from '../../infrastructure/context/SolicitudesContext';
import { useAuth } from '../../infrastructure/context/AuthContext';
import { ESTADOS, Estado } from '../../domain/models/Solicitud';
import {
  COLORES,
  ESTADO_CONFIG,
  PRIORIDAD_CONFIG,
  FILTROS_ESTADO,
} from '../../shared/constants';
import { validarDescripcion } from '../../shared/validations';
import type { AdminStackParamList, ClienteStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<
  AdminStackParamList & ClienteStackParamList,
  'Detalle'
>;

export default function DetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { solicitudes, servicios, usuarios, actualizarSolicitud, eliminarSolicitud } =
    useSolicitudes();
  const { auth } = useAuth();
  const esAdmin = auth?.role === 'ADMIN';

  const solicitud = solicitudes.find((s) => s.id === id);
  const servicio = servicios.find((sv) => sv.id === solicitud?.servicioId);
  const usuario = usuarios.find((u) => u.id === solicitud?.usuarioId);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [descripcion, setDescripcion] = useState(solicitud?.descripcion || '');
  const [errorDescripcion, setErrorDescripcion] = useState<string | null>(null);
  const [dialogoVisible, setDialogoVisible] = useState(false);

  if (!solicitud) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>La solicitud ya no existe.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const estadoCfg = ESTADO_CONFIG[solicitud.estado];
  const prioridadCfg = PRIORIDAD_CONFIG[solicitud.prioridad];

  // El cliente solo puede editar/cancelar SU PROPIA solicitud, y solo
  // mientras esté en estado Pendiente (una vez que el personal la toma en
  // atención, ya no se puede modificar desde el lado del cliente).
  const puedeGestionar = esAdmin || solicitud.estado === ESTADOS.PENDIENTE;
  const puedeCambiarEstado = esAdmin;

  const cambiarEstado = (nuevoEstado: Estado) => {
    actualizarSolicitud(solicitud.id, { estado: nuevoEstado });
  };

  const guardarEdicion = () => {
    const error = validarDescripcion(descripcion);
    setErrorDescripcion(error);
    if (error) return;

    actualizarSolicitud(solicitud.id, { descripcion: descripcion.trim() });
    setModoEdicion(false);
    Alert.alert('Actualizado', 'La solicitud se actualizó correctamente.');
  };

  const confirmarEliminar = () => {
    eliminarSolicitud(solicitud.id);
    setDialogoVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerCard}>
          <Text style={styles.icon}>{servicio?.icono || '🧺'}</Text>
          <Text style={styles.cliente}>{solicitud.clienteNombre}</Text>
          <Text style={styles.servicio}>{servicio?.nombre}</Text>

          <View style={styles.chipsRow}>
            <Chip label={estadoCfg.label} color={estadoCfg.color} bg={estadoCfg.bg} />
            <Chip label={prioridadCfg.label} color={prioridadCfg.color} bg={prioridadCfg.bg} />
          </View>
        </View>

        <View style={styles.infoCard}>
          <InfoRow label="Teléfono" value={solicitud.telefono} />
          <InfoRow label="Dirección" value={solicitud.direccion} />
          <InfoRow
            label="Fecha de registro"
            value={new Date(solicitud.fechaRegistro).toLocaleString()}
          />
          <InfoRow
            label="Empleado asignado"
            value={usuario ? `${usuario.nombre} ${usuario.apellido} (${usuario.cargo})` : 'Sin asignar'}
          />
        </View>

        <Text style={styles.sectionTitle}>Descripción</Text>
        {modoEdicion ? (
          <InputField
            label="Editar descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            error={errorDescripcion}
            multiline
          />
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.descripcionTexto}>{solicitud.descripcion}</Text>
          </View>
        )}

        {puedeCambiarEstado && (
          <>
            <Text style={styles.sectionTitle}>Cambiar estado</Text>
            <View style={styles.estadosWrap}>
              {FILTROS_ESTADO.filter((f) => f.key !== 'TODOS').map((f) => (
                <TouchableOpacity
                  key={f.key}
                  style={[
                    styles.estadoBtn,
                    solicitud.estado === f.key && styles.estadoBtnActivo,
                  ]}
                  onPress={() => cambiarEstado(f.key as Estado)}
                >
                  <Text
                    style={[
                      styles.estadoBtnText,
                      solicitud.estado === f.key && styles.estadoBtnTextActivo,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {!esAdmin && !puedeGestionar && (
          <Text style={styles.avisoCliente}>
            Esta solicitud ya está siendo atendida o fue finalizada, por lo
            que ya no se puede editar ni cancelar desde tu cuenta. Si
            necesitas hacer un cambio, comunícate directamente con
            RefreshProClean.
          </Text>
        )}

        {puedeGestionar && (
          <View style={styles.actionsRow}>
            {modoEdicion ? (
              <TouchableOpacity style={styles.btnPrimario} onPress={guardarEdicion}>
                <Text style={styles.btnPrimarioText}>Guardar cambios</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.btnPrimario}
                onPress={() => setModoEdicion(true)}
              >
                <Text style={styles.btnPrimarioText}>Editar descripción</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.btnEliminar}
              onPress={() => setDialogoVisible(true)}
            >
              <Text style={styles.btnEliminarText}>
                {esAdmin ? 'Eliminar solicitud' : 'Cancelar solicitud'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={dialogoVisible}
        title={esAdmin ? 'Eliminar solicitud' : 'Cancelar solicitud'}
        message={
          esAdmin
            ? `¿Seguro que deseas eliminar la solicitud de ${solicitud.clienteNombre}? Esta acción no se puede deshacer.`
            : '¿Seguro que deseas cancelar esta solicitud? Esta acción no se puede deshacer.'
        }
        onConfirm={confirmarEliminar}
        onCancel={() => setDialogoVisible(false)}
        confirmLabel={esAdmin ? 'Eliminar' : 'Cancelar solicitud'}
      />
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
  scroll: { padding: 16, paddingBottom: 40 },
  headerCard: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: { fontSize: 36, marginBottom: 6 },
  cliente: { fontSize: 18, fontWeight: '800', color: COLORES.texto },
  servicio: { fontSize: 13, color: COLORES.textoSecundario, marginBottom: 10 },
  chipsRow: { flexDirection: 'row', gap: 8 },
  infoCard: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: { fontSize: 13, color: COLORES.textoSecundario },
  infoValue: { fontSize: 13, color: COLORES.texto, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  descripcionTexto: { fontSize: 14, color: COLORES.texto, lineHeight: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORES.texto, marginBottom: 8 },
  estadosWrap: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  estadoBtn: {
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  estadoBtnActivo: { backgroundColor: COLORES.primario, borderColor: COLORES.primario },
  estadoBtnText: { fontSize: 12, color: COLORES.textoSecundario, fontWeight: '600' },
  estadoBtnTextActivo: { color: '#fff' },
  actionsRow: { marginTop: 4 },
  avisoCliente: {
    fontSize: 12.5,
    color: COLORES.textoSecundario,
    backgroundColor: '#F1F3F5',
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  btnPrimario: {
    backgroundColor: COLORES.primario,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnPrimarioText: { color: '#fff', fontWeight: '700' },
  btnEliminar: {
    borderWidth: 1,
    borderColor: COLORES.peligro,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnEliminarText: { color: COLORES.peligro, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: COLORES.textoSecundario },
});
