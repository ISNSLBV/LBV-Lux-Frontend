# 🎓 LUX Frontend - Sistema de Gestión Educativa

Interfaz web moderna y responsive del sistema de gestión educativa LUX, desarrollada para el Instituto Superior Nuestra Señora de Luján del Buen Viaje.

## ✨ Características

- 🎨 **Interfaz Moderna** con Material-UI
- 📱 **Diseño Responsive** adaptado a todos los dispositivos
- 🔐 **Autenticación Segura** con JWT
- 👥 **Roles Diferenciados** (admin, alumno, usuario)
- 📊 **Dashboard Interactivo** con gráficos en tiempo real
- 📝 **Formularios Validados** con Formik y Yup
- 🔄 **Estado del Servidor** gestionado con TanStack Query
- 🎯 **Enrutamiento** con React Router v7
- 🔔 **Notificaciones** elegantes con React Toastify
- ⚡ **Rendimiento Optimizado** con Vite

## 🛠️ Stack Tecnológico

- **React** v19.1 - Biblioteca de UI
- **Vite** v6.3 - Build tool ultra-rápido
- **Material-UI** v7.1 - Componentes de diseño
- **React Router** v7.6 - Enrutamiento
- **TanStack Query** v5.82 - Gestión de estado del servidor
- **Formik** - Manejo de formularios
- **Yup** - Validación de esquemas
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos y visualizaciones
- **React Toastify** - Notificaciones
- **React DatePicker** - Selector de fechas
- **Lucide React** - Iconos modernos
- **JWT Decode** - Decodificación de tokens

## 📋 Requisitos Previos

- Node.js v18 o superior
- npm o yarn
- Backend de LUX corriendo (ver [lux-backend](https://github.com/guzgoldman/lux-backend))

## 🚀 Instalación Local

### 1. Cloná el repositorio

```bash
git clone https://github.com/guzgoldman/lux-frontend.git
cd lux-frontend
```

### 2. Instalá las dependencias

```bash
npm install
```

### 3. Configurá las variables de entorno

Creá un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
```

Para diferentes entornos, podés crear:
- `.env.development` - Para desarrollo
- `.env.production` - Para producción
- `.env.local` - Configuración local (no se sube a git)

### 4. Iniciá el servidor de desarrollo

```bash
npm run dev
```

La aplicación va a estar disponible en `http://localhost:5173`

### 5. Abrí tu navegador

Andá a `http://localhost:5173` y deberías ver la aplicación funcionando.

## 🏗️ Build para Producción

```bash
# Generar build de producción
npm run build

# Preview del build localmente
npm run preview
```

Los archivos estáticos van a estar en la carpeta `dist/`

## 🐳 Docker

### Construir y ejecutar con Docker

```bash
# Construí la imagen
docker build -t lux-frontend .

# Ejecutá el contenedor
docker run -d \
  --name lux-frontend \
  -p 80:80 \
  lux-frontend
```

La aplicación va a estar disponible en `http://localhost`

### Docker Compose

Si querés ejecutar frontend y backend juntos, creá un `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:3000/api

  backend:
    image: lux-backend:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

## 📦 Despliegue en Producción

### Opción 1: Servidor Web (Nginx/Apache)

```bash
# 1. Generá el build
npm run build

# 2. Copiá los archivos de dist/ a tu servidor web
scp -r dist/* usuario@servidor:/var/www/lux

# 3. Configurá Nginx
```

**Configuración de Nginx:**

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    root /var/www/lux;
    index index.html;

    # Para que funcione el SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cachear archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy al backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Opción 2: Plataformas de Hosting

#### Vercel

```bash
# Instalá Vercel CLI
npm i -g vercel

# Desplegá
vercel
```

#### Netlify

```bash
# Instalá Netlify CLI
npm i -g netlify-cli

# Desplegá
netlify deploy --prod
```

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📚 Estructura del Proyecto

```
lux-frontend/
├── public/                  # Archivos estáticos
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── api/                # Configuración de API y requests
│   │   ├── axios.js       # Instancia configurada de Axios
│   │   ├── auth.api.js    # Endpoints de autenticación
│   │   ├── users.api.js   # Endpoints de usuarios
│   │   └── alumnos.api.js # Endpoints de alumnos
│   ├── components/         # Componentes reutilizables
│   │   ├── Layout/        # Layout principal
│   │   ├── Sidebar/       # Barra lateral
│   │   ├── Navbar/        # Barra de navegación
│   │   ├── Forms/         # Componentes de formularios
│   │   └── Cards/         # Tarjetas
│   ├── contexts/          # Contextos de React
│   │   └── AuthContext.jsx # Contexto de autenticación
│   ├── screens/           # Pantallas/Vistas principales
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Alumnos/
│   │   ├── Preinscripciones/
│   │   └── Usuarios/
│   ├── utils/             # Utilidades y helpers
│   │   ├── validators.js  # Validaciones personalizadas
│   │   ├── formatters.js  # Formateadores
│   │   └── constants.js   # Constantes globales
│   ├── assets/            # Recursos (imágenes, etc.)
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── .env                    # Variables de entorno (NO SUBIR A GIT)
├── .env.example           # Ejemplo de variables
├── .gitignore
├── Dockerfile
├── index.html             # HTML base
├── vite.config.js         # Configuración de Vite
├── eslint.config.js       # Configuración de ESLint
└── package.json
```

## 🎨 Componentes Principales

### Layout

```jsx
<Layout>
  <Sidebar />
  <Main>
    <Navbar />
    <Content>
      {/* Tus componentes acá */}
    </Content>
  </Main>
</Layout>
```

### Autenticación

El contexto de autenticación maneja el estado global del usuario:

```jsx
import { useAuth } from './contexts/AuthContext';

function MiComponente() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // ...
}
```

### Formularios con Formik

```jsx
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required()
});

