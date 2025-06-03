# BPMNSmart 🧠⚙️

**BPMNSmart** es una plataforma web gratuita y de código abierto para el modelado de procesos de negocio (BPMN), pensada para equipos y profesionales que buscan agilidad, personalización y control completo sobre sus flujos de trabajo.

## 🚀 Características principales

- 🎯 **Modelado intuitivo**: Interfaz de arrastrar y soltar para construir diagramas BPMN con facilidad.
- 🧩 **Personalización total**: Cada diagrama se adapta a las necesidades específicas de tu proyecto.
- 📂 **Gestión eficiente**: Accede, organiza y modifica tus diagramas rápidamente.
- 🔄 **Autoguardado**: No pierdes tu progreso. Los cambios se guardan automáticamente.
- 🕓 **Control de versiones**: Histórico de cambios y posibilidad de restaurar versiones anteriores.
- 📤 **Importación / Exportación**: Guarda y carga diagramas BPMN en formato XML estándar.
- 🔒 **Rutas protegidas por token**: Seguridad basada en autenticación OAuth y JWT.
- 💡 **Sin necesidad de registro para probar la demo**.

## 🧪 Demo

👉 [Probar BPMNSmart en línea](https://bpmn-smart.vercel.app/demo) — ¡No necesitas registrarte!

---

## 🧱 Tecnologías

Este proyecto está desarrollado como un **monorepo** dividido en backend y frontend:

### 🖥️ Frontend
- **Framework**: [SvelteKit](https://kit.svelte.dev/) con rendering SSR (Server Side Rendering)
- **UI**: Tailwind CSS
- **Gestión de estado**: Stores personalizados
- **Diagramación**: [`bpmn-js`](https://github.com/bpmn-io/bpmn-js)
- **Autenticación**: OAuth2 con Google
- **Despliegue**: Vercel

### 🛠️ Backend
- **Servidor**: Node.js + [Express](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Base de datos**: PostgreSQL (Railway)
- **Autenticación**: Passport.js + JWT
- **Control de versiones**: Persistencia de cada versión del diagrama con timestamps
- **Despliegue**: Railway

---

## 🧭 Estructura del monorepo

```bash
BPMNSmart/
├── backend/              # Express + Prisma + Auth
│   ├── src/
│   └── prisma/
├── frontend/             # SvelteKit SSR app
│   ├── src/
│   └── static/
├── .env
├── package.json
└── README.md

## 🔒 Autenticación

La autenticación se realiza con **Google OAuth2**. Las rutas protegidas utilizan **JWT** para validar al usuario en cada acción sensible, como:

- Guardar un diagrama
- Actualizar un diagrama
- Eliminar un diagrama
- Consultar versiones anteriores
- Importar diagrama

Entre otras.

## 💡 Créditos

Creado por @JhonRiv21 como proyecto personal para facilitar el modelado BPMN, con foco en experiencia de usuario y control de versiones.
