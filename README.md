# 🧩 Proyecto Final – Trabajando en la Nube

**Carrera:** Ingenieria de Sistemas <br>
**Asignatura:** Trabajando en la Nube (COM610)<br>
**Docente:** Ing. Marcelo Quispe Ortega<br>
**Grupo:**

- Martinez Pardo Nisse Maximiliano – (martinezpardonisse@gmail.com)
- Naomy Yailin Paredes Paredes – (naomyyailinp@gmail.com)

## 📌 DESPLIEGUE CONTINUO DE WEBAPP "FACTURACIÓN DE NEGOCIO" CON GITHUB ACTIONS

## 🎯 Objetivo General

Implementar el despliegue continuo de una web app utilizando Github Actions para la automatización de tareas o pasos en el despliegue sobre AWS EC2.

## 🎯 Objetivos Específicos

- Preparar el ambiente AWS para desplegar el proyecto.
- Crear el workflow para el despliegue automatizado en github actions del proyecto.
- Demostrar el despligue automatizado con cambios en el proyecto.

## 📝 Descripción General del Proyecto

El proyecto esta hecho para poder dejar las tareas manuales de actualización de la app web sobre la instancia EC2 en AWS utilizando la herramienta de automatización que es github actions.

## 🛠️ Tecnologías Utilizadas

- Github Actions
  - Herramienta de automatización para el despliegue de la app
- Github Secrets
  - Utilidad para almacenar secretos como claves y credenciales para github actions
- Docker
  - Herramienta de contenerizado para la instancia ec2
- Docker Compose
  - Herramienta de orquestación para los contenedores docker
- AWS EC2
  - Servicio para crear la instancia donde se desplegara la app
- AWS RDS
  - Servicio para la base de datos postgres que usara la app
- AWS ECR
  - Servicio de repositorio para la imagen docker que contendra la app
- Lenguajes, frameworks adicionales
  - Javascript .- Lenguaje de programación
  - Nextjs .- Framework React para Frontend y Backend

## 📚 Temas de la Asignatura Implementados

### Contenerización con Docker

- Herramienta de contenerizado, usada para crear la imagen docker de nuestra app
- Dockerfile utilizado:

  ```DockerFile
  # -----------------------------
  # ETAPA 1: Build
  # -----------------------------
  FROM node:24-slim AS builder

  WORKDIR /app

  COPY package*.json ./
  RUN npm install

  COPY . .
  RUN npm run build

  # -----------------------------
  # ETAPA 2: Runner
  # -----------------------------
  FROM node:24-slim AS runner

  WORKDIR /app

  COPY package*.json ./
  RUN npm install --omit=dev

  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/next.config.mjs ./next.config.mjs
  COPY --from=builder /app/package.json ./package.json

  EXPOSE 3000
  CMD ["npm", "run", "start"]
  ```

### Orquestación con Docker Compose

- Dentro de la instancia EC2 definimos el servicio:
  - app: utiliza la URI del repositorio ECR para cargar la imagen docker de la app
- Variables de entorno:

  ```env
  DB_URI=postgresql://usuario:contrseña@URI_de_conexión_host/nombre_de_base_de_datos
  PRODUCTION=true
  ```

### Instancias Computacionales, Acceso Seguro y Bases de Datos (EC2, RDS)

- Configuración de la instancia EC2
  - Se creo grupos de seguridad con las reglas:
    - HTTP (cualquiera)
    - HTTPS (cualquiera)
- Acceso SSH / llaves
  - Se creo grupos de seguridad con permisos ssh
  - Se genero llaves para el ingreso a la instancia EC2
- Configuración de seguridad (Security Groups)
  - Grupo de seguridad para la instancia EC2 con permisos de trafico HTTP Y HTTPS
  - Grupo de seguridad para la instancia EC2 con permisos de SSH
  - Grupo de seguridad para la instnacia RDS con permisos para recibir trafico solo de la instancia EC2
- Motor de base de datos en RDS
  - Uso de Postgres
- Conexiones seguras a la BD
  - Solo se permite trafico desde la instancia EC2 y IP de administración permitidas

### Almacenamiento (ECR)

- Uso de un repositorio ECR para el almacenamiento de imagenes docker
- Uso de la etiqueta :latest para la imagen

## 🏗️ Arquitectura del Sistema

