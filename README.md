# Telemonitoreo de Pacientes Crónicos (POC)

Este es un Proof of Concept (POC) desarrollado para la asignatura de Bases de Datos (TICS320). Implementa una plataforma de telemonitoreo para pacientes crónicos alineado al ODS 3 de la ONU.

## Stack Tecnológico

- **Frontend & Backend API:** Next.js (App Router) + Node.js
- **Base de Datos Relacional:** MySQL 8
- **Base de Datos NoSQL (Auditoría):** MongoDB 6+
- **Estilos:** CSS Vanilla (Módulo de Diseño Premium y Dinámico)
- **Infraestructura:** Docker Compose

## Instrucciones de Instalación

1. Asegúrate de tener **Docker** y **Docker Compose** instalados en tu máquina.
2. Clona o descarga este repositorio y abre una terminal en la carpeta principal (donde se encuentra el archivo `docker-compose.yml`).
3. Ejecuta el siguiente comando para levantar todos los servicios:
   ```bash
   docker-compose up --build
   ```
   *Nota: La primera vez puede tardar unos minutos mientras descarga las imágenes de MySQL, MongoDB y Node.js, e instala las dependencias (npm install).*
4. Una vez que la terminal indique que Next.js está corriendo en el puerto 3000, abre tu navegador y visita:
   [http://localhost:3000](http://localhost:3000)

## Credenciales para Pruebas (Login)

El sistema cuenta con dos tipos de accesos diferenciados:
*   **Médico / Administrador:**
    *   **Usuario:** `admin`
    *   **Contraseña:** `1234`
    *   *Permisos:* Acceso total a todas las secciones, visualización global y logs de auditoría.
*   **Paciente:**
    *   **Correo Electrónico:** Usa cualquiera de los correos sembrados en la base de datos (e.g., `ana@email.com`, `luis@email.com`, `carmen@email.com`).
    *   **Contraseña:** `1234` (por defecto para todos los pacientes sembrados y registrados).
    *   *Permisos:* Acceso limitado a reportar sus propias mediciones y ver su propio histórico clínico.

## Estructura del Proyecto

- `docker-compose.yml`: Define la orquestación de los 3 contenedores solicitados (`app`, `db`, `mongo`).
- `/mysql/init`: Contiene los scripts que Docker ejecutará automáticamente al crear la base de datos por primera vez.
  - `01-schema.sql`: El DDL original requerido.
  - `02-seed.sql`: Script de datos iniciales. Incluye 1000 mediciones distribuidas en 6 meses mediante un procedimiento almacenado.
- `/app`: El código fuente completo de la aplicación Next.js.
  - `/app/api`: Los endpoints (Backend) que se conectan directamente a MySQL y MongoDB.
  - `/app/page.js`: El Frontend (UI) de la aplicación, que contiene la navegación y los formularios.
  - `/lib`: Los módulos de conexión a las bases de datos (`mysql.js`, `mongo.js`) y el middleware de auditoría (`audit.js`).

## Funcionalidad por Pestañas

### 1. Registro de Paciente
Formulario para añadir un nuevo paciente. Valida que el email no exista en la base de datos MySQL. Al registrar, guarda un log en MongoDB.

### 2. Ingreso de Medición
Permite añadir una medición clínica (Glucosa, Presión, Peso, etc.) a un paciente y médico específicos, junto con una lista de síntomas. La inserción se realiza utilizando **Transacciones SQL** (`BEGIN`, `COMMIT`, `ROLLBACK`) para asegurar la consistencia entre las tablas `MEDICION_CLINICA` y `MEDICION_SINTOMA`. Si todo sale bien, guarda un registro unificado en MongoDB.

### 3. Histórico de Mediciones
Tabla de datos que permite visualizar los registros. Puedes filtrar por Paciente y por Rango de Fechas. Demuestra la escalabilidad del sistema manejando eficientemente más de 1000 registros y utilizando un JOIN para obtener las traducciones de las enfermedades y síntomas según el idioma seleccionado.

### 4. Log de Auditoría
Vista en forma de acordeón que consulta directamente la base de datos MongoDB. Permite expandir cada operación para ver el "antes y después" (`payload_antes`, `payload_despues`) de las operaciones CRUD realizadas en MySQL.

## Multi-Idioma
El sistema soporta ES y EN. Puedes cambiar el idioma usando el selector de la barra superior. Todos los catálogos y traducciones de síntomas provienen de un `JOIN` dinámico hacia `SINTOMA_TRADUCCION` basándose en la configuración de la UI.

## Decisiones Técnicas y Trade-offs
1. **Next.js como Monolito Modular:** Para cumplir de forma estricta con la petición de "un contenedor para la app" y facilitar el despliegue con un solo comando, elegí Next.js. Esto me permitió juntar un backend muy sólido y una UI React en el mismo contenedor, simplificando el uso de puertos y redes en Docker.
2. **MongoDB Application-Level Logging:** El log de auditoría se implementó a nivel de aplicación (API Endpoint) en lugar de usar triggers complejos a nivel de base de datos relacional. Esto es ideal para un POC, ya que usar CDC (Change Data Capture) como Debezium hubiese excedido el alcance del proyecto.
3. **Vanilla CSS Premium:** Para la estética, no se utilizaron frameworks como Bootstrap o TailwindCSS. En su lugar, se optó por un diseño a medida en Vanilla CSS incorporando *Glassmorphism*, gradientes sutiles y modo oscuro.
