# RefreshProClean 🧺

Aplicación móvil (**React Native + TypeScript**, con Expo) para la gestión de
**solicitudes de servicio** de una lavandería (RefreshProClean). Permite
registrar, listar, filtrar, actualizar y eliminar solicitudes de atención de
clientes, reemplazando el registro informal por WhatsApp/llamadas.

**Core de negocio elegido:** Lavandería.

> Proyecto académico — Evaluación parcial del curso **Desarrollo de
> Aplicaciones Móviles 1**. No usa base de datos real: todo el CRUD se
> simula en memoria con `useState`, `useReducer` y `Context API`. El modelo
> de datos (`Usuario`, `Servicio`, `Solicitud`) está inspirado en el esquema
> SQL `RefreshProCleanDB` (tablas `Usuarios`, `Servicios`, `Reservas`).

## Integrantes del equipo
- Guillermo Arturo Ugaz Montesinos
- ⁠Omar Alexander Córdova Pintado
- Marco Antonio Suarez Siesquen

---

## ⚠️ Leer antes de empezar (para evitar problemas comunes)

Si sigues estos 4 puntos desde el principio, la instalación toma 10-15
minutos sin sobresaltos. Si los ignoras, es probable que te encuentres con
los mismos errores que ya resolvimos durante el desarrollo:

1. **Necesitas al menos 10-15 GB libres en tu disco `C:`.** Con menos de
   eso, `npm install` puede fallar a mitad de camino de forma impredecible
   (errores de red tipo `ECONNRESET`, archivos corruptos, etc.). Verifícalo
   en el Explorador de Windows antes de instalar nada.
2. **Clona/descarga el proyecto en una ruta SIN espacios en el nombre de
   las carpetas.** Por ejemplo usa `C:\Proyectos\RefreshProCleanApp`, y
   evita rutas como `C:\Users\Nombre Con Espacio\Desktop\...`. Si tu usuario
   de Windows tiene espacio en el nombre (ej. "Windows 11"), no lo cambies —
   simplemente coloca el proyecto directamente en `C:\Proyectos\` en vez del
   Escritorio.
3. **No necesitas Android Studio, SDK, ni emulador para probar la app.**
   Solo necesitas Node.js y la app **Expo Go** en tu celular. (Android
   Studio solo hace falta si además quieres usar un emulador en la PC en
   vez de tu celular — es opcional, ver sección al final).
4. **Usa siempre PowerShell** (no CMD) para los comandos de este README. En
   Windows, PowerShell es la terminal por defecto en Android Studio y en la
   mayoría de instalaciones recientes; si abres "Símbolo del sistema" (CMD)
   en vez de PowerShell, algunos comandos como `Remove-Item` no funcionarán
   (usarías `del`/`rmdir` en su lugar).

---

## Requisitos previos
- **Node.js 18 o superior** — verifica con `node -v` en una terminal. Si da
  error, descárgalo de https://nodejs.org (versión LTS) e instálalo.
- **npm** (viene incluido con Node.js).
- La app **Expo Go** instalada en tu celular (Android o iOS) — disponible
  gratis en Play Store / App Store.
- Tu celular y tu computadora conectados a la **misma red Wi-Fi** (si tu
  red bloquea la conexión directa, más abajo hay una alternativa con
  "modo túnel").

## Instalación paso a paso

**1. Descarga/descomprime el proyecto** en una ruta sin espacios, por
ejemplo:
```
C:\Proyectos\RefreshProCleanApp
```

**2. Abre PowerShell y entra a esa carpeta:**
```powershell
cd C:\Proyectos\RefreshProCleanApp
```

**3. Instala las dependencias:**
```powershell
npm install
```
Esto puede tardar 1-3 minutos. Si te sale un error de red (`ECONNRESET`),
simplemente vuelve a correr `npm install` — casi siempre es un corte
momentáneo de conexión.

**3.1 (Opcional) Verifica que TypeScript compile sin errores:**
```powershell
npm run typecheck
```
No debería mostrar ningún error. Si lo hace, avisa al resto del equipo antes
de seguir para no arrastrar el problema.

## Ejecución

**4. Inicia el proyecto:**
```powershell
npx expo start
```
Esto muestra un **código QR** en la terminal.

**5. Abre la app Expo Go en tu celular** y escanea el código QR:
- **Android**: dentro de Expo Go, botón "Scan QR code".
- **iOS**: abre la app de Cámara y escanea el código (te ofrecerá abrir
  Expo Go automáticamente).

La app se instalará y ejecutará en tu celular en unos segundos, sin
necesidad de compilar nada de forma nativa.

### Si el celular se queda cargando o da "Failed to download remote update"

Esto pasa cuando la red Wi-Fi no permite la conexión directa entre tu
celular y tu PC (común en redes de universidades, oficinas, o routers con
"aislamiento de clientes"). Solución: usa el modo túnel:
```powershell
npx expo start --tunnel
```
La primera vez te pedirá instalar un paquete adicional (`@expo/ngrok`) —
acepta con `y`. Tarda un poco más en iniciar, pero funciona incluso si el
celular está en otra red o en datos móviles.

---

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
   "Finalizado", esas opciones se ocultan (el cliente ya no puede
   modificarla).
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

---

## Arquitectura del proyecto

```
src/
├── domain/
│   └── models/       # Interfaces y tipos: Usuario, Servicio, Solicitud (.ts)
├── infrastructure/
│   ├── context/      # SolicitudesContext (CRUD) + AuthContext (login por rol) (.tsx)
│   └── seedData.ts   # Datos semilla en memoria (equivalentes a las tablas del SQL)
├── shared/           # Constantes y validaciones tipadas (.ts)
└── presentation/
    ├── components/   # Componentes reutilizables: Card, Chip, InputField, ConfirmDialog (.tsx)
    ├── navigation/    # Tipos de navegación (types.ts)
    └── screens/      # Login, Listado (admin), MisSolicitudes (cliente), Crear, Detalle (.tsx)
