# Data Arch Labs Portal

Portal web para el grupo de investigación Data Arch Labs con backend NestJS, PostgreSQL y autenticación Google OAuth.

## 🚀 Tecnologías

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **React i18next** para internacionalización
- **Axios** para llamadas API

### Backend
- **NestJS** con TypeScript
- **PostgreSQL** como base de datos
- **TypeORM** para ORM
- **Google OAuth 2.0** para autenticación
- **JWT** para manejo de sesiones
- **Docker** para containerización

## 📋 Requisitos Previos

- Node.js 18+
- Docker y Docker Compose
- Cuenta de Google Cloud Platform (para OAuth)

## 🛠️ Configuración

### 1. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+
4. Ve a "Credenciales" y crea credenciales OAuth 2.0
5. Configura las URLs autorizadas:
   - **Orígenes autorizados**: `http://localhost:5173`
   - **URIs de redirección**: `http://localhost:3001/api/auth/google/callback`

### 2. Configurar Variables de Entorno

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
```

#### Backend (backend/.env)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres123
DATABASE_NAME=data_arch_labs

JWT_SECRET=tu-super-secreto-jwt-cambiar-en-produccion
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-google-client-secret

PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Instalación y Ejecución

#### Opción 1: Desarrollo Completo (Recomendado)
```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
npm run backend:install

# Configurar y ejecutar todo (Docker + Frontend + Backend)
npm run full:dev
```

#### Opción 2: Paso a Paso
```bash
# 1. Instalar dependencias
npm install
npm run backend:install

# 2. Iniciar base de datos con Docker
npm run docker:up

# 3. En terminales separadas:
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend
npm run dev
```

## 🔧 Scripts Disponibles

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build

### Backend
- `npm run backend:dev` - Servidor de desarrollo del backend
- `npm run backend:build` - Build del backend

### Docker
- `npm run docker:up` - Iniciar contenedores
- `npm run docker:down` - Detener contenedores
- `npm run docker:logs` - Ver logs de contenedores

### Desarrollo Completo
- `npm run full:dev` - Ejecutar todo el stack de desarrollo
- `npm run setup` - Configuración inicial completa

## 📊 API Endpoints

### Autenticación
- `GET /api/auth/google` - Iniciar login con Google
- `GET /api/auth/google/callback` - Callback de Google OAuth
- `GET /api/auth/profile` - Obtener perfil del usuario
- `POST /api/auth/logout` - Cerrar sesión

### Recursos (requieren autenticación)
- `GET /api/users` - Listar usuarios
- `GET /api/team-members` - Listar miembros del equipo
- `GET /api/projects` - Listar proyectos
- `GET /api/announcements` - Listar anuncios
- `GET /api/events` - Listar eventos

### Admin (requieren rol admin)
- `POST /api/users` - Crear usuario
- `POST /api/team-members` - Crear miembro del equipo
- `POST /api/projects` - Crear proyecto
- `POST /api/announcements` - Crear anuncio
- `POST /api/events` - Crear evento

## 🗄️ Base de Datos

La base de datos PostgreSQL se inicializa automáticamente con:
- Esquema completo de tablas
- Datos de ejemplo para desarrollo
- Configuración de relaciones

### Tablas Principales
- `users` - Usuarios del sistema
- `team_members` - Miembros del equipo de investigación
- `projects` - Proyectos de investigación
- `announcements` - Anuncios del grupo
- `events` - Eventos y calendario

## 🔐 Autenticación

El sistema utiliza Google OAuth 2.0 para autenticación:

1. Usuario hace clic en "Iniciar Sesión"
2. Redirección a Google OAuth
3. Usuario autoriza la aplicación
4. Google redirecciona con código de autorización
5. Backend intercambia código por token de acceso
6. Se crea/actualiza usuario en la base de datos
7. Se genera JWT para sesiones posteriores

### Roles de Usuario
- **Admin**: Acceso completo al dashboard administrativo
- **Member**: Acceso de solo lectura a contenido público

## 🚀 Despliegue

### Desarrollo
```bash
npm run full:dev
```

### Producción
```bash
# Build del frontend
npm run build

# Build del backend
npm run backend:build

# Usar docker-compose para producción
cd backend
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Documentación API

Una vez ejecutando el backend, la documentación Swagger está disponible en:
`http://localhost:3001/api/docs`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas:

1. Revisa que Docker esté ejecutándose
2. Verifica las variables de entorno
3. Consulta los logs: `npm run docker:logs`
4. Revisa la documentación de la API en `/api/docs`

Para más ayuda, abre un issue en el repositorio.