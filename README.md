# 🚀 Microservicios: Sistema de Gestión de Alumnos y Tickets

Este proyecto es una arquitectura de microservicios diseñada para gestionar un instituto educativo, incluyendo inscripciones, calificaciones, reportes y un sistema de tickets de soporte.

![Architecture Diagram](image.png)

## 🧩 Documentación de Microservicios

### 1. API Gateway (`microservice-gateway`)
- **Tecnología**: Java 21, Spring Boot 3, Spring Cloud Gateway.
- **Puerto**: 8080
- **Responsabilidad**:
  - Punto de entrada único para todas las peticiones externas.
  - Enrutamiento de peticiones a los microservicios correspondientes.
  - Seguridad y Autenticación: Valida tokens JWT y roles de usuario (Admin, Estudiante, Profesor).
  - Manejo de CORS y filtros globales.

### 2. CRM Backend (`crm-backend`)
- **Tecnología**: Python 3.12, FastAPI, PostgreSQL (`users_db`).
- **Puerto**: 8000
- **Responsabilidad**:
  - Gestión de Usuarios: Administradores, Profesores y Estudiantes.
  - Autenticación: Generación y validación de tokens JWT.
  - Orquestador: Actúa como intermediario para procesos complejos.

### 3. Servicio de Tickets (`ticket-service`)
- **Tecnología**: Java 21, Spring Boot 3, MySQL (`tickets_db`).
- **Puerto**: 8094
- **Responsabilidad**:
  - Gestión del ciclo de vida de los tickets de soporte.
  - Genera códigos únicos para cada ticket (ej. `TICKET-A1B2-0001`).
  - Comunicación asíncrona con el servicio de notificaciones.

### 4. Servicio de Notificaciones (`notification-service`)
- **Tecnología**: Java 21, Spring Boot 3, MySQL (`notifications_db`).
- **Responsabilidad**: Envío de notificaciones y manejo de eventos.

### 5. Servicios Académicos (Node.js)
- **Course Service**: Gestión del catálogo de cursos.
- **Enrollment Service**: Gestión de inscripciones y cupos.
- **Grade Service**: Registro de notas y promedios.
- **Report Service**: Generación de reportes oficiales.

### 6. Frontend CRM (`crm_frontend`)
- **Tecnología**: React, Rsbuild.
- **Puerto**: 3001
- **Responsabilidad**: Interfaz de usuario para todos los roles.

---

## ▶️ Guía de Despliegue y Ejecución

### 1. Prerrequisitos
*   **Git**: [Descargar](https://git-scm.com/downloads)
*   **Docker Desktop**: [Descargar](https://www.docker.com/products/docker-desktop/)

### 2. Descargar el Proyecto
```bash
git clone https://github.com/polox2x2/MicroServicio-ticket_notification_gateway.git
cd MicroServicio-ticket_notification_gateway
```

### 3. Ejecutar con Docker Compose
El comando mágico para levantar todo el sistema:

```bash
docker-compose up -d --build
```

### 4. Acceso a los Servicios
*   **Frontend CRM**: [http://localhost:3001](http://localhost:3001)
*   **API Gateway**: [http://localhost:8080](http://localhost:8080)
*   **Documentación API (Swagger/OpenAPI)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ✨ Autor
polox
