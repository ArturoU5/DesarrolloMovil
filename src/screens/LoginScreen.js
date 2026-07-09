import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';
import { COLORES } from '../utils/constants';

export default function LoginScreen() {
  const { loginAdmin, loginCliente } = useAuth();
  const [tab, setTab] = useState('CLIENTE'); // 'CLIENTE' | 'ADMIN'

  // Formulario cliente
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errorCliente, setErrorCliente] = useState(null);

  // Formulario admin
  const [password, setPassword] = useState('');
  const [errorAdmin, setErrorAdmin] = useState(null);

  const handleLoginCliente = () => {
    const resultado = loginCliente(nombre, telefono);
    if (!resultado.ok) {
      setErrorCliente(resultado.error);
      return;
    }
    setErrorCliente(null);
  };

  const handleLoginAdmin = () => {
    const resultado = loginAdmin(password);
    if (!resultado.ok) {
      setErrorAdmin(resultado.error);
      return;
    }
    setErrorAdmin(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>🧺</Text>
          <Text style={styles.title}>RefreshProClean</Text>
          <Text style={styles.subtitle}>
            Gestiona tus solicitudes de lavandería o administra el servicio.
          </Text>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'CLIENTE' && styles.tabBtnActivo]}
              onPress={() => setTab('CLIENTE')}
            >
              <Text
                style={[styles.tabText, tab === 'CLIENTE' && styles.tabTextActivo]}
              >
                Soy cliente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'ADMIN' && styles.tabBtnActivo]}
              onPress={() => setTab('ADMIN')}
            >
              <Text style={[styles.tabText, tab === 'ADMIN' && styles.tabTextActivo]}>
                Soy personal
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {tab === 'CLIENTE' ? (
              <>
                <Text style={styles.cardTitle}>Ingresa tus datos</Text>
                <InputField
                  label="Nombre completo"
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Ej. María Gómez"
                />
                <InputField
                  label="Teléfono"
                  value={telefono}
                  onChangeText={setTelefono}
                  placeholder="Ej. 987654321"
                  keyboardType="phone-pad"
                  error={errorCliente}
                />
                <TouchableOpacity style={styles.botonIngresar} onPress={handleLoginCliente}>
                  <Text style={styles.botonIngresarTexto}>Ingresar como cliente</Text>
                </TouchableOpacity>
                <Text style={styles.nota}>
                  No necesitas contraseña. Usaremos tu nombre y teléfono para
                  mostrarte únicamente tus propias solicitudes.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.cardTitle}>Acceso del personal</Text>
                <InputField
                  label="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Ingresa la contraseña"
                  error={errorAdmin}
                />
                <TouchableOpacity style={styles.botonIngresar} onPress={handleLoginAdmin}>
                  <Text style={styles.botonIngresarTexto}>Ingresar como administrador</Text>
                </TouchableOpacity>
                <Text style={styles.nota}>
                  Contraseña de prueba para la demostración:{' '}
                  <Text style={{ fontWeight: '700' }}>admin123</Text>
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORES.primario },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 48, paddingBottom: 40 },
  logo: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#E7F1F8',
    textAlign: 'center',
    marginBottom: 24,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActivo: { backgroundColor: '#fff' },
  tabText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  tabTextActivo: { color: COLORES.primario },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORES.texto,
    marginBottom: 14,
  },
  botonIngresar: {
    backgroundColor: COLORES.primario,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  botonIngresarTexto: { color: '#fff', fontWeight: '700' },
  nota: {
    fontSize: 12,
    color: COLORES.textoSecundario,
    marginTop: 12,
    textAlign: 'center',
  },
});
