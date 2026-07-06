import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_NAME: z.string().default('UPS ExpresosApp API'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  OTP_EXPIRES_MINUTES: z.coerce.number().int().positive().default(10),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
  AUTH_DEV_EXPOSE_OTP: z.coerce.boolean().default(false),
  ALLOWED_EMAIL_DOMAINS: z.string().min(1),
  SUPER_ADMIN_EMAILS: z.string().default(''),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  SWAGGER_ENABLED: z.coerce.boolean().default(true),
  SWAGGER_PATH: z.string().default('docs'),
  THROTTLE_TTL: z.coerce.number().int().positive().default(60000),
  THROTTLE_LIMIT: z.coerce.number().int().positive().default(10),
  THROTTLE_AUTH_TTL: z.coerce.number().int().positive().default(60000),
  THROTTLE_AUTH_LIMIT: z.coerce.number().int().positive().default(3),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
}).refine(
  (data) => {
    if (data.NODE_ENV === 'production') {
      if (data.AUTH_DEV_EXPOSE_OTP) return false;
      if (data.JWT_ACCESS_SECRET.startsWith('change-me')) return false;
      if (data.JWT_REFRESH_SECRET.startsWith('change-me')) return false;
      // En producción, SMTP es obligatorio
      if (!data.SMTP_HOST || !data.SMTP_USER || !data.SMTP_PASS || !data.SMTP_FROM) {
        return false;
      }
    }
    return true;
  },
  { message: 'Production environment cannot use dev OTP exposure, default secrets, or missing SMTP config' },
);

export type EnvValidation = z.infer<typeof envSchema>;
