# POS Nest API

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![TypeORM](https://img.shields.io/badge/TypeORM-262626?logo=typeorm&logoColor=white)](https://typeorm.io)
[![class-validator](https://img.shields.io/badge/class--validator-5A67D8?logo=checkmarx&logoColor=white)](https://github.com/typestack/class-validator)
[![class-transformer](https://img.shields.io/badge/class--transformer-3182CE?logo=codecov&logoColor=white)](https://github.com/typestack/class-transformer)

API REST para un proyecto de práctica de punto de venta (POS). Implementa CRUD completo para categorías y productos, con validaciones, paginación básica y persistencia en PostgreSQL mediante TypeORM.

## ✨ Características

- CRUD de categorías y productos.
- Validaciones con `class-validator` y `ValidationPipe` global.
- Filtro por categoría y paginación simple en listados de productos.
- Relación `Category (1) -> (N) Product`.
- Persistencia en PostgreSQL con TypeORM.

## 🧱 Stack

- NestJS + TypeScript
- PostgreSQL
- TypeORM
- class-validator / class-transformer

## 📁 Estructura principal

- [src/categories](src/categories)
- [src/products](src/products)
- [src/common/pipes](src/common/pipes)
- [src/config](src/config)

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
| GET | `/categories` | Listar categorías |
| GET | `/categories/:id` | Obtener una categoría |
| PATCH | `/categories/:id` | Actualizar categoría |
| DELETE | `/categories/:id` | Eliminar categoría |

**Body (crear / actualizar):**

```json
{
  "name": "Bebidas"
}
```

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

## ✅ Validaciones destacadas

- `IdValidationPipe` para parámetros `:id` inválidos.
- Campos obligatorios en DTOs.
- `price` admite hasta 2 decimales.
- `inventory` y `categoryId` son numéricos.

## 🗺️ Próximos pasos (ideas)

- Autenticación y roles.
- Módulo de ventas y caja.
- Reportes y métricas.
- Manejo de imágenes reales.

---

Proyecto de práctica personal con enfoque en buenas prácticas de backend en NestJS.

## 👨‍💻 Autor

Errold Núñez Sánchez

## ✉️ Contacto
[![GitHub](https://img.shields.io/badge/GitHub-Errold146-181717?logo=github)](https://github.com/Errold146)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ErroldNúñezS-0A66C2?logo=linkedin)](https://linkedin.com/in/errold-núñez-sánchez) 
[![Email](https://img.shields.io/badge/Email-ErroldNúñezS-D14836?logo=gmail)](mailto:errold222@gmail.com)