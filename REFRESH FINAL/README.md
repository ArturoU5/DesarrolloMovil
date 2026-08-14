# RefreshProClean 🧺

Aplicación móvil (**React Native + TypeScript**, con Expo) para la gestión de
**solicitudes de servicio** de una lavandería (RefreshProClean). Permite
registrar, listar, filtrar, actualizar y eliminar solicitudes de atención de
clientes, reemplazando el registro informal por WhatsApp/llamadas.

**Core de negocio elegido:** Lavandería.

> Proyecto académico — Curso **Desarrollo de Aplicaciones Móviles 1**.
>
> **v2 (entrega preliminar):** las solicitudes ahora se persisten
> localmente con **SQLite** (antes vivían solo en memoria con
> `useState`/`useReducer`), y se agregó una pantalla de **Catálogo** que
> consume una **API REST** pública con estados de carga y error, y una
> pantalla de **Perfil**. El modelo de datos (`Usuario`, `Servicio`,
> `Solicitud`) está inspirado en el esquema SQL `RefreshProCleanDB`
> (tablas `Usuarios`, `Servicios`, `Reservas`).

## Integrantes del equipo
- Integrante 1 — (completar nombre y rol)
- Integrante 2 — (completar nombre y rol)
- Integrante 3 — (completar nombre y rol)

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

## Configuración de Firebase (una sola vez, por proyecto)

El login usa **Firebase Authentication** (correo/contraseña) real, así
que hace falta un proyecto de Firebase configurado:

1. Ve a **https://console.firebase.google.com** → crea un proyecto (o
   pide acceso al integrante que ya lo creó).
2. **Authentication → Sign-in method** → habilita **Correo/contraseña**.
3. **Firestore Database** → crea la base en **modo de prueba**.
4. Ve a **Authentication → Users → Add user** y crea la cuenta del
   administrador (correo `admin@refreshproclean.com`, con la
   contraseña que definan como equipo). Ese correo debe coincidir
   exactamente con `ADMIN_EMAIL` en
   `src/infrastructure/firebase/firebaseConfig.ts`.
5. Las credenciales del proyecto (`firebaseConfig`) ya están puestas en
   ese mismo archivo — si crean su propio proyecto de Firebase, hay que
   reemplazarlas por las suyas (Configuración del proyecto → tus apps
   → SDK setup and configuration).

> El **modo de prueba** de Firestore permite lectura/escritura sin
> restricciones durante 30 días — suficiente para esta entrega. Antes
> de un uso real habría que escribir reglas de seguridad propias.

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

1. Abre la app: se muestra la pantalla de **login** con Firebase
   Authentication real (correo y contraseña).

### Como cliente
2. Si es tu primera vez, toca la pestaña **"Crear cuenta"**, completa
   nombre, teléfono, correo y una contraseña (mínimo 6 caracteres) →
   toca **Crear cuenta**. Tu nombre y teléfono se guardan en Cloud
   Firestore (colección `clientes`), asociados a tu cuenta.
3. Las próximas veces, usa **"Iniciar sesión"** con ese mismo correo y
   contraseña.
4. Verás "Mis solicitudes" — al principio vacío, salvo que hayas creado
   alguna antes.
5. Toca **+ Nueva solicitud** para crear una (tu nombre y teléfono ya vienen
   prellenados y bloqueados). Completa dirección, tipo de servicio,
   cantidad de prendas y precio estimado (se autosugiere al elegir el
   servicio, pero puedes editarlo).
6. Toca una solicitud para ver el detalle. Si está en estado **Pendiente**,
   puedes editar la descripción o **cancelarla**. Si ya está "En atención" o
   "Finalizado", esas opciones se ocultan (el cliente ya no puede
   modificarla).
7. Usa **Cerrar sesión** (desde Perfil) para salir y volver al login.

### Como personal (administrador)
8. En "Iniciar sesión", ingresa con la cuenta de administrador
   (correo `admin@refreshproclean.com` — la contraseña la define quien
   creó esa cuenta desde Firebase Console → Authentication → Users →
   Add user). No hay pestaña de registro para el admin: esa cuenta se
   crea una sola vez, directamente en Firebase Console.
9. Verás el listado completo de **todas** las solicitudes de todos los
   clientes, con buscador y filtros por estado.
10. Puedes **crear** solicitudes a nombre de cualquier cliente, ver el
    **detalle**, **cambiar el estado** (Pendiente / En atención /
    Finalizado / Cancelado), **editar** la descripción y **eliminar**
    cualquier solicitud.
11. Usa **Cerrar sesión** desde la pestaña **Perfil**.

> Nota: la autenticación ahora es real, con **Firebase Authentication**
> (correo/contraseña) + **Cloud Firestore** (para guardar nombre y
> teléfono de cada cliente). El rol (ADMIN o CLIENTE) se determina
> automáticamente: si el correo coincide con `ADMIN_EMAIL`
> (`infrastructure/firebase/firebaseConfig.ts`), es ADMIN; cualquier
> otro correo registrado es CLIENTE. La sesión persiste entre reinicios
> de la app (no hay que volver a iniciar sesión cada vez). Las
> solicitudes y compras de productos siguen guardándose aparte, en
> SQLite (local, en el dispositivo).

### Cómo probar la persistencia local (SQLite)

1. Inicia sesión (como cliente o como personal) y crea una solicitud
   nueva.
2. Cierra la app por completo (deslízala fuera de las apps recientes del
   celular, no basta con solo minimizarla).
3. Vuelve a abrir **Expo Go** y entra de nuevo a la app.
4. Inicia sesión otra vez: la solicitud que creaste sigue ahí. Los datos
   viven en un archivo `.db` dentro del almacenamiento de la app
   (`infrastructure/database/db.ts`), no en memoria.

