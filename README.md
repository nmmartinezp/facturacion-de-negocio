# **DESPLIEGUE CONTINUO DE WEBAPP "FACTURACIÓN DE NEGOCIO" CON GITHUB ACTIONS**

Proyecto que implementa despliegue continuo en una webapp utilizando Github Actions para la automatización de tareas o pasos en el despliegue sobre AWS EC2.

<p align="center">
  <img src="assets/img/diagramas/Dga_cd.png" width="95%">
</p>

## **Estructura del Proyecto WebApp**

```bash
facturacion-de-negocio/
│
src/
├── app/
│   ├── (pages)/         # Rutas de Frontend
│   │   ├── home/        # Ejemplo de pagina (e.g. /home)
│   │   └── ...          # Otras paginas
│   └── api/v1/          # Rutas de API
│       ├── facturas/    # Ejemplo de endpoint (e.g. /api/facturas)
│       ├── emision/     # Ejemplo de endpoint (e.g. /api/emision)
│       └── ...          # Otras rutas o controladores
```

- Frontend (UI): inerfaz de usuario para el manejo de la facturación
- Backend (API): manejo de datos y emisión de la factura

## **Ejecución del proyecto (Docker)**

### **Metodo 1**: Ejecución con uso de `Dockerfile` (Construcción del proyecto)

### **Metodo 2**: Ejecución con uso de `Dockerfile.dev` (Desarrollo en caliente)

### **Variables de entorno**:

```bash
# 1RA OPCION DB CONFIG
DB_HOST=
DB_USER=
DB_PASSWORD=
# 2DA OPCION DB CONFIG
DB_URI=
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

## **Backend API Referencia**

#### **Ruta base**:

```http
/api/v1
```

#### **Ruta para healthckeck**:

```http
GET /api/v1/health
```

Respuesta Json esperada:

```json
{
  "status": "ok"
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
      "producto_id": 1,
      "cantidad": 2
    },
    {
      "producto_id": 5,
      "cantidad": 1
    },
    {
      "producto_id": 7,
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
      "fecha": "2025-01-10",
      "total": 250.0
    },
    {
      "id": 2,
      "cliente": "María Gómez",
      "fecha": "2025-01-11",
      "total": 480.3
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
    "fecha": "2025-01-11",
    "total": 480.3,
    "detalles": [
      {
        "id": 10,
        "producto_id": 3,
        "nombre_producto": "Monitor LED 24”",
        "precio": 180.1,
        "cantidad": 1,
        "subtotal": 180.1
      },
      {
        "id": 11,
        "producto_id": 8,
        "nombre_producto": "Teclado mecánico",
        "precio": 100.1,
        "cantidad": 3,
        "subtotal": 300.3
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

## **Tencologias Usadas**

### **Frontend**:

<p align="left">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
</p>

### **Backend**:

<p align="left">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
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