### Diagrama General de la Infraestructura

<p align="center">
  <img src=".github/assets/img/diagramas/Dga_cd.png" width="95%">
</p>

### Explicación del Flujo de la Solución

Describir cómo interactúan los componentes:

- Desarrolador sube un cambio → Github lee el workflow → Github actions comienza el despliegue
- Github Secrets da los secretos → Github actions: Clonación de proyecto → Inicio de AWS CLI → Test unitarios ejecutados → Docker construye la imagen → Se sube la imagen a ECR → Se accesde a la instancia EC2 → Se actualiza la imagen con la nueva subida en ECR → Se envia un email con el resultado del despliegue
- EC2 expone la app → La app dirige peticiones a RDS

## 🚀 Pasos para Desplegar la Solución

### Requisitos Previos

- Cuenta AWS
- Entorno de desarrollo con Docker
- Repositorio en Github

### Instrucciones

### Preparación de ambiente AWS

#### Servicio Identity and Access Management IAM

- Creación de un usuario (persona) con permisos AmazonEC2ContainerRegistryFullAccess y AmazonEC2FullAccess
- Creación de claves para el usuario (persona) creado
- Creación de rol con permisos AmazonEC2ContainerRegistryReadOnly

#### Security Groups de EC2

- Crear grupo de seguridad para la instancia EC2 con reglas:
  - HTTPS: Cualquiera
  - HTTP: Cualquiera
  - SSH: Cualquiera
- Crear grupo de seguridad para la instancia de base de datos postgres en RDS:
  - PostgresSQL: al grupo de seguridad de la instancia EC2
  - PostgresSQL: MI IP

#### Servicio Amazon Elastic Compute Cloud EC2

- Crear una instancia EC2 con:
  - Imagen Ubuntu
  - Asignar par de claves .pem para la conexión ssh
  - Asignar el grupo de seguridad antes creado
  - Asignar rol creado anteriormente
- Instalar dependencias en la instancia o usar script de usuario

  ```sh
  #!/bin/bash

  # Instalar Docker
  sudo apt update
  sudo apt install -y docker.io
  sudo usermod -aG docker ubuntu

  # Instalar descompresor - dependencias para AWS CLI
  sudo apt install -y unzip

  # Instalar Docker Compose
  sudo curl -L "https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose

  # Instalar AWS CLI v2
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install

  # Crear archivos docker-compose.yml
  cat <<'EOF' > docker-compose.yml
  version: "3.8"

  services:
    app:
      image: URI_de_repositorio_ECR
      container_name: app
      restart: always
      env_file:
        - .env
      ports:
        - "80:3000"
  EOF

  # Crear archivo .env
  cat <<'EOF' > .env
  DB_URI=postgresql://usuario:contrseña@URI_de_conexión_host/nombre_de_base_de_datos
  PRODUCTION=true
  EOF
  ```

#### Servicio Aurora and RDS

- Crear una instancia de base de datos PostgresSQL con acceso publico

#### Servicio Amazon Elastic Container Registry ECR

- Creación de un repositorio con la Inmutabilidad de etiqueta: Mutable

### Estructura del Proyecto WebApp

```bash
facturacion-de-negocio/
│
src/
├── app/
│   ├── (front_ui)/(pages)/   # Rutas de Frontend
│   │   ├── (home)/           # Ejemplo de pagina (e.g. /)
│   │   └── ...               # Otras paginas
│   └── (back_api/)api/v1/    # Rutas de API
│       ├── facturas/         # Ejemplo de endpoint (e.g. /api/v1/facturas)
│       └── ...               #  Otras rutas o controladores
```

- Frontend (UI): inerfaz de usuario para el manejo de la facturación
- Backend (API): manejo de datos y emisión de la factura

### Ejecución del proyecto (Docker)

#### MODO 1: Ejecución con uso de `Dockerfile` (Construcción del proyecto)

#### MODO 2: Ejecución con uso de `Dockerfile.dev` (Desarrollo en caliente)

#### Variables de entorno:

```bash
# DBPOSTGRES CONFIG
DB_URI=
# INDICADOR DE ENTORNO -> true o false
PRODUCTION=
```

### Backend Base de Datos