App.tsx                # Navegación condicional según rol (sin sesión / ADMIN / CLIENTE)
```

Estructura basada en Clean Architecture:
- **`presentation/`**: pantallas, componentes y navegación (sin lógica de negocio).
- **`domain/`**: modelos, entidades y reglas de negocio.
- **`infrastructure/`**: Context, reducer y datos en memoria (sin base de datos real).
- **`shared/`**: utilidades, constantes y validaciones.

Todo el proyecto está escrito en **TypeScript** (`.ts` / `.tsx`), con
interfaces para cada modelo de datos (`Usuario`, `Servicio`, `Solicitud`),
tipos union para `Estado` y `Prioridad`, y navegación tipada con
`NativeStackScreenProps`.

## Hooks utilizados
- `useState`: manejo de formularios (crear/editar), login y filtros de búsqueda.
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

---

## Solución de problemas comunes

| Error | Causa | Solución |
|---|---|---|
| `ECONNRESET` durante `npm install` | Corte de red momentáneo, o poco espacio en disco | Verifica que tengas 10+ GB libres, y vuelve a correr `npm install` |
| `Project is incompatible with this version of Expo Go` | La versión de Expo Go de tu celular no coincide con la del proyecto | Corre `npx expo install expo@latest` y luego `npx expo install --fix` |
| `Failed to download remote update` / se queda cargando en el celular | Problema de red local (Wi-Fi bloquea la conexión) | Usa `npx expo start --tunnel` |
| `Cannot read properties of undefined (reading 'transformFile')` | Ruta del proyecto con espacios en el nombre de alguna carpeta | Mueve el proyecto a una ruta sin espacios, ej. `C:\Proyectos\RefreshProCleanApp` |
| `Cannot find module 'babel-preset-expo'` | Falta esa dependencia | Corre `npm install --save-dev babel-preset-expo` |
| El emulador de Android Studio no inicia / error de espacio | Poco espacio en disco | Libera espacio (mínimo 10-15 GB) antes de abrir el emulador |
| Cualquier otro error raro después de reinstalar | Caché corrupta de una instalación anterior | Borra `node_modules` y la carpeta `.expo`, y vuelve a correr `npm install` |

Comandos de limpieza completa (si algo se ve raro y no sabes por qué):
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
npm install
npx expo start -c
```

---

## Alternativa: usar un emulador de Android en vez del celular (opcional)

No es necesario, pero si prefieres probar en un emulador en tu PC en vez de
tu celular:

1. Instala **Android Studio** y crea un emulador desde `Device Manager`
   (necesitas 10+ GB libres para que el emulador funcione bien).
2. Inicia el emulador (▶️) y espera que cargue completamente.
3. Con `npx expo start` corriendo, presiona la tecla `a` en la terminal —
   Expo detecta el emulador abierto y ejecuta la app ahí automáticamente.

