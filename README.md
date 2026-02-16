# Task Manager - Migración a Arquitectura Moderna

## 📋 Descripción del Proyecto

Este proyecto es una migración de una aplicación legacy monolítica (HTML + JavaScript vanilla) a una arquitectura moderna basada en componentes usando React y Vite.

### Arquitectura Original
- **Estilo**: Monolito en Cliente (Client Monolith)
- **Tecnología**: HTML + JavaScript vanilla + localStorage
- **Estructura**: Todo el código en un solo archivo `app.js` (841 líneas)

### Arquitectura Nueva
- **Estilo**: Arquitectura Basada en Componentes (Component-Based Architecture)
- **Tecnología**: React 19 + Vite + CSS Modular
- **Estructura**: Componentes separados, servicios, y estilos modulares

## 🚀 Instalación y Setup

### Prerrequisitos
- Node.js 18+ instalado
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo-url>
cd migration-project-evidence4
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Compilar para producción**
```bash
npm run build
```

5. **Previsualizar build de producción**
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
migration-project-evidence4/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Header.jsx       # Componente de encabezado
│   │   ├── Login.jsx        # Componente de autenticación
│   │   ├── TaskList.jsx     # Gestión principal de tareas
│   │   ├── TaskForm.jsx     # Formulario de tareas
│   │   ├── TaskTable.jsx    # Tabla de tareas
│   │   └── TaskStats.jsx    # Estadísticas
│   ├── services/
│   │   └── storage.js       # Servicio de localStorage
│   ├── App.jsx              # Componente principal
│   └── App.css              # Estilos globales
├── legacy/                  # Código legacy original
│   ├── index.html
│   ├── app.js
│   └── style.css
└── package.json
```

## 🔑 Credenciales de Acceso

**Usuario por defecto:**
- Usuario: `admin`
- Contraseña: `admin`

**Otros usuarios de prueba:**
- Usuario: `user1` / Contraseña: `user1`
- Usuario: `user2` / Contraseña: `user2`

## 🏗️ Arquitectura

### Componentes Principales

- **App.jsx**: Componente raíz que maneja el estado de autenticación
- **Login.jsx**: Maneja la autenticación de usuarios
- **Header.jsx**: Muestra información del usuario y botón de salida
- **TaskList.jsx**: Componente contenedor que gestiona el estado de las tareas
- **TaskForm.jsx**: Formulario para crear/editar tareas
- **TaskTable.jsx**: Tabla que muestra todas las tareas
- **TaskStats.jsx**: Calcula y muestra estadísticas de tareas

### Servicios

- **Storage**: Servicio que abstrae el acceso a localStorage, manejando usuarios, proyectos, tareas, comentarios, historial y notificaciones.

## 📊 Mejoras Implementadas

1. **Modularidad**: Código separado en componentes reutilizables
2. **Mantenibilidad**: Cada componente tiene una responsabilidad única
3. **Testabilidad**: Componentes pueden ser probados de forma independiente
4. **Rendimiento**: React optimiza el renderizado con Virtual DOM
5. **Escalabilidad**: Fácil agregar nuevas funcionalidades como componentes

## 🧪 Testing

Para ejecutar Lighthouse y verificar métricas de rendimiento:

1. Despliega la aplicación en Vercel/Netlify
2. Abre Chrome DevTools
3. Ve a la pestaña "Lighthouse"
4. Ejecuta el análisis
5. Verifica que el score sea ≥ 70

## 📦 Despliegue

### Vercel
1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente Vite
3. El despliegue será automático en cada push

### Netlify
1. Conecta tu repositorio de GitHub a Netlify
2. Configura el build command: `npm run build`
3. Configura el publish directory: `dist`

## 💰 Costos

- **Hosting**: $0/mes (Plan gratuito de Vercel/Netlify)
- **Dominio**: $0/mes (Subdominio gratuito)
- **Total**: $0/mes

## 📝 Commits Principales

1. Initial commit
2. App files
3. React Architecture with Vite
4. CSS
5. Login HTML structure to JSX
6. Create Header component
7. Create Login component and Storage service
8. Porting logic to TaskList component
9. Implementing State management for tasks
10. CSS styles

## 👨‍💻 Autor

Migración realizada como parte de la Evidence 4 - Arquitecturas de Software

## 📄 Licencia

Este proyecto es parte de un ejercicio académico.
