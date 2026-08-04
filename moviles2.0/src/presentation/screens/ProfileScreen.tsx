import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { useAuth } from '../../infrastructure/context/AuthContext';
import { COLORES } from '../../shared/constants';

/**
 * Pantalla informativa (perfil / acerca de), pedida por la rúbrica como
 * pantalla mínima. Muestra quién tiene la sesión iniciada, datos de
 * contacto del negocio y la versión de la app.
 */
export default function ProfileScreen() {
  const { auth, logout } = useAuth();
  const nombreMostrado =
    auth?.role === 'CLIENTE' ? auth.nombre : auth?.role === 'ADMIN' ? 'Personal administrativo' : '';
  const rolMostrado = auth?.role === 'CLIENTE' ? 'Cliente' : 'Administrador';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarEmoji}>{auth?.role === 'ADMIN' ? '🧑‍💼' : '🙋'}</Text>
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
