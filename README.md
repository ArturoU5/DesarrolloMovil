# RefreshProClean 🧺

Aplicación móvil (React Native) para la gestión de **solicitudes de servicio** de una
lavandería (RefreshProClean). Permite registrar, listar, filtrar, actualizar y
eliminar solicitudes de atención de clientes, reemplazando el registro informal
por WhatsApp/llamadas.

> Proyecto académico — Evaluación parcial del curso **Desarrollo de Aplicaciones
> Móviles 1**. No usa base de datos real: todo el CRUD se simula en memoria con
> `useState`, `useReducer` y `Context API`. El modelo de datos (`Usuario`,
> `Servicio`, `Solicitud`) está inspirado en el esquema SQL `RefreshProCleanDB`
> (tablas `Usuarios`, `Servicios`, `Reservas`).

## Integrantes del equipo

- Guillermo Arturo Ugaz Montesinos
- ⁠Omar Alexander Córdova Pintado
- Marco Antonio Suarez Siesquen

## Requisitos previos

- Node.js 18 o superior
- npm
- La app **Expo Go** instalada en tu celular (Android o iOS) — disponible
  gratis en Play Store / App Store
- Tu celular y tu computadora conectados a la **misma red Wi-Fi**

> Este proyecto usa **Expo**, por lo que **no necesitas** instalar Android
> Studio, Android SDK, ni configurar variables de entorno (ANDROID_HOME,
> JDK, etc.) para probarlo. Cada integrante del equipo solo necesita Node.js
> y la app Expo Go en su celular.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npx expo start
```

Esto abre un panel en la terminal con un **código QR**.

- **Android**: abre la app Expo Go en tu celular y escanea el código QR.
- **iOS**: abre la app de Cámara y escanea el código QR (te ofrecerá abrir
  Expo Go automáticamente).

La app se instalará y ejecutará en tu celular en unos segundos, sin
necesidad de compilar nada de forma nativa.

## Cómo probar el flujo CRUD

1. Abre la app: se muestra la pantalla de **login** con dos pestañas: "Soy
   cliente" y "Soy personal".

### Como cliente

2. En la pestaña "Soy cliente", ingresa un nombre y un teléfono cualquiera
   (no hay contraseña) → toca **Ingresar como cliente**.
3. Verás "Mis solicitudes" — al principio vacío, salvo que uses el mismo
   teléfono que alguna de las solicitudes de ejemplo (ver `seedData.js`:
   `912345678`, `923456789`, `934567890`).
4. Toca **+ Nueva solicitud** para crear una (tu nombre y teléfono ya vienen
   prellenados y bloqueados).
5. Toca una solicitud para ver el detalle. Si está en estado **Pendiente**,
   puedes editar la descripción o **cancelarla**. Si ya está "En atención" o
   "Finalizado", esas opciones se ocultan (el cliente ya no puede modificarla).
6. Usa **Salir** para cerrar sesión y volver al login.

### Como personal (administrador)

7. En la pestaña "Soy personal", ingresa la contraseña de prueba
   `admin123` → toca **Ingresar como administrador**.
8. Verás el listado completo de **todas** las solicitudes de todos los
   clientes, con buscador y filtros por estado.
9. Puedes **crear** solicitudes a nombre de cualquier cliente, ver el
   **detalle**, **cambiar el estado** (Pendiente / En atención /
   Finalizado), **editar** la descripción y **eliminar** cualquier
   solicitud.
10. Usa **Salir** para cerrar sesión y volver al login.

> Nota: la autenticación es solo para fines de la demostración académica —
> no hay contraseñas por cliente ni backend real. El rol se guarda en
> memoria (`AuthContext`) mientras la app está abierta.

## Arquitectura del proyecto

```
src/
├── models/       # Estructuras de datos: Usuario, Servicio, Solicitud
├── data/         # Datos semilla en memoria (equivalentes a las tablas del SQL)
├── context/      # SolicitudesContext (CRUD) + AuthContext (login por rol)
├── utils/        # Constantes de UI y funciones de validación de formularios
├── components/   # Componentes reutilizables: Card, Chip, InputField, ConfirmDialog
└── screens/      # Login, Listado (admin), MisSolicitudes (cliente), Crear, Detalle
App.js            # Navegación condicional según rol (sin sesión / ADMIN / CLIENTE)
```

- **Presentación**: `screens/` y `components/` (sin lógica de negocio).
- **Estado / "servicios"**: `context/SolicitudesContext.js` centraliza el CRUD.
- **Datos**: `models/` y `data/seedData.js` (sin conexión a base de datos real).

## Hooks utilizados

- `useState`: manejo de formularios (crear/editar) y filtros de búsqueda.
- `useEffect`: simula la carga inicial de datos al entrar al listado.
- `useReducer` + `useContext`: CRUD de solicitudes en memoria a nivel de toda la app.

## Notas

- El esquema SQL `SQLServerLavanderia.sql` se usó únicamente como referencia
  del modelo de datos (campos y relaciones); la app **no** se conecta a SQL
  Server ni a ninguna base de datos, tal como exige la rúbrica.
- Se eligió **Expo** (en vez de React Native CLI puro / "bare") para que
  todo el equipo pueda ejecutar y probar la app en sus propios celulares sin
  necesidad de configurar Android Studio, SDK o emuladores en cada máquina.
  Sigue siendo 100% React Native: los componentes, hooks y estructura del
  proyecto son los mismos que exige la rúbrica.
