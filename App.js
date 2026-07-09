import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SolicitudesProvider } from './src/context/SolicitudesContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import ListScreen from './src/screens/ListScreen';
import ClienteHomeScreen from './src/screens/ClienteHomeScreen';
import CreateScreen from './src/screens/CreateScreen';
import DetailScreen from './src/screens/DetailScreen';
import { COLORES } from './src/utils/constants';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: COLORES.primario },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  if (auth.role === 'ADMIN') {
    return (
      <Stack.Navigator initialRouteName="Listado" screenOptions={screenOptions}>
        <Stack.Screen
          name="Listado"
          component={ListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Crear"
          component={CreateScreen}
          options={{ title: 'Nueva solicitud' }}
        />
        <Stack.Screen
          name="Detalle"
          component={DetailScreen}
          options={{ title: 'Detalle de solicitud' }}
        />
      </Stack.Navigator>
    );
  }

  // role === 'CLIENTE'
  return (
    <Stack.Navigator initialRouteName="MisSolicitudes" screenOptions={screenOptions}>
      <Stack.Screen
        name="MisSolicitudes"
        component={ClienteHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Crear"
        component={CreateScreen}
        options={{ title: 'Nueva solicitud' }}
      />
      <Stack.Screen
        name="Detalle"
        component={DetailScreen}
        options={{ title: 'Detalle de solicitud' }}
      />
    </Stack.Navigator>
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
