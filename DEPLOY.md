# Deploy Guide - UPS ExpresosApp API

## Requisitos

- Node.js 20+ (LTS)
- PostgreSQL 16+
- pnpm 11+
- Docker (opcional, para PostgreSQL)

## Variables de Entorno para Producción

Crear archivo `.env` con:

```bash
# Aplicación
NODE_ENV=production
PORT=3000
APP_NAME="UPS ExpresosApp API"

# Base de datos
DATABASE_URL="postgresql://user:password@host:5432/ups_expresos?schema=public"

# JWT Secrets (MÍNIMO 32 caracteres, NO usar defaults)
JWT_ACCESS_SECRET="<generar-32-caracteres-minimo>"
JWT_REFRESH_SECRET="<generar-32-caracteres-minimo>"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# OTP
OTP_EXPIRES_MINUTES=10
OTP_MAX_ATTEMPTS=5
AUTH_DEV_EXPOSE_OTP=false  # SIEMPRE false en producción

# Dominios permitidos
ALLOWED_EMAIL_DOMAINS="ups.edu.ec,est.ups.edu.ec"
SUPER_ADMIN_EMAILS="admin1@ups.edu.ec,admin2@ups.edu.ec"

# CORS
CORS_ORIGINS="https://admin.ups.edu.ec,https://app.ups.edu.ec"

# Swagger (deshabilitar en producción)
SWAGGER_ENABLED=false
SWAGGER_PATH="docs"

# Throttling
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
THROTTLE_AUTH_TTL=60000
THROTTLE_AUTH_LIMIT=10

# SMTP (OBLIGATORIO en producción)
SMTP_HOST="smtp.ups.edu.ec"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="noreply@ups.edu.ec"
SMTP_PASS="<password>"
SMTP_FROM="noreply@ups.edu.ec"
```

## Instalación

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm build
```

## Ejecución

```bash
pnpm start:prod
```

## Reverse Proxy (nginx)

Configuración recomendada para nginx:

```nginx
server {
    listen 80;
    server_name api.ups.edu.ec;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**IMPORTANTE**: Los headers `X-Real-IP` y `X-Forwarded-For` son necesarios para que el throttling funcione correctamente. La API ya tiene `trust proxy` habilitado.

## Docker Compose (PostgreSQL)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: ups-expresos-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ups_expresos
      POSTGRES_USER: ups_user
      POSTGRES_PASSWORD: <password-seguro>
    ports:
      - "5432:5432"
    volumes:
      - ups_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ups_user -d ups_expresos"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  ups_pgdata:
```

## Checklist Pre-Deploy

- [ ] `NODE_ENV=production`
- [ ] `AUTH_DEV_EXPOSE_OTP=false`
- [ ] JWT secrets generados (mínimo 32 caracteres)
- [ ] SMTP configurado y probado
- [ ] `SWAGGER_ENABLED=false`
- [ ] `CORS_ORIGINS` restringido a dominios reales
- [ ] `SUPER_ADMIN_EMAILS` configurado
- [ ] Migraciones aplicadas (`pnpm prisma migrate deploy`)
- [ ] Reverse proxy configurado con headers X-Forwarded-For
- [ ] Firewall: solo puerto 80/443 expuestos
- [ ] Backups de PostgreSQL configurados

## Monitoreo

Logs de la aplicación:
```bash
# Si corre con PM2
pm2 logs ups-api

# Si corre con systemd
journalctl -u ups-api -f
```

Health checks:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/health/db
```

## Seguridad

- **Rate Limiting**: 10 requests/minuto global, 10 requests/minuto para auth
- **Helmet**: Headers de seguridad HTTP activos
- **CORS**: Restringido a dominios específicos
- **JWT**: Tokens con expiración corta (15min access, 7d refresh)
- **OTP**: Hasheado con scrypt, nunca almacenado en texto plano
- **Refresh Tokens**: Hasheados con SHA-256, rotación en cada uso

## Troubleshooting

### OTP no se envía
- Verificar configuración SMTP en `.env`
- Revisar logs: `pnpm start:prod 2>&1 | grep SMTP`
- Probar conexión SMTP: `telnet smtp.ups.edu.ec 587`

### Throttling bloquea todas las requests
- Verificar que reverse proxy envíe `X-Forwarded-For`
- Aumentar `THROTTLE_LIMIT` temporalmente
- Revisar logs de nginx

### Error de conexión a DB
- Verificar `DATABASE_URL` en `.env`
- Verificar que PostgreSQL esté corriendo: `docker ps`
- Probar conexión: `psql $DATABASE_URL`

## Contrato OpenAPI

El contrato OpenAPI (Swagger) está disponible en:
- Desarrollo: `http://localhost:3000/docs`
- Producción: Deshabilitado por seguridad

Para exportar el spec:
```bash
# Con la API corriendo
curl http://localhost:3000/docs-json > openapi-spec.json
```

Este archivo puede usarse para generar clientes en frontend/mobile.
