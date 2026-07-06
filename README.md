# UPS ExpresosApp API

Backend API for UPS ExpresosApp MVP - Institutional transport management system for Universidad Politécnica Salesiana.

## Stack

- NestJS + TypeScript
- Prisma ORM
- PostgreSQL
- pnpm
- Docker Compose

## Prerequisites

- Node.js v24.17.0+
- pnpm 11.8.0+
- Docker & Docker Compose (for PostgreSQL)

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Start PostgreSQL:

```bash
docker compose up -d
```

3. Apply database migrations:

```bash
pnpm run prisma:migrate
```

4. Generate Prisma client:

```bash
pnpm run prisma:generate
```

5. Seed demo data:

```bash
pnpm run prisma:seed
```

6. Start development server:

```bash
pnpm run start:dev
```

The API will be available at `http://localhost:3000` and Swagger docs at `http://localhost:3000/docs`.

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed.

```bash
cp .env.example .env
```

Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` - JWT secrets
- `ALLOWED_EMAIL_DOMAINS` - Comma-separated allowed institutional domains
- `SUPER_ADMIN_EMAILS` - Comma-separated super admin emails
- `AUTH_DEV_EXPOSE_OTP` - Exposes OTP in response for development only

## Scripts

- `pnpm run start:dev` - Start with hot reload
- `pnpm run build` - Build for production
- `pnpm run start:prod` - Run production build
- `pnpm run lint` - Run ESLint
- `pnpm run typecheck` - Run TypeScript type checking
- `pnpm run test` - Run unit tests
- `pnpm run test:e2e` - Run end-to-end tests
- `pnpm run prisma:generate` - Generate Prisma client
- `pnpm run prisma:migrate` - Run Prisma migrations
- `pnpm run prisma:seed` - Seed database
- `pnpm run prisma:studio` - Open Prisma Studio

## Project Structure

```
src/
  common/        # Shared types, DTOs, decorators, guards, filters, utils
  config/        # App configuration and environment validation
  database/      # Prisma module and service
  modules/       # Feature modules
    auth/        # OTP authentication and JWT
    health/      # Health checks
    users/       # User management
prisma/
  schema.prisma  # Database schema
  seed.ts        # Database seed script
```

## Authentication

The API uses OTP-based authentication:

1. Request a verification code: `POST /auth/request-code`
2. Verify the code: `POST /auth/verify-code`
3. Use the returned access token as a Bearer token
4. Refresh tokens via `POST /auth/refresh`

## Notes

- PostgreSQL runs on port `5433` externally to avoid conflicts with other local databases.
- Do not enable `AUTH_DEV_EXPOSE_OTP` in production.
- Default JWT secrets must be changed in production.
# ups-api
