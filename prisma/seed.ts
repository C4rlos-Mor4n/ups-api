import {
  PrismaClient,
  UserRole,
  RouteStatus,
  DayOfWeek,
  ScheduleStatus,
  VehicleStatus,
  DriverStatus,
  NoticeSeverity,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Starting seed...');

  // 1. Allowed email domains
  const domains = (process.env['ALLOWED_EMAIL_DOMAINS'] ?? 'ups.edu.ec,est.ups.edu.ec')
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean);

  for (const domain of domains) {
    await prisma.allowedEmailDomain.upsert({
      where: { domain },
      update: {},
      create: { domain },
    });
  }
  console.log(`Seeded ${domains.length} allowed email domains`);

  // 2. Super admin users
  const superAdminEmails = (process.env['SUPER_ADMIN_EMAILS'] ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  for (const email of superAdminEmails) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        role: UserRole.SUPER_ADMIN,
        emailVerified: true,
      },
    });
  }
  console.log(`Seeded ${superAdminEmails.length} super admin users`);

  // 3. Demo data (only in development)
  if (process.env['NODE_ENV'] !== 'production') {
    // Create admin user for demo
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@ups.edu.ec' },
      update: {},
      create: {
        email: 'admin@ups.edu.ec',
        name: 'Admin Demo',
        role: UserRole.ADMIN,
        emailVerified: true,
      },
    });

    // Routes
    const route1 = await prisma.route.create({
      data: {
        name: 'Ruta Campus Sur',
        description: 'Ruta principal hacia campus sur',
        direction: 'IDA',
        status: RouteStatus.ACTIVE,
      },
    });

    const route2 = await prisma.route.create({
      data: {
        name: 'Ruta Campus Norte',
        description: 'Ruta hacia campus norte',
        direction: 'IDA',
        status: RouteStatus.ACTIVE,
      },
    });

    // Stops
    const stop1 = await prisma.stop.create({
      data: {
        name: 'Parada Entrada Principal',
        reference: 'Frente a puerta principal UPS',
        latitude: -2.170998,
        longitude: -79.922359,
      },
    });
    const stop2 = await prisma.stop.create({
      data: {
        name: 'Parada Biblioteca',
        reference: 'Junto a biblioteca central',
        latitude: -2.1715,
        longitude: -79.923,
      },
    });
    const stop3 = await prisma.stop.create({
      data: {
        name: 'Parada Cancha',
        reference: 'Frente a cancha deportiva',
        latitude: -2.172,
        longitude: -79.924,
      },
    });
    const stop4 = await prisma.stop.create({
      data: {
        name: 'Parada Parking Norte',
        reference: 'Estacionamiento norte',
        latitude: -2.173,
        longitude: -79.925,
      },
    });

    // Route stops
    await prisma.routeStop.createMany({
      data: [
        {
          routeId: route1.id,
          stopId: stop1.id,
          stopOrder: 1,
          estimatedArrivalMinutes: 0,
          notes: 'Inicio de ruta',
        },
        { routeId: route1.id, stopId: stop2.id, stopOrder: 2, estimatedArrivalMinutes: 10 },
        { routeId: route1.id, stopId: stop3.id, stopOrder: 3, estimatedArrivalMinutes: 20 },
        { routeId: route2.id, stopId: stop1.id, stopOrder: 1, estimatedArrivalMinutes: 0 },
        { routeId: route2.id, stopId: stop4.id, stopOrder: 2, estimatedArrivalMinutes: 15 },
      ],
    });

    // Schedules
    await prisma.schedule.createMany({
      data: [
        {
          routeId: route1.id,
          dayOfWeek: DayOfWeek.MONDAY,
          direction: 'IDA',
          departureTime: '07:00',
          approximateArrivalTime: '07:45',
          status: ScheduleStatus.ACTIVE,
        },
        {
          routeId: route1.id,
          dayOfWeek: DayOfWeek.MONDAY,
          direction: 'IDA',
          departureTime: '13:00',
          approximateArrivalTime: '13:45',
          status: ScheduleStatus.ACTIVE,
        },
        {
          routeId: route1.id,
          dayOfWeek: DayOfWeek.TUESDAY,
          direction: 'IDA',
          departureTime: '07:00',
          approximateArrivalTime: '07:45',
          status: ScheduleStatus.ACTIVE,
        },
        {
          routeId: route2.id,
          dayOfWeek: DayOfWeek.MONDAY,
          direction: 'IDA',
          departureTime: '07:30',
          approximateArrivalTime: '08:00',
          status: ScheduleStatus.ACTIVE,
        },
      ],
    });

    // Vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        plate: 'PPN-1234',
        code: 'BUS-001',
        capacity: 40,
        status: VehicleStatus.ACTIVE,
      },
    });

    // Driver
    await prisma.driver.create({
      data: {
        name: 'Conductor Demo',
        phone: '+593999999999',
        licenseNumber: 'LIC-DEMO-001',
        status: DriverStatus.ACTIVE,
        assignedVehicleId: vehicle.id,
        assignedRouteId: route1.id,
      },
    });

    // Notice
    await prisma.notice.create({
      data: {
        title: 'Bienvenido a UPS ExpresosApp',
        message: 'El sistema de transporte institucional ya se encuentra operativo.',
        severity: NoticeSeverity.INFO,
        publishedFrom: new Date(),
        createdById: adminUser.id,
      },
    });

    console.log('Demo data seeded successfully');
  }

  console.log('Seed completed!');
}

main()
  .catch((e: unknown) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
