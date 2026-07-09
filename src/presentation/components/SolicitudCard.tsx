import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Chip from './Chip';
import { COLORES, ESTADO_CONFIG, PRIORIDAD_CONFIG } from '../../shared/constants';
import { Solicitud } from '../../domain/models/Solicitud';
import { Servicio } from '../../domain/models/Servicio';

interface SolicitudCardProps {
  solicitud: Solicitud;
  servicio?: Servicio;
  onPress: () => void;
}

export default function SolicitudCard({ solicitud, servicio, onPress }: SolicitudCardProps) {
  const estadoCfg = ESTADO_CONFIG[solicitud.estado];
  const prioridadCfg = PRIORIDAD_CONFIG[solicitud.prioridad];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{servicio?.icono || '🧺'}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.cliente}>{solicitud.clienteNombre}</Text>
          <Text style={styles.servicio}>{servicio?.nombre || 'Servicio no definido'}</Text>
        </View>
      </View>

      <Text style={styles.descripcion} numberOfLines={2}>
        {solicitud.descripcion}
      </Text>

      <View style={styles.footerRow}>
        <Chip label={estadoCfg.label} color={estadoCfg.color} bg={estadoCfg.bg} />
        <Chip label={prioridadCfg.label} color={prioridadCfg.color} bg={prioridadCfg.bg} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORES.fondo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  cliente: { fontSize: 15, fontWeight: '700', color: COLORES.texto },
  servicio: { fontSize: 13, color: COLORES.textoSecundario },
  descripcion: { fontSize: 13, color: COLORES.texto, marginBottom: 10 },
  footerRow: { flexDirection: 'row', gap: 8 },
});