<Formik
  initialValues={{ email: '', password: '' }}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {/* Formulario */}
</Formik>
```

### TanStack Query

```jsx
import { useQuery, useMutation } from '@tanstack/react-query';

// Obtener datos
const { data, isLoading, error } = useQuery({
  queryKey: ['alumnos'],
  queryFn: obtenerAlumnos
});

// Mutar datos
const mutation = useMutation({
  mutationFn: crearAlumno,
  onSuccess: () => {
    queryClient.invalidateQueries(['alumnos']);
  }
});
```

## 🔌 Conexión con el Backend

La configuración de Axios está en `src/api/axios.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 🎯 Rutas Principales

```
/                          # Redirección al login o dashboard
/login                     # Página de login
/dashboard                 # Dashboard principal
/alumnos                   # Listado de alumnos
/alumnos/nuevo            # Crear alumno
/alumnos/:id              # Detalle de alumno
/alumnos/:id/editar       # Editar alumno
/preinscripciones         # Listado de preinscripciones
/preinscripciones/nueva   # Nueva preinscripción
/usuarios                  # Gestión de usuarios (admin)
/perfil                    # Perfil del usuario actual
```

## 🔒 Rutas Protegidas

Las rutas están protegidas según el rol del usuario:

```jsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

## 🎨 Personalización de Tema

Material-UI permite personalizar el tema en `src/theme.js`:

```javascript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

## 🐛 Debugging

### React DevTools

Instalá la extensión de React DevTools para Chrome/Firefox.

### Ver variables de entorno

```javascript
console.log(import.meta.env.VITE_API_URL);
```

### Network Tab

Usá la pestaña Network del navegador para ver las peticiones HTTP.

### Logs de TanStack Query

```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

## 🧪 Linting

```bash
# Ejecutar ESLint
npm run lint

# Arreglar automáticamente lo que se pueda
npm run lint -- --fix
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar linter
```

## ⚡ Optimización

### Code Splitting

Vite hace code splitting automáticamente, pero podés optimizar más:

```javascript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./screens/Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### Lazy Loading de Imágenes

```jsx
<img 
  src={imagen} 
  loading="lazy" 
  alt="descripción" 
/>
```

## 🔐 Seguridad

- ✅ Tokens JWT guardados en localStorage
- ✅ Validación de formularios client-side
- ✅ CORS configurado en el backend
- ✅ Sanitización de inputs
- ✅ Headers de seguridad

**Recomendaciones:**

- No guardes información sensible en localStorage
- Siempre validá en el backend también
- Implementá rate limiting en el backend
- Usá HTTPS en producción

## 🤝 Contribución

Leé [CONTRIBUTING.md](CONTRIBUTING.md) para conocer las guías de contribución.

## 📄 Licencia

[MIT License](LICENSE)

## 👥 Autores

Desarrollado para el Instituto Superior Nuestra Señora de Luján del Buen Viaje

---

**¿Problemas o preguntas?** Abrí un issue en el repositorio.
