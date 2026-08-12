
# RefreshProClean — DesarrolloMovil 🧺

Proyecto académico del curso **Desarrollo de Aplicaciones Móviles**, compuesto
por dos partes ubicadas en ramas distintas del repositorio:

| Rama | Carpeta | Contenido |
|---|---|---|
| `BackEnd` | raíz del repo | API REST en **ASP.NET Core (.NET 10)** con Entity Framework Core y SQL Server |
| `FrontEnd` | `REFRESH FINAL/` | App móvil en **React Native + TypeScript (Expo)**, con persistencia local en **SQLite** y consumo de una **API REST** pública |

El caso de negocio elegido es una **lavandería (RefreshProClean)**: la app
permite registrar, listar, filtrar, actualizar y eliminar solicitudes de
servicio de los clientes, reemplazando el registro informal por
WhatsApp/llamadas.

> ⚠️ **Nota importante sobre Firebase:** en el estado actual del código de
> ambas ramas (`BackEnd` y `REFRESH FINAL` en `FrontEnd`) **no existe
> integración con Firebase** (ni Authentication ni Firestore/Realtime
> Database). El login se implementa con un `AuthContext` propio en memoria
> (React) y la persistencia real de datos usa **SQLite** en el cliente y
> **SQL Server** en el backend. Este README documenta el proyecto tal como
> está implementado; si el equipo agrega Firebase más adelante, esta
> sección debe actualizarse con los pasos de configuración reales.

---

## 1. Requisitos

### Backend (rama `BackEnd`)
- **.NET SDK 10.0** o superior.
- **SQL Server** (Express, Developer o LocalDB) accesible localmente.
- Editor recomendado: Visual Studio 2022 o VS Code con la extensión de C#.

### Frontend (rama `FrontEnd`, carpeta `REFRESH FINAL`)
- **Node.js 18 o superior** (`node -v` para verificar).
- **npm** (incluido con Node.js).
- App **Expo Go** instalada en un celular Android o iOS (gratis en
  Play Store / App Store), o **Android Studio** si se prefiere emulador.
- Celular y computadora en la **misma red Wi-Fi** (o usar el modo túnel de
  Expo, explicado más abajo).
- Al menos 10-15 GB libres en disco para que `npm install` y el emulador (si
  se usa) funcionen sin errores.

---

## 2. Instalación

### 2.1 Backend
```bash
# Clonar el repositorio y cambiar a la rama de backend
git clone https://github.com/ArturoU5/DesarrolloMovil.git
cd DesarrolloMovil
git checkout BackEnd

# Restaurar dependencias NuGet
dotnet restore

# Aplicar/crear la base de datos con Entity Framework Core
dotnet ef database update
```

### 2.2 Frontend
```bash
# Desde la raíz del repo, cambiar a la rama de frontend
git checkout FrontEnd
cd "REFRESH FINAL"

# Instalar dependencias
npm install

# (Opcional) Verificar que TypeScript compile sin errores
npm run typecheck
```

> Recomendación: descarga/clona el proyecto en una ruta **sin espacios** en
> el nombre de las carpetas (ej. `C:\Proyectos\DesarrolloMovil`), ya que
> rutas con espacios pueden causar errores de Metro Bundler.

---

## 3. Configuración de Firebase

**Este proyecto no utiliza Firebase.** No hay archivo `google-services.json`,
`GoogleService-Info.plist` ni dependencias de `firebase`/`@react-native-firebase`
en `package.json`. Los servicios que en otros proyectos suelen cubrirse con
Firebase están resueltos así:

| Necesidad | Cómo se resuelve en este proyecto |
|---|---|
| Autenticación / login | `AuthContext` propio (React Context + `useState`), en memoria, con dos roles: ADMIN (contraseña fija) y CLIENTE (nombre + teléfono) |
| Base de datos en la nube (Firestore / Realtime DB) | No implementada. La persistencia real es **SQLite local** (cliente) y **SQL Server** (backend), no sincronizadas entre sí en esta entrega |
| Backend / API | ASP.NET Core Web API propio, sobre SQL Server |

Si en una entrega futura se integra Firebase, esta sección debería incluir:
la creación del proyecto en Firebase Console, la descarga de
`google-services.json`/`GoogleService-Info.plist`, la instalación de los
paquetes `firebase`/`@react-native-firebase/app` y el código de
inicialización correspondiente.

---

## 4. Cómo ejecutar el proyecto

### 4.1 Ejecutar el backend
```bash
cd DesarrolloMovil        # rama BackEnd
dotnet run
```
- La API queda disponible en la URL indicada en la consola (por defecto algo
  como `http://localhost:5196`, ver `Properties/launchSettings.json`).
