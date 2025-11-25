# **DESPLIEGUE CONTINUO DE WEBAPP "FACTURACIÓN DE NEGOCIO" CON GITHUB ACTIONS**

Proyecto que implementa despliegue continuo en una webapp utilizando Github Actions para la automatización de tareas o pasos en el despliegue sobre AWS EC2.

## **Diagrama de despliegue**

<p align="center">
  <img src=".github/assets/img/diagramas/Dga_cd.png" width="95%">
</p>

## **Worflow para github actions**

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

## **Secrests usados en github secrets**

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

## **Preparación de ambiente AWS**

#### **Servicio Identity and Access Management IAM**

- Creación de un usuario (persona) con permisos AmazonEC2ContainerRegistryFullAccess y AmazonEC2FullAccess
- Creación de claves para el usuario (persona) creado
- Creación de rol con permisos AmazonEC2ContainerRegistryReadOnly

#### **Security Groups de EC2**

- Crear grupo de seguridad para la instancia EC2 con reglas:
  - HTTPS: Cualquiera
  - HTTP: Cualquiera
  - SSH: Cualquiera
- Crear grupo de seguridad para la instancia de base de datos postgres en RDS:
  - PostgresSQL: al grupo de seguridad de la instancia EC2
  - PostgresSQL: MI IP

#### **Servicio Amazon Elastic Compute Cloud EC2**

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

#### **Servicio Aurora and RDS**

- Crear una instancia de base de datos PostgresSQL con acceso publico

#### **Servicio Amazon Elastic Container Registry ECR**

- Creación de un repositorio con la Inmutabilidad de etiqueta: Mutable

## **Estructura del Proyecto WebApp**

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

## **Ejecución del proyecto (Docker)**

### **MODO 1**: Ejecución con uso de `Dockerfile` (Construcción del proyecto)

### **MODO 2**: Ejecución con uso de `Dockerfile.dev` (Desarrollo en caliente)

### **Variables de entorno**:

```bash
# DBPOSTGRES CONFIG
DB_URI=
# INDICADOR DE ENTORNO -> true o false
PRODUCTION=
```

## **Backend Base de Datos**

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

Posibles datos para iniciar la base de datos:

```sql
-----------------------------------------------------
-- INSERTAR PRODUCTOS (25)
-----------------------------------------------------

INSERT INTO producto (nombre, descripcion, precio) VALUES
('Arroz 5kg', 'Bolsa de arroz premium', 35.00),
('Azúcar 1kg', 'Azúcar refinada', 8.50),
('Aceite 1L', 'Aceite vegetal', 12.00),
('Leche 1L', 'Leche entera en botella', 7.00),
('Fideo 500g', 'Fideo tipo spaghetti', 5.00),
('Harina 1kg', 'Harina de trigo', 6.50),
('Sal 1kg', 'Sal fina', 3.00),
('Gaseosa 2L', 'Bebida sabor cola', 11.00),
('Jugo 1L', 'Jugo de durazno', 10.00),
('Pan molde', 'Pan blanco familiar', 15.00),
('Detergente 1kg', 'Detergente en polvo', 18.00),
('Lavavajilla 500ml', 'Lavavajilla líquido', 9.00),
('Shampoo 400ml', 'Shampoo para uso diario', 22.00),
('Jabón de tocador', 'Jabón aroma natural', 3.50),
('Papel higiénico 12u', 'Pack económico', 20.00),
('Café 200g', 'Café molido', 25.00),
('Té 100u', 'Caja de té negro', 14.00),
('Mermelada 500g', 'Sabor frutilla', 16.00),
('Galletas 1pa', 'Galletas dulces', 6.00),
('Queso 500g', 'Queso semiduro', 30.00),
('Jamón 200g', 'Jamón rebanado', 18.00),
('Yogurt 1L', 'Yogurt sabor vainilla', 11.00),
('Huevos 12u', 'Docena de huevos', 14.00),
('Mantequilla 200g', 'Mantequilla premium', 12.00),
('Carne molida 1kg', 'Carne de res molida', 40.00);

-----------------------------------------------------
-- FACTURAS DE EJEMPLO
-----------------------------------------------------

INSERT INTO factura (cliente, total) VALUES
('Juan Pérez', 73.00),
('Negocio El Buen Sabor', 139.00);

-----------------------------------------------------
-- DETALLES DE FACTURA 1
-----------------------------------------------------

INSERT INTO detalle (factura_id, producto_id, cantidad, subtotal) VALUES
(1, 1, 1, 35.00),
(1, 4, 2, 14.00),
(1, 9, 1, 10.00),
(1, 23, 1, 14.00);

-----------------------------------------------------
-- DETALLES DE FACTURA 2
-----------------------------------------------------

INSERT INTO detalle (factura_id, producto_id, cantidad, subtotal) VALUES
(2, 25, 1, 40.00),
(2, 20, 1, 30.00),
(2, 21, 2, 36.00),
(2, 8, 3, 33.00);

```

## **Ejecución Local del Proyecto con Docker Compose**

```yml
services:
  app:
    build: ./facturacion-de-negocio
    image: app:1.0
    container_name: app
    ports:
      - "3000:3000"
    restart: always
    environment:
      - DB_URI=postgresql://user:1234@db:5432/db_facturacion
      - PRODUCTION=false
    depends_on:
      - db
  db:
    image: postgres:alpine3.22
    container_name: db_data
    restart: always
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=1234
      - POSTGRES_DB=db_facturacion
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./dbconfig/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
volumes:
  db_data:
```

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

## **Tencologias Usadas**

### **Frontend**:

<p align="left">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/HeroUI-000000?style=for-the-badge&logo=heroui&logoColor=white" alt="HeroUI" />
</p>

### **Backend**:

<p align="left">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

### **Contenerización**:

<p align="left">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

### **Despliegue Continuo**:

<p align="left">
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/GitHub_Secrets-6e5494?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Secrets" />
</p>

### **Plataforma de despliegue**:

<p align="left">
  <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS EC2" />
  <img src="https://img.shields.io/badge/AWS_ECR-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS ECR" />
</p>
