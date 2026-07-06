import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, enabled: boolean, path: string): void {
  if (!enabled) return;

  const config = new DocumentBuilder()
    .setTitle('UPS ExpresosApp API')
    .setDescription(
      'Backend API for UPS ExpresosApp MVP - Institutional transport management system for Universidad Politécnica Salesiana. ' +
      'This phase includes: OTP-based authentication, route management, stops, schedules, vehicles, drivers, notices, and audit logging.'
    )
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', 'Local development')
    .addServer('https://ups-api-sfq9.onrender.com', 'Production (Render)')
    .addServer('https://staging-api.example.com', 'Staging environment (placeholder)')
    .addBearerAuth()
    .addTag('Health', 'Service health checks')
    .addTag('Auth', 'Authentication and OTP verification')
    .addTag('Users', 'User management')
    .addTag('Mobile', 'Mobile read-only API for students')
    .addTag('Admin Routes', 'Admin route management')
    .addTag('Admin Stops', 'Admin stop management')
    .addTag('Admin Schedules', 'Admin schedule management')
    .addTag('Admin Vehicles', 'Admin vehicle management')
    .addTag('Admin Drivers', 'Admin driver management')
    .addTag('Admin Notices', 'Admin notice management')
    .addTag('Trip Feedback', 'Trip feedback and ratings from students')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
