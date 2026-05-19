<div align="center">
  <img src="/assets/img/logo.png" width="200" height="200" alt="Vettion Logo" />
  <h1>Vettion Frontend</h1>
  <p><strong>Sistema de gestión clínica veterinaria</strong></p>
  <p>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License" />
  </p>
</div>

Una interfaz moderna, ágil e intuitiva para la administración de mascotas, turnos clínicos, historial médico y salas de consulta, construida bajo un enfoque estático puro para maximizar el rendimiento.

## 📋 Descripción

**Vettion Frontend** es la plataforma visual para el control integral de procesos en la clínica veterinaria. Desarrollada con HTML, Bootstrap y JavaScript, ofrece un rendimiento ultrarrápido al evitar la carga de frameworks pesados de frontend.

El proyecto cuenta con un diseño estandarizado gracias a Bootstrap, empleando componentes aislados e integraciones eficientes mediante JS para el consumo del API y garantizando una excelente experiencia de usuario (UX) tanto en dispositivos móviles (responsive) como de escritorio.

## ✨ Características

- 📊 **Dashboard Interactivo** - Panel de control general para supervisión rápida.
- 📋 **Gestión de Citas** - Agendamiento y seguimiento completo de turnos veterinarios.
- 🐕 **Historial Clínico** - Control exhaustivo de pacientes, patologías y alergias.
- ⚙️ **Gestión de Salas** - Monitoreo del estado y ocupación continua de las salas de la clínica.
- 📦 **Perfiles de Dueños y Mascotas** - Organización estructurada del directorio de clientes.
- 🎨 **Estilizado Moderno y Responsivo** - Integración fluida en móviles y escritorio mediante Bootstrap 5 y SCSS.

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica multipágina web.
- **CSS3 / Bootstrap** - Preprocesador para el estilo escalable.
- **Bootstrap 5.3+** - Framework CSS de UI estandarizada y responsiva.
- **Bootstrap Icons 1.13+** - Gestión optimizada de íconos web.
- **JavaScript** - Lógica de vistas, servicios base de consumo de API y utilidades compartidas.

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado u operativo lo siguiente:

| Requisito | Versión | Enlace |
| --- | --- | --- |
| Node.js | 20+ (Opcional, para HTTP Server) | [nodejs.org](https://nodejs.org/) |
| npm | 10+ (Opcional) | Incluido con Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com/) |
| Live Server | Extensión VS Code (Opcional) | [Marketplace](https://marketplace.visualstudio.com/) |

## 🚀 Instalación Rápida

1. **Clona el Repositorio**
   ```bash
   git clone https://github.com/Vettion/frontend.git
   cd frontend
   ```

2. **Instala las Dependencias (Bootstrap)**
   ```bash
   npm install
   ```

3. **Inicia el Entorno de Desarrollo**
   _Usa `http-server` si lo tienes instalado de manera global, o abre el archivo base con la extensión **Live Server** de VS Code._
   ```bash
   npx http-server . -p 5500
   ```
   ✅ La aplicación estará disponible en `http://localhost:5500/assets/index.html`

## 🏗️ Uso Rápido y Scripts Disponibles

El proyecto integra dependencias por el lado de estilos. Asegúrate del estado del back-end para que los datos carguen:

| Comando | Descripción |
| --- | --- |
| `npm install` | Descarga las dependencias JS locales especificadas (Bootstrap). |
| `npm run test` | Ejecuta los scripts de prueba base. |

## 📁 Estructura del Proyecto

```text
Vettion-Frontend/
├── package.json            # Metadatos y dependencias (Bootstrap)
├── README.md               # Documentación general del frontend
└── assets/                 # Páginas principales, Vistas y Recursos estáticos
    ├── citaForm.html       # Formulario para agendar citas
    ├── clinic-historic.html # Vista de historial clínico integrado
    ├── consults.html       # Interfaz de gestión de consultas
    ├── index.html          # Vista de inicio principal del Dashboard
    ├── new-allergy.html    # Formulario para registro de alergias
    ├── pet-detail.html     # Ficha clínica estática de paciente
    ├── pet-form.html       # Formulario de alta/edición de mascota
    ├── pet-list-page.html  # Directorio y listado general
    ├── room-info.html      # Resumen de detalles de una sala
    ├── room-status-page.html # Panel de monitoreo de ocupación
    ├── css/                # Hojas de estilo y SCSS directives
    │   ├── _typography_style.scss 
    │   ├── _variables.scss 
    │   ├── bootstrap.min.css 
    │   ├── clinic-history_style.css 
    │   ├── consults_style.css 
    │   ├── consults_style.scss 
    │   ├── index_style.css 
    │   ├── index_style.scss 
    │   ├── new-allergy-form_style.css 
    │   ├── newAppointment.css 
    │   ├── newAppointment.scss 
    │   ├── pet-detail_style.css 
    │   ├── pet-form_style.css 
    │   ├── pet-list-page_style.css 
    │   ├── room-status-page_style.css 
    │   └── room-status-page_style.scss 
    ├── img/                # Assets gráficos e íconos de la aplicación
    └── js/                 # Controladores, eventos DOM e integraciones de la API API
        ├── bootstrap.bundle.min.js
        ├── clinic-history_script.js
        ├── clock_header_script.js
        ├── consults.js
        ├── new-allergy_script.js
        ├── newAppointment.js
        ├── pet-detail_script.js
        ├── pet-form-page_script.js
        └── pet-list-page_style.js
```

## 🏗️ Flujo de Arquitectura y Renderizado

**Vistas y Controladores Desacoplados:**

- `assets/*.html`: Estructura web HTML. Las interfaces se declaran puras, modulares y estáticas para reducir JS pesado on-load.
- `assets/js/*.js`: La lógica interactiva al nivel de usuario (control de DOM, asincronía y peticiones asíncronas HTTP al Back-end) se administra desde controladores dedicados adjuntos al `<script>` del componente HTML.
- `assets/css/*.scss`: Procesos de preprocesado Bootstrap independientes que alimentan las directivas base de la interfaz unificada.

## 📄 Licencia

Este proyecto está bajo la Licencia **ISC**. 

## 👥 Autores

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/7adrii">
        <img src="https://github.com/7adrii.png" width="100px;" style="border-radius: 50%" alt="Avatar Adrian"/><br />
        <sub><b>Adrian</b></sub>
      </a><br />
    </td>
    <td align="center">
      <a href="https://github.com/LauraLG2000">
        <img src="https://github.com/LauraLG2000.png" width="100px;" style="border-radius: 50%" alt="Avatar Laura"/><br />
        <sub><b>Laura</b></sub>
      </a><br />
    </td>
  </tr>
</table>

## 🏆 Créditos

Este proyecto fue ideado y desarrollado como parte de la entrega para el Trabajo Final de **3ª Evaluación (1º DAW)**
