import {
  DayOfWeek,
  DriverStatus,
  NoticeSeverity,
  RouteStatus,
  ScheduleStatus,
  UserRole,
  VehicleStatus,
} from '@prisma/client';

export interface DemoUserSeed {
  email: string;
  name: string;
  role: UserRole;
}

export interface DemoRouteSeed {
  key: string;
  name: string;
  description: string;
  direction: string;
  status: RouteStatus;
}

export interface DemoStopSeed {
  key: string;
  name: string;
  reference: string;
  latitude: number;
  longitude: number;
}

export interface DemoRouteStopSeed {
  routeKey: string;
  stopKey: string;
  stopOrder: number;
  estimatedArrivalMinutes: number;
  notes?: string;
}

export interface DemoScheduleSeed {
  routeKey: string;
  dayOfWeek: DayOfWeek;
  direction: string;
  departureTime: string;
  approximateArrivalTime: string;
  status: ScheduleStatus;
}

export interface DemoVehicleSeed {
  plate: string;
  code: string;
  capacity: number;
  status: VehicleStatus;
}

export interface DemoDriverSeed {
  name: string;
  phone: string;
  licenseNumber: string;
  status: DriverStatus;
  assignedVehicleCode: string;
  assignedRouteKey: string;
}

export interface DemoNoticeSeed {
  title: string;
  message: string;
  severity: NoticeSeverity;
  publishedOffsetDays: number;
  expiresAfterDays?: number;
  createdByEmail: string;
}

export interface DemoTripFeedbackSeed {
  userEmail: string;
  routeKey: string;
  driverName?: string;
  rating: number;
  comment: string;
  travelOffsetDays: number;
}

export interface DemoCatalog {
  users: DemoUserSeed[];
  routes: DemoRouteSeed[];
  stops: DemoStopSeed[];
  routeStops: DemoRouteStopSeed[];
  schedules: DemoScheduleSeed[];
  vehicles: DemoVehicleSeed[];
  drivers: DemoDriverSeed[];
  notices: DemoNoticeSeed[];
  tripFeedbacks: DemoTripFeedbackSeed[];
}

const WEEKDAYS = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
];

function buildWeeklySchedules(
  routeKey: string,
  direction: string,
  slots: Array<{ departureTime: string; approximateArrivalTime: string }>,
): DemoScheduleSeed[] {
  return WEEKDAYS.flatMap((dayOfWeek) =>
    slots.map((slot) => ({
      routeKey,
      dayOfWeek,
      direction,
      departureTime: slot.departureTime,
      approximateArrivalTime: slot.approximateArrivalTime,
      status: ScheduleStatus.ACTIVE,
    })),
  );
}

export function shouldIncludeDemoData(nodeEnv: string | undefined, flag: string | undefined): boolean {
  const normalized = String(flag ?? '').trim().toLowerCase();
  if (normalized === '1' || normalized === 'true' || normalized === 'yes') {
    return true;
  }
  if (normalized === '0' || normalized === 'false' || normalized === 'no') {
    return false;
  }
  return nodeEnv !== 'production';
}

export function buildAllowedDomains(raw: string | undefined): string[] {
  return String(raw ?? 'ups.edu.ec,est.ups.edu.ec')
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean);
}

