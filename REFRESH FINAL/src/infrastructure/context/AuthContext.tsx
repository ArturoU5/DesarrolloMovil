import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, ADMIN_EMAIL } from '../firebase/firebaseConfig';

/**
 * Autenticación real con Firebase Authentication (correo y contraseña):
 * - ADMIN: se identifica por un correo fijo (ADMIN_EMAIL). Ese usuario se
 *   crea una sola vez desde Firebase Console (Authentication > Users >
 *   Add user), no hay pantalla de registro para el admin.
 * - CLIENTE: cualquier otro correo. Se registra desde la app (nombre,
 *   teléfono, correo, contraseña); nombre y teléfono se guardan en
 *   Cloud Firestore (colección "clientes", documento = uid), porque
 *   Firebase Auth por sí solo no guarda esos campos.
 *
 * onAuthStateChanged mantiene la sesión activa entre reinicios de la
 * app (persistida en AsyncStorage, ver firebaseConfig.ts).
 */

export type AuthState =
  | { role: 'ADMIN' }
  | { role: 'CLIENTE'; uid: string; nombre: string; telefono: string }
  | null;

interface LoginResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  auth: AuthState;
  cargandoAuth: boolean;
  loginConCorreo: (correo: string, contrasena: string) => Promise<LoginResult>;
  registrarCliente: (
    nombre: string,
    telefono: string,
    correo: string,
    contrasena: string
  ) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Traduce los códigos de error de Firebase a mensajes en español, entendibles. */
function mensajeError(codigo: string): string {
  switch (codigo) {
    case 'auth/invalid-email':
      return 'El correo no tiene un formato válido.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Correo o contraseña incorrectos.';
    case 'auth/wrong-password':
      return 'Correo o contraseña incorrectos.';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta registrada con ese correo.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/network-request-failed':
      return 'No se pudo conectar. Revisa tu conexión a internet.';
    default:
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  useEffect(() => {
    // Se ejecuta al abrir la app (con sesión persistida) y cada vez que
    // cambia el estado de sesión (login/logout).
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setAuthState(null);
        setCargandoAuth(false);
        return;
      }

      if (firebaseUser.email === ADMIN_EMAIL) {
        setAuthState({ role: 'ADMIN' });
        setCargandoAuth(false);
        return;
      }

      try {
        const perfilRef = doc(db, 'clientes', firebaseUser.uid);
        const perfilSnap = await getDoc(perfilRef);
        const datos = perfilSnap.exists() ? perfilSnap.data() : {};
        setAuthState({
          role: 'CLIENTE',
          uid: firebaseUser.uid,
          nombre: datos.nombre ?? '',
          telefono: datos.telefono ?? '',
        });
      } catch (error) {
        // Si Firestore falla, igual dejamos al cliente autenticado
        // (con nombre/teléfono vacíos) en vez de bloquearlo del todo.
        setAuthState({ role: 'CLIENTE', uid: firebaseUser.uid, nombre: '', telefono: '' });
      } finally {
        setCargandoAuth(false);
      }
    });

    return unsubscribe;
  }, []);

  const loginConCorreo = async (correo: string, contrasena: string): Promise<LoginResult> => {
    try {
      await signInWithEmailAndPassword(auth, correo.trim(), contrasena);
      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: mensajeError(error?.code ?? '') };
    }
  };

  const registrarCliente = async (
    nombre: string,
    telefono: string,
    correo: string,
    contrasena: string
  ): Promise<LoginResult> => {
    if (!nombre.trim()) return { ok: false, error: 'Ingresa tu nombre.' };
    if (!/^[0-9]{6,9}$/.test(telefono.trim())) {
      return { ok: false, error: 'Ingresa un teléfono válido (6 a 9 dígitos).' };
    }

    try {
      const credencial = await createUserWithEmailAndPassword(auth, correo.trim(), contrasena);
      await setDoc(doc(db, 'clientes', credencial.user.uid), {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
      });
      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: mensajeError(error?.code ?? '') };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ auth: authState, cargandoAuth, loginConCorreo, registrarCliente, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
