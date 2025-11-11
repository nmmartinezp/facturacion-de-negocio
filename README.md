# **FACTURACIÓN DE NEGOCIO**

## **Estructura del Proyecto**

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