- El archivo `lavanderia.http` incluido en el proyecto sirve para probar
  peticiones rápidas desde VS Code/Visual Studio (extensión REST Client).

### 4.2 Ejecutar el frontend
```bash
cd "REFRESH FINAL"        # rama FrontEnd
npx expo start
```
- Se muestra un **código QR** en la terminal.
- Abre **Expo Go** en el celular y escanea el código (Android: botón "Scan
  QR code" dentro de Expo Go; iOS: app Cámara).
- Si el celular se queda cargando o muestra `Failed to download remote
  update` (común en redes con aislamiento de clientes, típico de
  universidades/oficinas), usa el modo túnel:
  ```bash
  npx expo start --tunnel
  ```
- Alternativa con emulador de Android: abre el emulador desde Android
  Studio y, con `npx expo start` corriendo, presiona `a` en la terminal.

> En esta entrega, la app móvil **no consume el backend .NET**: la pantalla
> de Catálogo consume una API REST pública externa (Fake Store API) y las
> Solicitudes se guardan en SQLite local. El backend ASP.NET Core es un
> proyecto independiente con su propio modelo de datos (`Usuarios`,
> `Servicios`, `Reservas`) pensado como referencia/entregable de backend.

---

## 5. Cómo probar el login

La app abre en la pantalla de **Login**, con dos pestañas:

- **Soy cliente**: ingresa un nombre y un teléfono válido (6 a 9 dígitos,
  sin contraseña) y toca **Ingresar como cliente**.
- **Soy personal**: ingresa la contraseña de prueba `admin123` y toca
  **Ingresar como administrador**.

El rol autenticado se guarda en memoria (`AuthContext`) mientras la app está
abierta; al cerrar sesión (**Salir**) se vuelve a la pantalla de login. No
hay backend de autenticación real ni contraseñas por cliente: es una
autenticación simplificada con fines académicos.

---

## 6. Cómo probar el CRUD

El CRUD principal es el de **Solicitudes de servicio**, disponible según el
rol:

**Como cliente:**
1. Inicia sesión como cliente.
2. Verás "Mis solicitudes" (vacío salvo que uses uno de los teléfonos de
   ejemplo de `seedData.ts`: `912345678`, `923456789`, `934567890`).
3. Toca **+ Nueva solicitud** (Create) para crear una.
4. Toca una solicitud para ver el **detalle** (Read); si está en estado
   *Pendiente* puedes editar la descripción (Update) o cancelarla.

**Como personal (administrador):**
1. Inicia sesión con la contraseña `admin123`.
2. Verás el listado completo de todas las solicitudes, con buscador y
   filtros por estado (Read/List).
3. Puedes **crear** solicitudes a nombre de cualquier cliente (Create),
   ver el **detalle**, **cambiar el estado** y **editar** la descripción
   (Update), y **eliminar** cualquier solicitud (Delete).

El backend ASP.NET Core expone además su propio CRUD (independiente del de
la app móvil) sobre `Usuarios`, `Servicios` y `Reservas`, mediante los
endpoints descritos en la sección siguiente.

### Endpoints del backend (CRUD vía API REST)
| Recurso | Método | Ruta | Acción |
|---|---|---|---|
| Usuarios | GET | `/api/usuarios` | Listar (filtro opcional `activo`) |
| Usuarios | GET | `/api/usuarios/{id}` | Obtener detalle |
| Usuarios | GET | `/api/usuarios/buscar?texto=` | Buscar |
| Usuarios | POST | `/api/usuarios` | Crear |
| Usuarios | PUT | `/api/usuarios/{id}` | Actualizar |
| Usuarios | DELETE | `/api/usuarios/{id}` | Eliminar |
| Servicios | GET/POST/PUT/DELETE | `/api/servicios[...]` | Igual patrón que Usuarios |
| Reservas | GET/POST/PUT/DELETE | `/api/reservas[...]` | Igual patrón, incluye filtro por `estado` |

Se pueden probar con el archivo `lavanderia.http`, con Postman/Insomnia, o
con `curl`.

---

## 7. Cómo probar SQLite

La persistencia local de las **Solicitudes** (y de los **Pedidos de
producto** del catálogo) vive en SQLite, mediante `expo-sqlite`
(`src/infrastructure/database/db.ts` y
`src/infrastructure/repositories/`).

1. Inicia sesión (como cliente o como personal) y crea una solicitud nueva.
2. Cierra la app **por completo** (deslízala fuera de las apps recientes
   del celular; no basta con minimizarla).
3. Vuelve a abrir Expo Go y entra de nuevo a la app.
4. Inicia sesión otra vez: la solicitud creada sigue ahí, confirmando que
   los datos persisten en el archivo `refreshproclean.db` del
   almacenamiento de la app, y no solo en memoria.

Esquema principal creado en `db.ts`:
- Tabla `solicitudes` (id, clienteNombre, telefono, direccion, servicioId,
  usuarioId, cantidadPrendas, precio, prioridad, descripcion, estado,
  fechaRegistro, fechaReserva).
- Tabla `pedidos_productos` (id, clienteNombre, telefono, productoId,
  productoTitulo, productoImagen, categoria, precioUnitario, cantidad,
  estado, fechaRegistro).

---

## 8. Cómo probar el consumo de API REST

La pantalla **Catálogo** (`src/presentation/screens/CatalogScreen.tsx`,
lógica en `src/infrastructure/api/catalogoApi.ts`) consume la **Fake Store
API** pública (`https://fakestoreapi.com/products`), filtrando solo ropa de
hombre y mujer, y agrega un catálogo local de insumos de lavandería
(detergentes, suavizantes, etc.).

1. Entra a la pestaña **Catálogo** (disponible para cliente y personal).
2. Toca **Cargar productos**: se dispara un `GET` real a la API pública y se
   muestra un indicador de carga.
3. Con conexión a internet, se listan los productos con imagen, categoría y
   precio.
4. Para probar el **estado de error**: activa el modo avión antes de tocar
   "Cargar productos" (o "Actualizar productos"). Debe aparecer un mensaje
   de error con botón **Reintentar**.

---

## 9. Cómo probar Firestore o Realtime Database

**No aplica.** Como se indicó en la sección 3, este proyecto no integra
Firestore ni Realtime Database en su estado actual. La única base de datos
en la nube/servidor es **SQL Server**, consumida por el backend ASP.NET
Core (no directamente por la app móvil en esta entrega). Los pasos para
probar esa capa son los mismos del CRUD del backend descritos en la
sección 6.

---

## 10. Cómo generar APK/AAB o ejecutar en dispositivo/emulador

### Ejecutar en dispositivo físico (recomendado para desarrollo)
No requiere Android Studio ni SDK: solo Node.js y la app Expo Go.
```bash
npx expo start
```
Escanea el código QR con Expo Go (Android) o la Cámara (iOS).

### Ejecutar en emulador Android
1. Instala Android Studio y crea un emulador desde `Device Manager`.
2. Inicia el emulador y espera a que cargue por completo.
3. Con `npx expo start` corriendo, presiona `a` en la terminal.

### Generar un instalable APK/AAB (build nativo)
El proyecto incluye la carpeta nativa `android/` (generada con Expo
prebuild), por lo que puede compilarse de forma nativa con Gradle, o usando
EAS Build (recomendado por el propio README original del frontend):
```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview   # genera un APK de prueba
# eas build -p android --profile production  # genera un AAB para Play Store
```
Alternativamente, de forma local con Gradle (dentro de `android/`):
```bash
./gradlew assembleDebug     # genera un APK de depuración
```

### Publicar el backend
Para ejecutar el backend fuera de modo desarrollo:
```bash
dotnet publish -c Release
```
El resultado puede desplegarse en IIS, un contenedor Docker o cualquier
hosting compatible con ASP.NET Core.

---

## 11. Arquitectura y tecnologías

```
Backend (rama BackEnd)              Frontend (rama FrontEnd / REFRESH FINAL)
------------------------            -------------------------------------------
ASP.NET Core Web API (.NET 10)      React Native + TypeScript (Expo 54)
Entity Framework Core               React Navigation (stack + bottom tabs)
SQL Server (RefreshProCleanDB)      SQLite local (expo-sqlite)
Controllers: Usuarios, Servicios,   Consumo de API REST pública (Fake Store)
             Reservas               Clean Architecture: domain / infrastructure
                                     / presentation / shared
```

## 12. Solución de problemas comunes (frontend)

| Error | Causa | Solución |
|---|---|---|
| `ECONNRESET` durante `npm install` | Corte de red o poco espacio en disco | Verifica 10+ GB libres y repite `npm install` |
| `Project is incompatible with this version of Expo Go` | Versión de Expo Go desactualizada | `npx expo install expo@latest` y luego `npx expo install --fix` |
| `Failed to download remote update` | Wi-Fi bloquea la conexión directa | `npx expo start --tunnel` |
| `Cannot read properties of undefined (reading 'transformFile')` | Ruta del proyecto con espacios | Mover el proyecto a una ruta sin espacios |
| `Cannot find module 'babel-preset-expo'` | Falta dependencia | `npm install --save-dev babel-preset-expo` |

Limpieza completa si algo falla sin causa clara:
```bash
rm -rf node_modules .expo
npm install
npx expo start -c
```

## Integrantes del equipo
- Guillermo Arturo Ugaz Montesinos
- Omar Alexander Córdova Pintado
- Marco Antonio Suarez Siesquen
