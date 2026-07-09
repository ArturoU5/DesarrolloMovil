import React, { createContext, useContext, useState } from 'react';

/**
 * Autenticación simple en memoria, con dos roles:
 * - ADMIN: personal de RefreshProClean. Accede con una contraseña fija.
 * - CLIENTE: cualquier cliente. "Inicia sesión" con su nombre y teléfono
 *   (no hay contraseña real, es solo para identificar cuáles son "sus"
 *   solicitudes dentro del estado en memoria).
 *
 * No hay base de datos ni backend de autenticación real: todo vive en el
 * estado de React mientras la app está abierta, tal como exige la rúbrica.
 */

const AuthContext = createContext(null);

const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  // auth = null (no autenticado)
  // auth = { role: 'ADMIN' }
  // auth = { role: 'CLIENTE', nombre, telefono }

  const loginAdmin = (password) => {
    if (password !== ADMIN_PASSWORD) {
      return { ok: false, error: 'Contraseña incorrecta.' };
    }
    setAuth({ role: 'ADMIN' });
    return { ok: true };
  };

  const loginCliente = (nombre, telefono) => {
    if (!nombre || !nombre.trim()) {
      return { ok: false, error: 'Ingresa tu nombre.' };
    }
    if (!telefono || !/^[0-9]{6,9}$/.test(telefono.trim())) {
      return { ok: false, error: 'Ingresa un teléfono válido (6 a 9 dígitos).' };
    }
    setAuth({ role: 'CLIENTE', nombre: nombre.trim(), telefono: telefono.trim() });
    return { ok: true };
  };

  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ auth, loginAdmin, loginCliente, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
