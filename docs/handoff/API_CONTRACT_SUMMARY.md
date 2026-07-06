# Resumen de Contrato API - UPS ExpresosApp API

Tabla completa de los 40 endpoints disponibles en la API, organizados por modulo.

## Leyenda

| Columna | Descripcion |
|---------|-------------|
| **Metodo** | HTTP method (GET, POST, PATCH) |
| **Ruta** | Path del endpoint |
| **Modulo** | Modulo de NestJS al que pertenece |
| **Proteccion** | Tipo de autenticacion requerida |
| **Rol** | Roles permitidos para acceder |
| **Usado por** | Equipo frontend que consume el endpoint |

### Valores de Proteccion

| Valor | Descripcion |
|-------|-------------|
| Publico | No requiere autenticacion |
| JWT | Requiere header `Authorization: Bearer <accessToken>` |

### Valores de Rol

| Valor | Descripcion |
|-------|-------------|
| - | Sin restriccion de rol |
| Any | Cualquier usuario autenticado |
| ADMIN, SUPER_ADMIN | Solo administradores |
| STUDENT, ADMIN, SUPER_ADMIN | Estudiantes y administradores |

---

## Health (2 endpoints)

| Metodo | Ruta | Modulo | Proteccion | Rol | Usado por |
|--------|------|--------|------------|-----|-----------|
| GET | `/health` | Health | Publico | - | Both |
| GET | `/health/db` | Health | Publico | - | Both |

---

## Auth (5 endpoints)

| Metodo | Ruta | Modulo | Proteccion | Rol | Usado por |
|--------|------|--------|------------|-----|-----------|
| POST | `/auth/request-code` | Auth | Publico | - | Both |
| POST | `/auth/verify-code` | Auth | Publico | - | Both |
| POST | `/auth/refresh` | Auth | Publico | - | Both |
| POST | `/auth/logout` | Auth | Publico | - | Both |
| GET | `/auth/me` | Auth | JWT | Any | Both |

---

## Admin Routes (5 endpoints)

| Metodo | Ruta | Modulo | Proteccion | Rol | Usado por |
|--------|------|--------|------------|-----|-----------|
| POST | `/admin/routes` | Admin Routes | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/routes` | Admin Routes | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/routes/:id` | Admin Routes | JWT | ADMIN, SUPER_ADMIN | Web |
| PATCH | `/admin/routes/:id` | Admin Routes | JWT | ADMIN, SUPER_ADMIN | Web |
| PATCH | `/admin/routes/:id/stops/order` | Admin Routes | JWT | ADMIN, SUPER_ADMIN | Web |

---

## Admin Stops (4 endpoints)

| Metodo | Ruta | Modulo | Proteccion | Rol | Usado por |
|--------|------|--------|------------|-----|-----------|
| POST | `/admin/stops` | Admin Stops | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/stops` | Admin Stops | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/stops/:id` | Admin Stops | JWT | ADMIN, SUPER_ADMIN | Web |
| PATCH | `/admin/stops/:id` | Admin Stops | JWT | ADMIN, SUPER_ADMIN | Web |

---

## Admin Schedules (4 endpoints)

| Metodo | Ruta | Modulo | Proteccion | Rol | Usado por |
|--------|------|--------|------------|-----|-----------|
| POST | `/admin/schedules` | Admin Schedules | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/schedules` | Admin Schedules | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/schedules/:id` | Admin Schedules | JWT | ADMIN, SUPER_ADMIN | Web |
| PATCH | `/admin/schedules/:id` | Admin Schedules | JWT | ADMIN, SUPER_ADMIN | Web |

---

## Admin Vehicles (4 endpoints)

| Metodo | Ruta | Modulo | Proteccion | Rol | Usado por |
|--------|------|--------|------------|-----|-----------|
| POST | `/admin/vehicles` | Admin Vehicles | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/vehicles` | Admin Vehicles | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/vehicles/:id` | Admin Vehicles | JWT | ADMIN, SUPER_ADMIN | Web |
| PATCH | `/admin/vehicles/:id` | Admin Vehicles | JWT | ADMIN, SUPER_ADMIN | Web |

---

## Admin Drivers (4 endpoints)

| Metodo | Ruta | Modulo | Proteccion | Rol | Usado por |
|--------|------|--------|------------|-----|-----------|
| POST | `/admin/drivers` | Admin Drivers | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/drivers` | Admin Drivers | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/drivers/:id` | Admin Drivers | JWT | ADMIN, SUPER_ADMIN | Web |
| PATCH | `/admin/drivers/:id` | Admin Drivers | JWT | ADMIN, SUPER_ADMIN | Web |

---

## Admin Notices (4 endpoints)

