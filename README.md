# POS Nest API

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![TypeORM](https://img.shields.io/badge/TypeORM-262626?logo=typeorm&logoColor=white)](https://typeorm.io)
[![class-validator](https://img.shields.io/badge/class--validator-5A67D8?logo=checkmarx&logoColor=white)](https://github.com/typestack/class-validator)
[![class-transformer](https://img.shields.io/badge/class--transformer-3182CE?logo=codecov&logoColor=white)](https://github.com/typestack/class-transformer)
[![date-fns](https://img.shields.io/badge/date--fns-770C53?logo=javascript&logoColor=white)](https://date-fns.org)

API REST para un proyecto de práctica de punto de venta (POS). Implementa CRUD completo para categorías, productos y transacciones, con validaciones, control de inventario, paginación y persistencia en PostgreSQL mediante TypeORM.

## ✨ Características

- **CRUD de categorías y productos** con relaciones y validaciones.
- **Módulo de transacciones** con detalles de venta y control de inventario.
- Validaciones con `class-validator` y `ValidationPipe` personalizado.
- Filtro por categoría y paginación en listados de productos.
- Filtro por fecha en transacciones.
- **Transacciones atómicas** (ACID) para garantizar consistencia de datos.
- Control automático de inventario (descuento en venta, devolución en eliminación).
- Relación `Category (1) -> (N) Product` y `Transaction (1) -> (N) TransactionContents`.
- Persistencia en PostgreSQL con TypeORM.

## 🧱 Stack

- NestJS + TypeScript
- PostgreSQL
- TypeORM
- class-validator / class-transformer
- date-fns (filtrado de fechas)

## 📁 Estructura principal

- [src/categories](src/categories) - Gestión de categorías
- [src/products](src/products) - Gestión de productos
- [src/transactions](src/transactions) - Gestión de transacciones/ventas
- [src/common/pipes](src/common/pipes) - Pipes personalizados
- [src/config](src/config) - Configuraciones globales

## ⚙️ Configuración

1) Instalar dependencias

```bash
npm install
```

2) Variables de entorno

Crea un archivo `.env` en la raíz con:

```bash
DATABASE_URL=postgres://usuario:password@localhost:5432/posnest
PORT=3000
```

> Nota: La conexión usa SSL en `typeorm.config.ts`. Para proveedores locales puede requerir `?sslmode=require` o ajustar el SSL según tu entorno.

3) Ejecutar en desarrollo

```bash
npm run start:dev
```

La API quedará disponible en: `http://localhost:3000`.

## 🧪 Scripts útiles

- `npm run start:dev` → servidor en modo watch
- `npm run start` → servidor normal
- `npm run build` → build de producción
- `npm run test` → pruebas unitarias
- `npm run test:e2e` → pruebas e2e

## 📚 Endpoints

Base URL: `http://localhost:3000`

### Categorías

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/categories` | Crear categoría |
| GET | `/categories` | Listar todas las categorías |
| GET | `/categories/:id` | Obtener una categoría |
| PATCH | `/categories/:id` | Actualizar categoría |
| DELETE | `/categories/:id` | Eliminar categoría |

**Body (crear / actualizar):**

```json
{
  "name": "Bebidas"
}
```

---

### Productos

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/products` | Crear producto |
| GET | `/products` | Listar productos (con filtros) |
| GET | `/products/:id` | Obtener un producto |
| PATCH | `/products/:id` | Actualizar producto |
| DELETE | `/products/:id` | Eliminar producto |

**Query params (opcionales):**

- `category_id` (number): filtra por categoría.
- `take` (number): límite de resultados (default: 10).
- `skip` (number): desplazamiento (default: 0).

**Ejemplo:**

```
GET /products?category_id=1&take=20&skip=0
```

**Body (crear / actualizar):**

```json
{
  "name": "Coca Cola",
  "price": 1.50,
  "inventory": 24,
  "categoryId": 1
}
```

> El campo `image` tiene valor por defecto `default.svg` si no se asigna.

---

### Transacciones (Ventas)

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/transactions` | Registrar una venta |
| GET | `/transactions` | Listar transacciones (con filtro de fecha) |
| GET | `/transactions/:id` | Obtener una transacción completa |
| DELETE | `/transactions/:id` | Eliminar transacción y devolver inventario |

**Query params (opcionales):**

- `transactionDate` (string): filtra transacciones por fecha (formato ISO: `YYYY-MM-DD`).

**Ejemplo:**

```
GET /transactions?transactionDate=2026-02-03
```

**Body (crear transacción):**

```json
{
  "total": 45.50,
  "contents": [
    {
      "productId": 5,
      "quantity": 2,
      "price": 22.75
    },
    {
      "productId": 8,
      "quantity": 1,
      "price": 22.75
    }
  ]
}
```

**Respuesta (transacción creada):**

```json
{
  "message": "Venta almacenada correctamente."
}
```

**Respuesta (transacción obtenida):**

```json
{
  "id": 21,
  "total": 45.50,
  "transactionDate": "2026-02-03T17:30:00.000Z",
  "contents": [
    {
      "id": 42,
      "quantity": 2,
      "price": "22.75",
      "product": {
        "id": 5,
        "name": "Coca Cola",
        "price": "2.50",
        "inventory": 12,
        "categoryId": 1,
        "category": {
          "id": 1,
          "name": "Bebidas"
        }
      }
    }
  ]
}
```

## 🔄 Flujo de Transacciones

1. **Crear transacción**: Se valida que los productos existan y haya inventario suficiente.
2. **Descuento automático**: Se resta el `quantity` del `inventory` de cada producto.
3. **Transacción atómica**: Si algo falla, se revierte todo (ACID).
4. **Eliminar transacción**: Se devuelven automáticamente las unidades al inventario.

> **Importante**: Las transacciones se ejecutan dentro de un contexto transaccional de BD para garantizar consistencia.

## ✅ Validaciones destacadas

- `IdValidationPipe` para parámetros `:id` inválidos.
- Campos obligatorios en DTOs.
- `price` admite hasta 2 decimales en productos y transacciones.
- `inventory` y `quantity` son números enteros.
- Validación de existencia de categorías y productos.
- Validación de inventario disponible antes de venta.
- Validación de formato de fecha en filtros.

## 📊 Relaciones de Base de Datos

```
Category (1) ──→ (N) Product
                      ↓
                 (N) TransactionsContents
                      ↑
                 (1) Transaction
```

## 🗺️ Próximos pasos (ideas)

- Autenticación y roles (Admin, Cashier, Viewer).
- Reportes y métricas de ventas.
- Gestión de usuarios y permisos.
- Historial de cambios de precios.
- Integración con métodos de pago.
- Manejo de imágenes de productos.
- Descuentos y promociones.

---

Proyecto de práctica personal con enfoque en buenas prácticas de backend en NestJS, transacciones atómicas y control de inventario.

## 👨‍💻 Autor

Errold Núñez Sánchez

## ✉️ Contacto

[![GitHub](https://img.shields.io/badge/GitHub-Errold146-181717?logo=github)](https://github.com/Errold146)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ErroldNúñezS-0A66C2?logo=linkedin)](https://linkedin.com/in/errold-núñez-sánchez) 
[![Email](https://img.shields.io/badge/Email-ErroldNúñezS-D14836?logo=gmail)](mailto:errold222@gmail.com)