export function getDemoCatalog(): DemoCatalog {
  const users: DemoUserSeed[] = [
    { email: 'carlitosmoran245@gmail.com', name: 'Carlos Morán', role: UserRole.SUPER_ADMIN },
    { email: 'Ignacioflows594@gmail.com', name: 'Ignacio Flows', role: UserRole.ADMIN },
    { email: 'admin.flotas@ups.edu.ec', name: 'Javier Flotas', role: UserRole.ADMIN },
    { email: 'coordinacion.movilidad@ups.edu.ec', name: 'Pamela Movilidad', role: UserRole.ADMIN },
    { email: 'movil1@est.ups.edu.ec', name: 'Andrea Campus Sur', role: UserRole.STUDENT },
    { email: 'movil2@est.ups.edu.ec', name: 'Mateo Campus Norte', role: UserRole.STUDENT },
    { email: 'movil3@est.ups.edu.ec', name: 'Sofía Ingeniería', role: UserRole.STUDENT },
    { email: 'movil4@est.ups.edu.ec', name: 'Diego Arquitectura', role: UserRole.STUDENT },
    { email: 'movil5@est.ups.edu.ec', name: 'Lucía Laboratorios', role: UserRole.STUDENT },
    { email: 'movil6@est.ups.edu.ec', name: 'Emilio Residencias', role: UserRole.STUDENT },
    { email: 'movil7@gmail.com', name: 'Carlos Demo Gmail', role: UserRole.STUDENT },
    { email: 'movil8@gmail.com', name: 'Valentina Externa', role: UserRole.STUDENT },
    { email: 'conductor.portal1@ups.edu.ec', name: 'Portal Conductor Uno', role: UserRole.DRIVER },
    { email: 'conductor.portal2@ups.edu.ec', name: 'Portal Conductor Dos', role: UserRole.DRIVER },
  ];

  const routes: DemoRouteSeed[] = [
    {
      key: 'campus-sur-ida',
      name: 'Ruta Campus Sur',
      description: 'Ruta troncal desde Terminal Principal hacia Campus Sur con paradas académicas.',
      direction: 'IDA',
      status: RouteStatus.ACTIVE,
    },
    {
      key: 'campus-sur-retorno',
      name: 'Ruta Campus Sur Retorno',
      description: 'Retorno desde Campus Sur hasta Terminal Principal.',
      direction: 'RETORNO',
      status: RouteStatus.ACTIVE,
    },
    {
      key: 'campus-norte-ida',
      name: 'Ruta Campus Norte',
      description: 'Cobertura matutina hacia bloques del sector norte.',
      direction: 'IDA',
      status: RouteStatus.ACTIVE,
    },
    {
      key: 'campus-norte-retorno',
      name: 'Ruta Campus Norte Retorno',
      description: 'Retorno desde Campus Norte con cobertura de parqueaderos y laboratorios.',
      direction: 'RETORNO',
      status: RouteStatus.ACTIVE,
    },
    {
      key: 'centro-historico-ida',
      name: 'Ruta Centro Histórico',
      description: 'Ruta extendida para estudiantes que se movilizan desde el centro de la ciudad.',
      direction: 'IDA',
      status: RouteStatus.ACTIVE,
    },
    {
      key: 'centro-historico-retorno',
      name: 'Ruta Centro Histórico Retorno',
      description: 'Retorno vespertino para la ruta del centro histórico.',
      direction: 'RETORNO',
      status: RouteStatus.ACTIVE,
    },
    {
      key: 'intercampus-express',
      name: 'Intercampus Express',
      description: 'Ruta rápida entre bloques principales para horas pico.',
      direction: 'IDA',
      status: RouteStatus.SUSPENDED,
    },
  ];

  const stops: DemoStopSeed[] = [
    {
      key: 'terminal',
      name: 'Terminal Principal',
      reference: 'Punto central de salida de buses UPS.',
      latitude: -2.170998,
      longitude: -79.922359,
    },
    {
      key: 'biblioteca',
      name: 'Biblioteca Central',
      reference: 'Costado de la biblioteca central.',
      latitude: -2.1715,
      longitude: -79.923,
    },
    {
      key: 'cancha',
      name: 'Cancha Deportiva',
      reference: 'Frente a la cancha principal.',
      latitude: -2.172,
      longitude: -79.924,
    },
    {
      key: 'parking-norte',
      name: 'Parking Norte',
      reference: 'Estacionamiento norte del campus.',
      latitude: -2.173,
      longitude: -79.925,
    },
    {
      key: 'laboratorios',
      name: 'Bloque Laboratorios',
      reference: 'Ingreso lateral de laboratorios.',
      latitude: -2.1741,
      longitude: -79.9264,
    },
    {
      key: 'residencias',
      name: 'Residencias Universitarias',
      reference: 'Parada junto a residencias universitarias.',
      latitude: -2.1752,
      longitude: -79.9278,
    },
    {
      key: 'coliseo',
      name: 'Coliseo UPS',
      reference: 'Ingreso principal del coliseo.',
      latitude: -2.1761,
      longitude: -79.9291,
    },
    {
      key: 'rectorado',
      name: 'Rectorado',
      reference: 'Frente al edificio administrativo.',
      latitude: -2.1698,
      longitude: -79.9212,
    },
    {
      key: 'centro-historico',
      name: 'Centro Histórico',
      reference: 'Parada externa para estudiantes del centro.',
      latitude: -2.1961,
      longitude: -79.8862,
    },
    {
      key: 'malecon',
      name: 'Malecón Universitario',
      reference: 'Junto a la parada urbana del malecón.',
      latitude: -2.1894,
      longitude: -79.8804,
    },
    {
      key: 'facultad-ciencias',
      name: 'Facultad de Ciencias',
      reference: 'Parada frente a la facultad.',
      latitude: -2.1748,
      longitude: -79.9289,
    },
    {
      key: 'auditorio',
      name: 'Auditorio Principal',
      reference: 'Acceso principal del auditorio.',
      latitude: -2.1729,
      longitude: -79.9257,
    },
  ];

  const routeStops: DemoRouteStopSeed[] = [
    { routeKey: 'campus-sur-ida', stopKey: 'terminal', stopOrder: 1, estimatedArrivalMinutes: 0, notes: 'Salida inicial' },
    { routeKey: 'campus-sur-ida', stopKey: 'biblioteca', stopOrder: 2, estimatedArrivalMinutes: 6 },
    { routeKey: 'campus-sur-ida', stopKey: 'cancha', stopOrder: 3, estimatedArrivalMinutes: 12 },
    { routeKey: 'campus-sur-ida', stopKey: 'auditorio', stopOrder: 4, estimatedArrivalMinutes: 18 },
    { routeKey: 'campus-sur-ida', stopKey: 'residencias', stopOrder: 5, estimatedArrivalMinutes: 26 },

    { routeKey: 'campus-sur-retorno', stopKey: 'residencias', stopOrder: 1, estimatedArrivalMinutes: 0, notes: 'Inicio retorno' },
    { routeKey: 'campus-sur-retorno', stopKey: 'auditorio', stopOrder: 2, estimatedArrivalMinutes: 7 },
    { routeKey: 'campus-sur-retorno', stopKey: 'cancha', stopOrder: 3, estimatedArrivalMinutes: 13 },
    { routeKey: 'campus-sur-retorno', stopKey: 'biblioteca', stopOrder: 4, estimatedArrivalMinutes: 18 },
    { routeKey: 'campus-sur-retorno', stopKey: 'terminal', stopOrder: 5, estimatedArrivalMinutes: 25 },

    { routeKey: 'campus-norte-ida', stopKey: 'terminal', stopOrder: 1, estimatedArrivalMinutes: 0 },
    { routeKey: 'campus-norte-ida', stopKey: 'rectorado', stopOrder: 2, estimatedArrivalMinutes: 4 },
    { routeKey: 'campus-norte-ida', stopKey: 'parking-norte', stopOrder: 3, estimatedArrivalMinutes: 10 },
    { routeKey: 'campus-norte-ida', stopKey: 'laboratorios', stopOrder: 4, estimatedArrivalMinutes: 16 },
    { routeKey: 'campus-norte-ida', stopKey: 'facultad-ciencias', stopOrder: 5, estimatedArrivalMinutes: 21 },

    { routeKey: 'campus-norte-retorno', stopKey: 'facultad-ciencias', stopOrder: 1, estimatedArrivalMinutes: 0 },
    { routeKey: 'campus-norte-retorno', stopKey: 'laboratorios', stopOrder: 2, estimatedArrivalMinutes: 5 },
    { routeKey: 'campus-norte-retorno', stopKey: 'parking-norte', stopOrder: 3, estimatedArrivalMinutes: 11 },
    { routeKey: 'campus-norte-retorno', stopKey: 'rectorado', stopOrder: 4, estimatedArrivalMinutes: 16 },
    { routeKey: 'campus-norte-retorno', stopKey: 'terminal', stopOrder: 5, estimatedArrivalMinutes: 23 },

    { routeKey: 'centro-historico-ida', stopKey: 'centro-historico', stopOrder: 1, estimatedArrivalMinutes: 0 },
    { routeKey: 'centro-historico-ida', stopKey: 'malecon', stopOrder: 2, estimatedArrivalMinutes: 10 },
    { routeKey: 'centro-historico-ida', stopKey: 'terminal', stopOrder: 3, estimatedArrivalMinutes: 24 },
    { routeKey: 'centro-historico-ida', stopKey: 'biblioteca', stopOrder: 4, estimatedArrivalMinutes: 31 },
    { routeKey: 'centro-historico-ida', stopKey: 'coliseo', stopOrder: 5, estimatedArrivalMinutes: 39 },

    { routeKey: 'centro-historico-retorno', stopKey: 'coliseo', stopOrder: 1, estimatedArrivalMinutes: 0 },
    { routeKey: 'centro-historico-retorno', stopKey: 'biblioteca', stopOrder: 2, estimatedArrivalMinutes: 7 },
    { routeKey: 'centro-historico-retorno', stopKey: 'terminal', stopOrder: 3, estimatedArrivalMinutes: 15 },
    { routeKey: 'centro-historico-retorno', stopKey: 'malecon', stopOrder: 4, estimatedArrivalMinutes: 29 },
    { routeKey: 'centro-historico-retorno', stopKey: 'centro-historico', stopOrder: 5, estimatedArrivalMinutes: 40 },

    { routeKey: 'intercampus-express', stopKey: 'rectorado', stopOrder: 1, estimatedArrivalMinutes: 0, notes: 'Ruta suspendida para demo de estados' },
    { routeKey: 'intercampus-express', stopKey: 'biblioteca', stopOrder: 2, estimatedArrivalMinutes: 4 },
    { routeKey: 'intercampus-express', stopKey: 'laboratorios', stopOrder: 3, estimatedArrivalMinutes: 9 },
    { routeKey: 'intercampus-express', stopKey: 'coliseo', stopOrder: 4, estimatedArrivalMinutes: 14 },
  ];

  const schedules: DemoScheduleSeed[] = [
    ...buildWeeklySchedules('campus-sur-ida', 'IDA', [
      { departureTime: '06:45', approximateArrivalTime: '07:12' },
      { departureTime: '07:30', approximateArrivalTime: '07:57' },
      { departureTime: '12:15', approximateArrivalTime: '12:42' },
    ]),
    ...buildWeeklySchedules('campus-sur-retorno', 'RETORNO', [
      { departureTime: '13:10', approximateArrivalTime: '13:35' },
      { departureTime: '17:40', approximateArrivalTime: '18:05' },
      { departureTime: '20:00', approximateArrivalTime: '20:25' },
    ]),
    ...buildWeeklySchedules('campus-norte-ida', 'IDA', [
      { departureTime: '06:30', approximateArrivalTime: '06:52' },
      { departureTime: '11:50', approximateArrivalTime: '12:12' },
      { departureTime: '16:15', approximateArrivalTime: '16:37' },
    ]),
    ...buildWeeklySchedules('campus-norte-retorno', 'RETORNO', [
      { departureTime: '07:05', approximateArrivalTime: '07:28' },
      { departureTime: '12:30', approximateArrivalTime: '12:53' },
      { departureTime: '18:10', approximateArrivalTime: '18:33' },
    ]),
    ...buildWeeklySchedules('centro-historico-ida', 'IDA', [
      { departureTime: '05:55', approximateArrivalTime: '06:34' },
      { departureTime: '14:10', approximateArrivalTime: '14:49' },
    ]),
    ...buildWeeklySchedules('centro-historico-retorno', 'RETORNO', [
      { departureTime: '07:20', approximateArrivalTime: '08:00' },
      { departureTime: '19:10', approximateArrivalTime: '19:50' },
    ]),
    ...buildWeeklySchedules('intercampus-express', 'IDA', [
      { departureTime: '09:00', approximateArrivalTime: '09:14' },
      { departureTime: '15:00', approximateArrivalTime: '15:14' },
    ]).map((schedule) => ({ ...schedule, status: ScheduleStatus.INACTIVE })),
  ];

  const vehicles: DemoVehicleSeed[] = [
    { plate: 'PPN-1234', code: 'BUS-001', capacity: 40, status: VehicleStatus.ACTIVE },
    { plate: 'GSA-4501', code: 'BUS-002', capacity: 32, status: VehicleStatus.ACTIVE },
    { plate: 'PCD-7788', code: 'BUS-003', capacity: 28, status: VehicleStatus.ACTIVE },
    { plate: 'MBA-2201', code: 'BUS-004', capacity: 36, status: VehicleStatus.MAINTENANCE },
    { plate: 'UPE-9911', code: 'BUS-005', capacity: 24, status: VehicleStatus.INACTIVE },
  ];

  const drivers: DemoDriverSeed[] = [
    {
      name: 'Luis Herrera',
      phone: '+593991110001',
      licenseNumber: 'LIC-DEMO-001',
      status: DriverStatus.ACTIVE,
      assignedVehicleCode: 'BUS-001',
      assignedRouteKey: 'campus-sur-ida',
    },
    {
      name: 'María Paredes',
      phone: '+593991110002',
      licenseNumber: 'LIC-DEMO-002',
      status: DriverStatus.ACTIVE,
      assignedVehicleCode: 'BUS-002',
      assignedRouteKey: 'campus-norte-ida',
    },
    {
      name: 'José Cedeño',
      phone: '+593991110003',
      licenseNumber: 'LIC-DEMO-003',
      status: DriverStatus.ACTIVE,
      assignedVehicleCode: 'BUS-003',
      assignedRouteKey: 'centro-historico-ida',
    },
    {
      name: 'Ana Villacís',
      phone: '+593991110004',
      licenseNumber: 'LIC-DEMO-004',
      status: DriverStatus.ACTIVE,
      assignedVehicleCode: 'BUS-004',
      assignedRouteKey: 'campus-sur-retorno',
    },
    {
      name: 'Pedro Zambrano',
      phone: '+593991110005',
      licenseNumber: 'LIC-DEMO-005',
      status: DriverStatus.INACTIVE,
      assignedVehicleCode: 'BUS-005',
      assignedRouteKey: 'intercampus-express',
    },
  ];

  const notices: DemoNoticeSeed[] = [
    {
      title: 'Bienvenido a UPS ExpresosApp',
      message: 'El sistema de transporte institucional se encuentra operativo con datos completos de prueba.',
      severity: NoticeSeverity.INFO,
      publishedOffsetDays: -5,
      expiresAfterDays: 30,
      createdByEmail: 'admin.operaciones@ups.edu.ec',
    },
    {
      title: 'Mantenimiento preventivo de BUS-004',
      message: 'La unidad BUS-004 entrará a mantenimiento preventivo este fin de semana.',
      severity: NoticeSeverity.WARNING,
      publishedOffsetDays: -1,
      expiresAfterDays: 10,
      createdByEmail: 'admin.flotas@ups.edu.ec',
    },
    {
      title: 'Refuerzo de frecuencia Campus Sur',
      message: 'Se añadieron salidas en horas pico para Campus Sur durante el ciclo intensivo.',
      severity: NoticeSeverity.INFO,
      publishedOffsetDays: -2,
      expiresAfterDays: 20,
      createdByEmail: 'coordinacion.movilidad@ups.edu.ec',
    },
    {
      title: 'Prueba de ruta Intercampus Express',
      message: 'La ruta Intercampus Express se mantiene suspendida mientras se redefine la demanda.',
      severity: NoticeSeverity.WARNING,
      publishedOffsetDays: -3,
      expiresAfterDays: 15,
      createdByEmail: 'admin.operaciones@ups.edu.ec',
    },
    {
      title: 'Parada temporal junto a Auditorio',
      message: 'Por evento institucional la subida de pasajeros será junto al auditorio principal.',
      severity: NoticeSeverity.INFO,
      publishedOffsetDays: 0,
      expiresAfterDays: 7,
      createdByEmail: 'coordinacion.movilidad@ups.edu.ec',
    },
    {
      title: 'Inspección extraordinaria de flota',
      message: 'Se realizará una revisión de seguridad con prioridad alta sobre toda la flota activa.',
      severity: NoticeSeverity.CRITICAL,
      publishedOffsetDays: 1,
      expiresAfterDays: 5,
      createdByEmail: 'admin.flotas@ups.edu.ec',
    },
  ];

  const tripFeedbacks: DemoTripFeedbackSeed[] = [
    {
      userEmail: 'movil1@est.ups.edu.ec',
      routeKey: 'campus-sur-ida',
      driverName: 'Luis Herrera',
      rating: 5,
      comment: 'Ruta puntual y limpia, excelente atención del conductor.',
      travelOffsetDays: -6,
    },
    {
      userEmail: 'movil2@est.ups.edu.ec',
      routeKey: 'campus-norte-ida',
      driverName: 'María Paredes',
      rating: 4,
      comment: 'Buen servicio, pero sería útil una notificación antes de la salida.',
      travelOffsetDays: -5,
    },
    {
      userEmail: 'movil3@est.ups.edu.ec',
      routeKey: 'centro-historico-ida',
      driverName: 'José Cedeño',
      rating: 5,
      comment: 'Muy útil para llegar temprano desde el centro.',
      travelOffsetDays: -4,
    },
    {
      userEmail: 'movil4@est.ups.edu.ec',
      routeKey: 'campus-sur-retorno',
      driverName: 'Ana Villacís',
      rating: 3,
      comment: 'El retorno salió con algo de demora, pero el recorrido fue seguro.',
      travelOffsetDays: -4,
    },
    {
      userEmail: 'movil5@est.ups.edu.ec',
      routeKey: 'campus-norte-retorno',
      driverName: 'María Paredes',
      rating: 4,
      comment: 'Sería ideal ver el bus asignado dentro de la app.',
      travelOffsetDays: -3,
    },
    {
      userEmail: 'movil6@est.ups.edu.ec',
      routeKey: 'campus-sur-ida',
      driverName: 'Luis Herrera',
      rating: 5,
      comment: 'La nueva parada del auditorio mejora bastante el flujo.',
      travelOffsetDays: -3,
    },
    {
      userEmail: 'movil7@gmail.com',
      routeKey: 'centro-historico-retorno',
      driverName: 'José Cedeño',
      rating: 4,
      comment: 'Ruta clara y útil para estudiantes externos con clases nocturnas.',
      travelOffsetDays: -2,
    },
    {
      userEmail: 'movil8@gmail.com',
      routeKey: 'campus-norte-ida',
      driverName: 'María Paredes',
      rating: 5,
      comment: 'La información de horarios coincide con el viaje real.',
      travelOffsetDays: -2,
    },
    {
      userEmail: 'movil1@est.ups.edu.ec',
      routeKey: 'campus-sur-retorno',
      driverName: 'Ana Villacís',
      rating: 4,
      comment: 'El retorno de la tarde tuvo buena capacidad disponible.',
      travelOffsetDays: -1,
    },
    {
      userEmail: 'movil2@est.ups.edu.ec',
      routeKey: 'campus-norte-retorno',
      driverName: 'María Paredes',
      rating: 5,
      comment: 'Buena experiencia general y tiempos correctos.',
      travelOffsetDays: -1,
    },
    {
      userEmail: 'movil3@est.ups.edu.ec',
      routeKey: 'centro-historico-ida',
      driverName: 'José Cedeño',
      rating: 4,
      comment: 'La parada del malecón facilita el transbordo con otras líneas.',
      travelOffsetDays: 0,
    },
    {
      userEmail: 'movil4@est.ups.edu.ec',
      routeKey: 'campus-sur-ida',
      driverName: 'Luis Herrera',
      rating: 5,
      comment: 'Excelente visibilidad de la ruta en móvil y datos consistentes.',
      travelOffsetDays: 0,
    },
  ];

  return {
    users,
    routes,
    stops,
    routeStops,
    schedules,
    vehicles,
    drivers,
    notices,
    tripFeedbacks,
  };
}
