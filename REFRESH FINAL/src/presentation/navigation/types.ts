/**
 * Tipos de navegación para React Navigation con TypeScript.
 *
 * Estructura de navegación (por rol):
 *   RootStack (Native Stack)
 *     ├── Tabs (Bottom Tabs: Solicitudes/MisSolicitudes, Catálogo, Perfil)
 *     ├── Crear   (pantalla completa, encima de las pestañas)
 *     └── Detalle (pantalla completa, encima de las pestañas)
 *
 * Crear/Detalle viven en el stack raíz (no dentro de una pestaña) para
 * poder navegar a ellas desde cualquier pestaña (por ejemplo, desde
 * "Catálogo" al tocar "Solicitar" en un servicio).
 */

export type AdminStackParamList = {
  AdminTabs: undefined;
  Crear: { servicioId?: string } | undefined;
  Detalle: { id: string };
};

export type ClienteStackParamList = {
  ClienteTabs: undefined;
  Crear: { servicioId?: string } | undefined;
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
