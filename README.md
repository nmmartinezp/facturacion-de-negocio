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
│   ├── (front_ui)/(pages)/   # Rutas de Frontend
│   │   ├── home/             # Ejemplo de pagina (e.g. /home)
│   │   └── ...               # Otras paginas
│   └── (back_api/)api/v1/    # Rutas de API
│       ├── facturas/         # Ejemplo de endpoint (e.g. /api/facturas)
│       ├── emision/          # Ejemplo de endpoint (e.g. /api/emision)
│       └── ...               #  Otras rutas o controladores
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
