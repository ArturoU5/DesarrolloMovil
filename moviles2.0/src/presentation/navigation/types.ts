/**
 * Tipos de navegación para React Navigation con TypeScript.
 * Se definen las rutas y los parámetros que recibe cada una.
 *
 * Estructura de navegación:
 * - AuthStack: Login (sin sesión)
 * - AdminTabs: tabs de "Solicitudes" (stack interno), "Catálogo" y "Perfil"
 * - ClienteTabs: tabs de "Mis solicitudes" (stack interno), "Catálogo" y "Perfil"
 */

export type AdminStackParamList = {
  Listado: undefined;
  Crear: undefined;
  Detalle: { id: string };
};

export type ClienteStackParamList = {
  MisSolicitudes: undefined;
  Crear: undefined;
  Detalle: { id: string };
};

export type AdminTabParamList = {
  SolicitudesTab: undefined;
  CatalogoTab: undefined;
  PerfilTab: undefined;
};

export type ClienteTabParamList = {
  MisSolicitudesTab: undefined;
  CatalogoTab: undefined;
  PerfilTab: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};
