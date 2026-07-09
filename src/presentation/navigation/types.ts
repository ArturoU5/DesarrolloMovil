/**
 * Tipos de navegación para React Navigation con TypeScript.
 * Se definen las rutas y los parámetros que recibe cada una.
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

export type AuthStackParamList = {
  Login: undefined;
};
