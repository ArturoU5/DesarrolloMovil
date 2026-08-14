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
import { useAuth } from '../../infrastructure/context/AuthContext';
import { COLORES } from '../../shared/constants';

type Modo = 'LOGIN' | 'REGISTRO';

/**
 * Login real con Firebase Authentication (correo y contraseña).
 * - "Iniciar sesión" sirve tanto para clientes como para el personal
 *   administrativo: el rol se determina automáticamente según el
 *   correo (ver AuthContext -> ADMIN_EMAIL). No hay pestañas separadas
 *   porque ya no hace falta: Firebase decide quién es quién.
 * - "Crear cuenta" es solo para clientes nuevos (el usuario admin se
 *   crea una única vez desde Firebase Console).
 */
export default function LoginScreen() {
  const { loginConCorreo, registrarCliente } = useAuth();
  const [modo, setModo] = useState<Modo>('LOGIN');
  const [enviando, setEnviando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);

  const cambiarModo = (nuevoModo: Modo) => {
    setModo(nuevoModo);
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!correo.trim() || !contrasena) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    setEnviando(true);
    const resultado =
      modo === 'LOGIN'
        ? await loginConCorreo(correo, contrasena)
        : await registrarCliente(nombre, telefono, correo, contrasena);
    setEnviando(false);

    if (!resultado.ok) {
      setError(resultado.error ?? 'Ocurrió un error. Intenta nuevamente.');
    }
    // Si fue exitoso, no hace falta navegar manualmente: RootNavigator
    // (App.tsx) cambia de pantalla solo, en cuanto Firebase confirma la
    // sesión (onAuthStateChanged en AuthContext).
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>🧺</Text>
          <Text style={styles.title}>RefreshProClean</Text>
          <Text style={styles.subtitle}>
            Gestiona tus solicitudes de lavandería o administra el servicio.
          </Text>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tabBtn, modo === 'LOGIN' && styles.tabBtnActivo]}
              onPress={() => cambiarModo('LOGIN')}
            >
              <Text style={[styles.tabText, modo === 'LOGIN' && styles.tabTextActivo]}>
                Iniciar sesión
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, modo === 'REGISTRO' && styles.tabBtnActivo]}
              onPress={() => cambiarModo('REGISTRO')}
            >
              <Text style={[styles.tabText, modo === 'REGISTRO' && styles.tabTextActivo]}>
                Crear cuenta
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {modo === 'LOGIN' ? 'Ingresa a tu cuenta' : 'Regístrate como cliente'}
            </Text>

            {modo === 'REGISTRO' && (
              <>
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
                />
              </>
            )}

            <InputField
              label="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              placeholder="tucorreo@ejemplo.com"
              keyboardType="email-address"
            />
            <InputField
              label="Contraseña"
              value={contrasena}
              onChangeText={setContrasena}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              error={error}
            />

            <TouchableOpacity
              style={[styles.botonIngresar, enviando && styles.botonDeshabilitado]}
              onPress={handleSubmit}
              disabled={enviando}
            >
              <Text style={styles.botonIngresarTexto}>
                {enviando
                  ? 'Un momento...'
                  : modo === 'LOGIN'
                  ? 'Iniciar sesión'
                  : 'Crear cuenta'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.nota}>
              {modo === 'LOGIN'
                ? '¿Eres cliente nuevo? Toca "Crear cuenta" arriba.'
                : 'El personal administrativo no se registra aquí: ya tiene una cuenta creada.'}
            </Text>
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
  botonDeshabilitado: { opacity: 0.6 },
  botonIngresarTexto: { color: '#fff', fontWeight: '700' },
  nota: {
    fontSize: 12,
    color: COLORES.textoSecundario,
    marginTop: 12,
    textAlign: 'center',
  },
});
