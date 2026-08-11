import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { SolicitudesProvider } from './src/infrastructure/context/SolicitudesContext';
import { PedidosProductoProvider } from './src/infrastructure/context/PedidosProductoContext';
import { AuthProvider, useAuth } from './src/infrastructure/context/AuthContext';
import LoginScreen from './src/presentation/screens/LoginScreen';
import ListScreen from './src/presentation/screens/ListScreen';
import ClienteHomeScreen from './src/presentation/screens/ClienteHomeScreen';
import CreateScreen from './src/presentation/screens/CreateScreen';
import DetailScreen from './src/presentation/screens/DetailScreen';
import CatalogScreen from './src/presentation/screens/CatalogScreen';
import ProfileScreen from './src/presentation/screens/ProfileScreen';
import { COLORES } from './src/shared/constants';
import type {
  AdminStackParamList,
  ClienteStackParamList,
  AdminTabParamList,
  ClienteTabParamList,
  AuthStackParamList,
} from './src/presentation/navigation/types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const ClienteStack = createNativeStackNavigator<ClienteStackParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();
const ClienteTab = createBottomTabNavigator<ClienteTabParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: COLORES.primario },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' as const },
};

// Íconos simples con emoji (sin dependencias extra de íconos).
function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

/** Pestañas del rol ADMIN: Solicitudes, Catálogo y Perfil. */
function AdminTabs() {
  return (
    <AdminTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORES.primario,
        tabBarInactiveTintColor: COLORES.textoSecundario,
      }}
    >
      <AdminTab.Screen
        name="SolicitudesTab"
        component={ListScreen}
        options={{ title: 'Solicitudes', tabBarIcon: () => <TabIcon emoji="🧺" /> }}
      />
      <AdminTab.Screen
        name="CatalogoTab"
        component={CatalogScreen}
        options={{ title: 'Catálogo', tabBarIcon: () => <TabIcon emoji="🛍️" /> }}
      />
      <AdminTab.Screen
        name="PerfilTab"
        component={ProfileScreen}
        options={{ title: 'Perfil', tabBarIcon: () => <TabIcon emoji="👤" /> }}
      />
    </AdminTab.Navigator>
  );
}

/** Pestañas del rol CLIENTE: Mis solicitudes, Catálogo (pestaña inicial) y Perfil. */
function ClienteTabs() {
  return (
    <ClienteTab.Navigator
      initialRouteName="CatalogoTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORES.primario,
        tabBarInactiveTintColor: COLORES.textoSecundario,
      }}
    >
      <ClienteTab.Screen
        name="MisSolicitudesTab"
        component={ClienteHomeScreen}
        options={{ title: 'Mis solicitudes', tabBarIcon: () => <TabIcon emoji="🧺" /> }}
      />
      <ClienteTab.Screen
        name="CatalogoTab"
        component={CatalogScreen}
        options={{ title: 'Catálogo', tabBarIcon: () => <TabIcon emoji="🛍️" /> }}
      />
      <ClienteTab.Screen
        name="PerfilTab"
        component={ProfileScreen}
        options={{ title: 'Perfil', tabBarIcon: () => <TabIcon emoji="👤" /> }}
      />
    </ClienteTab.Navigator>
  );
}

/**
 * Stack raíz del ADMIN: las pestañas son la pantalla principal, y
 * Crear/Detalle se abren ENCIMA de las pestañas (pantalla completa,
 * sin tab bar), alcanzables desde cualquier pestaña -- por ejemplo,
 * desde Catálogo al tocar "Solicitar" en un servicio.
 */
function AdminRoot() {
  return (
    <AdminStack.Navigator initialRouteName="AdminTabs" screenOptions={screenOptions}>
      <AdminStack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
      <AdminStack.Screen name="Crear" component={CreateScreen} options={{ title: 'Nueva solicitud' }} />
      <AdminStack.Screen name="Detalle" component={DetailScreen} options={{ title: 'Detalle de solicitud' }} />
    </AdminStack.Navigator>
  );
}

/** Stack raíz del CLIENTE: mismo patrón que AdminRoot. */
function ClienteRoot() {
  return (
    <ClienteStack.Navigator initialRouteName="ClienteTabs" screenOptions={screenOptions}>
      <ClienteStack.Screen
        name="ClienteTabs"
        component={ClienteTabs}
        options={{ headerShown: false }}
      />
      <ClienteStack.Screen name="Crear" component={CreateScreen} options={{ title: 'Nueva solicitud' }} />
      <ClienteStack.Screen name="Detalle" component={DetailScreen} options={{ title: 'Detalle de solicitud' }} />
    </ClienteStack.Navigator>
  );
}

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

  return auth.role === 'ADMIN' ? <AdminRoot /> : <ClienteRoot />;
}

export default function App() {
  return (
    <AuthProvider>
      <SolicitudesProvider>
        <PedidosProductoProvider>
          <StatusBar barStyle="light-content" backgroundColor={COLORES.primario} />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PedidosProductoProvider>
      </SolicitudesProvider>
    </AuthProvider>
  );
}