### Cómo probar el catálogo (consumo de API REST)

1. Entra a la pestaña **Catálogo** (disponible tanto para cliente como
   para personal).
2. Toca **Cargar productos**: se dispara una petición `GET` a una API
   pública (Fake Store API) y se muestra un indicador de carga.
3. Si hay conexión, verás la lista de productos con imagen, categoría y
   precio.
4. Para probar el estado de error, activa el modo avión antes de tocar
   "Cargar productos" (o "Actualizar productos"): se mostrará un mensaje
   de error con un botón **Reintentar**.

---

## Arquitectura del proyecto

```
src/
├── domain/
│   └── models/           # Interfaces y tipos: Usuario, Servicio, Solicitud (.ts)
├── infrastructure/
│   ├── database/
│   │   └── db.ts         # Apertura de la BD SQLite + creación del esquema
│   ├── repositories/
│   │   └── solicitudesRepository.ts   # CRUD contra SQLite (todo el SQL vive aquí)
│   ├── api/
│   │   └── catalogoApi.ts             # Consumo GET de la API REST del catálogo
│   ├── context/          # SolicitudesContext (sincroniza SQLite <-> estado) +
│   │                      # AuthContext (login por rol) (.tsx)
│   └── seedData.ts       # Datos semilla (se insertan en SQLite solo la 1ª vez)
├── shared/                # Constantes y validaciones tipadas (.ts)
└── presentation/
    ├── components/        # Card, Chip, InputField, ConfirmDialog (.tsx)
    ├── navigation/        # Tipos de navegación (types.ts)
    └── screens/           # Login, Listado (admin), MisSolicitudes (cliente),
                            # Crear, Detalle, Catalogo, Perfil (.tsx)
App.tsx                    # Navegación: Auth (sin sesión) -> Tabs (ADMIN / CLIENTE)
```

Estructura basada en Clean Architecture:
- **`presentation/`**: pantallas, componentes y navegación (sin lógica de negocio).
- **`domain/`**: modelos, entidades y reglas de negocio.
- **`infrastructure/`**: acceso a datos (SQLite, API REST), Context y reducers.
  - `database/` + `repositories/`: toda la persistencia local (SQLite).
  - `api/`: todo el consumo de servicios externos (REST).
- **`shared/`**: utilidades, constantes y validaciones.

### Persistencia y consumo de datos

- **Solicitudes → SQLite** (`infrastructure/database`, `infrastructure/repositories`):
  reemplaza el almacenamiento en memoria de la v1. El `SolicitudesContext`
  ya no guarda el estado "real", solo una caché en memoria que se
  sincroniza con la base de datos en cada creación/edición/eliminación,
  y se vuelve a leer de SQLite cada vez que arranca la app.
- **Catálogo → API REST** (`infrastructure/api/catalogoApi.ts`): un `fetch`
  simple a una API pública (Fake Store API), sin guardarse en SQLite,
  usado solo como catálogo de referencia (productos/insumos sugeridos).
- **Servicios y usuarios**: se mantienen como datos semilla en memoria
  (`seedData.ts`), ya que no forman parte del CRUD principal exigido por
  esta entrega; solo las solicitudes necesitan persistencia real.

Todo el proyecto está escrito en **TypeScript** (`.ts` / `.tsx`), con
interfaces para cada modelo de datos (`Usuario`, `Servicio`, `Solicitud`),
tipos union para `Estado` y `Prioridad`, y navegación tipada con
`NativeStackScreenProps`.

## Hooks utilizados
- `useState`: manejo de formularios (crear/editar), login/registro, filtros
  de búsqueda y estados de carga/error del catálogo REST.
- `useEffect`: carga inicial de solicitudes desde SQLite al montar la app,
  y suscripción a `onAuthStateChanged` de Firebase para mantener la sesión.
- `useReducer` + `useContext`: caché en memoria de las solicitudes y de las
  compras, sincronizada con SQLite en cada operación (CRUD) a nivel de toda
  la app.
- `useCallback` / `useMemo`: memorización de funciones de acceso a datos y
  de cálculos derivados (conteo de solicitudes por estado).

## Estados de una solicitud
`PENDIENTE` → `EN_ATENCION` → `FINALIZADO`, o `CANCELADO` en cualquier
punto anterior a `FINALIZADO`. El cliente solo puede pasar su propia
solicitud a `CANCELADO` (no elimina el registro); el personal puede
cambiar a cualquier estado o eliminar en forma permanente.

## Notas
- El esquema SQL `SQLServerLavanderia.sql` se usó únicamente como referencia
  del modelo de datos (campos y relaciones).
- **v1 → v2**: la persistencia pasó de memoria (`useState`/`useReducer`) a
  **SQLite** (`expo-sqlite`), y se agregó consumo de una **API REST**
  pública (Fake Store API) para la pantalla de Catálogo, además de una
  pantalla de Perfil. La navegación se reorganizó con **tabs**
  (`@react-navigation/bottom-tabs`) para dar acceso directo a Solicitudes,
  Catálogo y Perfil.
- **v2 → v3**: el catálogo ahora también ofrece **servicios** (con botón
  "Solicitar" que abre el formulario de solicitud) y **compra de
  productos** (guardada en SQLite, tabla `pedidos_productos`, visible en
  Perfil). El login pasó de ser simulado a **Firebase Authentication**
  real (correo/contraseña) + **Cloud Firestore** para el perfil de cada
  cliente.
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

## Cómo generar un instalable (APK) más adelante (opcional)
Si en algún momento necesitan un `.apk` para instalar sin Expo Go (por
ejemplo, para la entrega final si el docente lo pide en ese formato), pueden
usar EAS Build:
```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```
Esto no es necesario para el desarrollo ni para las demostraciones en clase.