| Metodo | Ruta | Modulo | Proteccion | Rol | Usado por |
|--------|------|--------|------------|-----|-----------|
| POST | `/admin/notices` | Admin Notices | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/notices` | Admin Notices | JWT | ADMIN, SUPER_ADMIN | Web |
| GET | `/admin/notices/:id` | Admin Notices | JWT | ADMIN, SUPER_ADMIN | Web |
| PATCH | `/admin/notices/:id` | Admin Notices | JWT | ADMIN, SUPER_ADMIN | Web |

---

## Mobile (5 endpoints)

| Metodo | Ruta | Modulo | Proteccion | Rol | Usado por |
|--------|------|--------|------------|-----|-----------|
| GET | `/mobile/routes` | Mobile | JWT | STUDENT, ADMIN, SUPER_ADMIN | Mobile |
| GET | `/mobile/routes/:id` | Mobile | JWT | STUDENT, ADMIN, SUPER_ADMIN | Mobile |
| GET | `/mobile/routes/:id/stops` | Mobile | JWT | STUDENT, ADMIN, SUPER_ADMIN | Mobile |
| GET | `/mobile/routes/:id/schedules` | Mobile | JWT | STUDENT, ADMIN, SUPER_ADMIN | Mobile |
| GET | `/mobile/notices` | Mobile | JWT | STUDENT, ADMIN, SUPER_ADMIN | Mobile |

---

## Trip Feedback (3 endpoints)

| Metodo | Ruta | Modulo | Proteccion | Rol | Usado por |
|--------|------|--------|------------|-----|-----------|
| POST | `/trip-feedback` | Trip Feedback | JWT | Any | Mobile |
| GET | `/trip-feedback` | Trip Feedback | JWT | Any | Both |
| GET | `/trip-feedback/:id` | Trip Feedback | JWT | Any | Both |

---

## Resumen por equipo consumidor

### Web Admin (React) - 28 endpoints

| Categoria | Cantidad | Endpoints |
|-----------|----------|-----------|
| Auth | 5 | request-code, verify-code, refresh, logout, me |
| Admin Routes | 5 | CRUD + order stops |
| Admin Stops | 4 | CRUD |
| Admin Schedules | 4 | CRUD |
| Admin Vehicles | 4 | CRUD |
| Admin Drivers | 4 | CRUD |
| Admin Notices | 4 | CRUD |
| Trip Feedback | 2 | list, detail |
| **Total** | **28** | |

### App Movil (Expo) - 13 endpoints

| Categoria | Cantidad | Endpoints |
|-----------|----------|-----------|
| Auth | 5 | request-code, verify-code, refresh, logout, me |
| Mobile Routes | 5 | list, detail, stops, schedules, notices |
| Trip Feedback | 3 | create, list, detail |
| **Total** | **13** | |

### Ambos equipos - 8 endpoints compartidos

| Categoria | Cantidad | Endpoints |
|-----------|----------|-----------|
| Health | 2 | health, health/db |
| Auth | 5 | request-code, verify-code, refresh, logout, me |
| Trip Feedback | 2 | list, detail |
| **Total** | **8** | |

---

## Resumen por tipo de operacion

| Metodo | Cantidad | Descripcion |
|--------|----------|-------------|
| GET | 25 | Lectura de datos |
| POST | 9 | Creacion de recursos + auth |
| PATCH | 6 | Actualizacion parcial |
| **Total** | **40** | |

---

## Resumen por nivel de proteccion

| Proteccion | Cantidad | Endpoints |
|------------|----------|-----------|
| Publico | 5 | health, health/db, request-code, verify-code, refresh |
| JWT (Any) | 8 | me, logout, trip-feedback (3), admin/* (no, estos son ADMIN) |
| JWT (ADMIN) | 25 | Todos los /admin/* |
| JWT (STUDENT+) | 5 | Todos los /mobile/* |

> **Nota:** El endpoint `/auth/logout` esta marcado como `@Public()` en el controlador pero se recomienda enviar el Bearer token. El endpoint `/auth/refresh` tambien es publico.

---

## Endpoints publicos (sin autenticacion)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/health` | Health check basico |
| GET | `/health/db` | Health check de base de datos |
| POST | `/auth/request-code` | Solicitar codigo OTP |
| POST | `/auth/verify-code` | Verificar OTP y obtener tokens |
| POST | `/auth/refresh` | Renovar access token |

---

## Endpoints con rate limiting especial

| Metodo | Ruta | Limite | Ventana |
|--------|------|--------|---------|
| POST | `/auth/request-code` | 3 requests | 60 segundos |
| POST | `/auth/verify-code` | 3 requests | 60 segundos |
| Todos los demas | - | 10 requests | 60 segundos |
