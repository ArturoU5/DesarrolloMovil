import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORES } from '../utils/constants';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🧺</Text>
        <Text style={styles.title}>RefreshProClean</Text>
        <Text style={styles.subtitle}>
          Gestiona las solicitudes de lavandería de tus clientes: recepción,
          seguimiento y estado de cada pedido, todo en un solo lugar.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Listado')}
        >
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORES.primario },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logo: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 10 },
  subtitle: {
    fontSize: 14,
    color: '#E7F1F8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 999,
  },
  buttonText: { color: COLORES.primario, fontWeight: '700', fontSize: 16 },
});
