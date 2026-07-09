import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SolicitudesProvider } from './src/infrastructure/context/SolicitudesContext';
import { AuthProvider, useAuth } from './src/infrastructure/context/AuthContext';
import LoginScreen from './src/presentation/screens/LoginScreen';
import ListScreen from './src/presentation/screens/ListScreen';
import ClienteHomeScreen from './src/presentation/screens/ClienteHomeScreen';
import CreateScreen from './src/presentation/screens/CreateScreen';
import DetailScreen from './src/presentation/screens/DetailScreen';
import { COLORES } from './src/shared/constants';
import type {
  AdminStackParamList,
  ClienteStackParamList,
  AuthStackParamList,
} from './src/presentation/navigation/types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const ClienteStack = createNativeStackNavigator<ClienteStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: COLORES.primario },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' as const },
};

/**
 * Navegación raíz: decide qué flujo mostrar según el estado de
 * autenticación (sin sesión / ADMIN / CLIENTE). No hay backend real de
 * autenticación: todo vive en AuthContext, en memoria.
 */
function RootNavigator() {
  const { auth } = useAuth();

  if (!auth) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
      </AuthStack.Navigator>
    );
  }

  if (auth.role === 'ADMIN') {
    return (
      <AdminStack.Navigator initialRouteName="Listado" screenOptions={screenOptions}>
        <AdminStack.Screen
          name="Listado"
          component={ListScreen}
          options={{ headerShown: false }}
        />
        <AdminStack.Screen
          name="Crear"
          component={CreateScreen}
          options={{ title: 'Nueva solicitud' }}
        />
        <AdminStack.Screen
          name="Detalle"
          component={DetailScreen}
          options={{ title: 'Detalle de solicitud' }}
        />
      </AdminStack.Navigator>
    );
  }

  // auth.role === 'CLIENTE'
  return (
    <ClienteStack.Navigator initialRouteName="MisSolicitudes" screenOptions={screenOptions}>
      <ClienteStack.Screen
        name="MisSolicitudes"
        component={ClienteHomeScreen}
        options={{ headerShown: false }}
      />
      <ClienteStack.Screen
        name="Crear"
        component={CreateScreen}
        options={{ title: 'Nueva solicitud' }}
      />
      <ClienteStack.Screen
        name="Detalle"
        component={DetailScreen}
        options={{ title: 'Detalle de solicitud' }}
      />
    </ClienteStack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SolicitudesProvider>
        <StatusBar barStyle="light-content" backgroundColor={COLORES.primario} />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SolicitudesProvider>
    </AuthProvider>
  );
}