```sql
-----------------------------------------------------
-- TABLAS
-----------------------------------------------------

-- Tabla de productos
CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0)
);

-- Tabla factura
CREATE TABLE factura (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT NOW(),
    cliente VARCHAR(120) NOT NULL,
    total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0)
);

-- Tabla detalle
CREATE TABLE detalle (
    id SERIAL PRIMARY KEY,
    factura_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),

    FOREIGN KEY (factura_id) REFERENCES factura(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);
```

Solo las tablas de factura y detalle recibiran registros nuevos, la tabla de producto contedra registros ya insertados.

## **Frontend UI Vistas**

<p align="center">
  <img src=".github/assets/img/frontUI/fr_home.png" style="width: 95%;"><br>
  <strong>Home: /</strong>
</p>
<p align="center">
  <img src=".github/assets/img/frontUI/fr_registro.png" style="width: 95%;" /><br>
  <strong>Facturacion: /facturacion</strong>
</p>
<p align="center">
  <img src=".github/assets/img/frontUI/fr_lista.png" style="width: 95%;" /><br>
  <strong>Vista de lista de facturas: /view/facturas</strong>
</p>
<p align="center">
  <img src=".github/assets/img/frontUI/fr_factura.png" style="width: 95%;" /><br>
  <strong>Vista de factura emitida; /view/factura</strong>
</p>

## **Backend API Referencia**

#### **Ruta base**:

```
/api/v1
```

#### **Ruta para healthckeck DB**:

```http
GET /api/v1/health
```

Respuesta Json esperada:

```json
{
  "status": "ok",
  "database": "db_name"
}
```

#### **Ruta - Registrar factura**:

```http
POST /api/v1/facturas
```

Ejemplo de estructura de para el body JSON:

```json
{
  "cliente": "Juan Pérez",
  "fecha": "2025-01-10",
  "detalles": [
    {
      "producto_id": "1",
      "cantidad": 2
    },
    {
      "producto_id": "5",
      "cantidad": 1
    },
    {
      "producto_id": "7",
      "cantidad": 3
    }
  ]
}
```

#### **Ruta - Obtener facturas**:

```http
GET /api/v1/facturas
```

Respuesta json esperada:

```json
{
  "error": "false",
  "mensaje": "Facturas obtenidas con exito",
  "data": [
    {
      "id": 1,
      "cliente": "Juan Pérez",
      "fecha": "2025-11-25T00:00:00.000Z",
      "total": "250.0"
    },
    {
      "id": 2,
      "cliente": "María Gómez",
      "fecha": "2025-11-24T00:00:00.000Z",
      "total": "480.3"
    }
  ]
}
```

#### **Ruta - Obtener una factura por id**:

```http
GET /api/v1/facturas/:id
```

Respuesta json esperada:

```json
{
  "error": "false",
  "mensaje": "Factura obtenida con exito",
  "data": {
    "id": 2,
    "cliente": "María Gómez",
    "fecha": "2025-11-25T00:00:00.000Z",
    "total": "480.3",
    "detalles": [
      {
        "id": 10,
        "producto_id": 3,
        "nombre_producto": "Monitor LED 24”",
        "precio": "180.1",
        "cantidad": 1,
        "subtotal": "180.1"
      },
      {
        "id": 11,
        "producto_id": 8,
        "nombre_producto": "Teclado mecánico",
        "precio": "100.1",
        "cantidad": 3,
        "subtotal": "300.3"
      }
    ]
  }
}
```

#### **Ruta - Eliminar una factura por id**:

```http
DELETE /api/v1/facturas/:id
```

Respuesta json esperada:

```json
{
  "error": "false",
  "mensaje": "Factura eliminada con exito"
}
```

#### **Ruta - Obtener productos**:

```http
GET /api/v1/productos
```

Respuesta json esperada:

```json
{
  "error": "false",
  "mensaje": "Productos obtenidos con exito",
  "data": [
    {
      "id": 1,
      "nombre": "Arroz 5kg",
      "descripcion": "Bolsa de arroz premium",
      "precio": "35.00"
    },
    {
      "id": 2,
      "nombre": "Azúcar 1kg",
      "descripcion": "Azúcar refinada",
      "precio": "8.50"
    },
    {
      "id": 3,
      "nombre": "Aceite 1L",
      "descripcion": "Aceite vegetal",
      "precio": "12.00"
    },
    {
      "id": 4,
      "nombre": "Leche 1L",
      "descripcion": "Leche entera en botella",
      "precio": "7.00"
    },
    {
      "id": 5,
      "nombre": "Fideo 500g",
      "descripcion": "Fideo tipo spaghetti",
      "precio": "5.00"
    },...
  ]
}
```

