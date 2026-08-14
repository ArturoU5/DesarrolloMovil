/**
 * Inicialización de Firebase para RefreshProClean.
 *
 * - Authentication: login real con correo y contraseña (reemplaza el
 *   login simulado que teníamos antes en AuthContext).
 * - Firestore: guarda el perfil de cada cliente (nombre, teléfono),
 *   ya que Firebase Auth por sí solo no guarda esos datos.
 *
 * NOTA para el resto del equipo: estas credenciales vienen del proyecto
 * de Firebase Console (Configuración del proyecto > tus apps > SDK
 * setup). El apiKey de Firebase NO es secreto (está diseñado para ir en
 * el cliente); lo que protege los datos son las reglas de seguridad de
 * Firestore, no este archivo.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
// @ts-ignore -- getReactNativePersistence existe en el build de React Native
// del paquete "firebase/auth", pero TypeScript a veces no lo detecta bien
// porque el paquete expone tipos distintos según la plataforma.
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCev9pffe2rrZx25tA7jFpqxQ4QZ1-9rWg',
  authDomain: 'refresh-6ed35.firebaseapp.com',
  projectId: 'refresh-6ed35',
  storageBucket: 'refresh-6ed35.firebasestorage.app',
  messagingSenderId: '815223058948',
  appId: '1:815223058948:web:78e9f21814bf217662bb51',
  measurementId: 'G-PSB6SN0HX0',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth con persistencia en AsyncStorage: sin esto, el usuario tendría
// que iniciar sesión de nuevo cada vez que cierra la app.
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // Si el módulo ya fue inicializado antes (ej. Fast Refresh en desarrollo),
  // reutilizamos la instancia existente en vez de fallar.
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };

/** Correo fijo del personal administrativo de RefreshProClean. */
export const ADMIN_EMAIL = 'admin@refreshproclean.com';