### Worflow para github actions

- **Nombre de worflow**: Despliegue de APPWEB a EC2
- **Rama de aplicación**: Master
- **Jobs**: deploy
- **Maquina para deploy**: ubuntu-latest
- **Pasos de deploy**:
  - **Checkout code**: Trae el codigo a la maquina asignada
  - **Configurar Credenciales AWS**: Establece las credenciales aws para la maquina asignada
  - **Login para ECR AWS**: Establece una sesion para poder usar ECR
  - **Registrar step actual (AWS Registro)**: Paso para registrar el paso actual con fines de notificacion
  - **Instalar dependencias**: Instalacion previa para poder ejecutar el siguiente paso de tests
  - **Ejecutar tests unitarios**: Ejecuta los tests unitarios del proyecto
  - **Construir, etiquetar y hacer push de imagen docker**: Tratamiento de imagen docker
  - **SSH dentro de instancia EC2 y actualizar servicio**: Actualiza el servicio en la instancia EC2
  - **Registrar step actual (SSH dentro de instancia EC2 y actualizar servicio)**: Paso para registrar el paso actual con fines de notificacion
  - **Notificación de éxito**: Si todos los pasos se completaron con exito envia una notificacion de correo electronico con detalles de exito
  - **Cargar contenido del step fallido**: Guarda el paso fallido si hubiera alguno
  - **Notificación de fallo**: Si algun paso falla envia una notificacion de correo electronico con detalles de fallo

Puede consultar el archivo de worflow deploy.yml [aqui](https://github.com/nmmartinezp/facturacion-de-negocio/blob/master/.github/workflows/deploy.yml).

### Secrests usados en github secrets

<div align="center">
<table>
  <thead>
    <tr>
      <th>Secret</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>AWS_ACCESS_KEY_ID</code></td><td>Id de llave de acceso de usuario aws con permisos AmazonEC2ContainerRegistry y AmazonEC2</td></tr>
    <tr><td><code>AWS_SECRET_ACCESS_KEY</code></td><td>Llave de acceso de usuario aws con permisos AmazonEC2ContainerRegistry y AmazonEC2</td></tr>
    <tr><td><code>AWS_REGION</code></td><td>Región de despliegue de servicio</td></tr>
    <tr><td><code>ECR_REPOSITORY</code></td><td>URI de repositorio de ECR</td></tr>
    <tr><td><code>EC2_HOST</code></td><td>Dominio DNS O IP Publica de instancia EC2</td></tr>
    <tr><td><code>EC2_USER</code></td><td>Usuario de instancia EC2 a usar</td></tr>
    <tr><td><code>EC2_SSH_KEY</code></td><td>Contenido de la llave de acceso generada en EC2 en tu archivo .pem</td></tr>
    <tr><td><code>EMAIL_SMTP_HOST</code></td><td>Host de servidor email. Recomendado para gmail "smtp.gmail.com"</td></tr>
    <tr><td><code>EMAIL_SMTP_PORT</code></td><td>Puerto de servidor email. Recomendado "587"</td></tr>
    <tr><td><code>EMAIL_SMTP_USER</code></td><td>Correo que enviara el email</td></tr>
    <tr><td><code>EMAIL_SMTP_PASSWORD</code></td><td>Contraseña o token para usar correo que envia el email</td></tr>
    <tr><td><code>EMAIL_TO</code></td><td>Correo de destino</td></tr>
  </tbody>
</table>
</div>

## 📚 Conclusiones y Lecciones Aprendidas

Luego del desarrollo de todo el proyecto se logro:

- Implementar un workflow que despliega la app al solo subir un cambio a la rama principal master
- Implementar una infraestructura en la nube, aunque sencilla capaz de lidiar con cambios automatizados
- Poder evitar una actualización manual sobre la insfraestrucutra en la nube

Las automatización en cuento a despliegue evitan seguir pasos repetitivos en los cuales podemos cometer errores, por lo cual esto quita una carga de trabajo a la hora de lidiar con nuevas actualización en una app despleguedada en la nube.
