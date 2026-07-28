require('dotenv').config();
const crypto = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
const { JwtService } = require('@nestjs/jwt');

const BASE = 'https://robust-strong-cattle.ngrok-free.app';
const prisma = new PrismaClient();
const jwt = new JwtService();
const TS = String(Date.now());
const EMAIL = `endpoint.test.${TS}@gmail.com`;
const KNOWN_CODE = '123456';

async function http(method, path, body, token) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }
  return { status: res.status, body: parsed };
}

function summarizeBody(body) {
  const raw = typeof body === 'string' ? body : JSON.stringify(body);
  return raw.length > 180 ? raw.slice(0, 180) + '...' : raw;
}

async function main() {
  const results = [];
  const add = (endpoint, resp, okStatuses=[200,201]) => {
    results.push({ endpoint, status: resp.status, ok: okStatuses.includes(resp.status), note: summarizeBody(resp.body) });
  };

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const student = await prisma.user.findFirst({ where: { email: 'movil1@est.ups.edu.ec' } });
  const seedRoute = await prisma.route.findFirst({ orderBy: { createdAt: 'asc' } });
  const seedRouteStops = await prisma.routeStop.findMany({ where: { routeId: seedRoute.id }, orderBy: { stopOrder: 'asc' } });
  const adminToken = jwt.sign({ sub: admin.id, email: admin.email, role: admin.role }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' });
  const studentToken = jwt.sign({ sub: student.id, email: student.email, role: student.role }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' });

  add('GET /health', await http('GET', '/health'), [200]);
  add('GET /health/db', await http('GET', '/health/db'), [200]);

  add('POST /auth/request-code', await http('POST', '/auth/request-code', { email: EMAIL }), [201]);
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(KNOWN_CODE, salt, 32).toString('hex');
  await prisma.authVerificationCode.updateMany({
    where: { email: EMAIL },
    data: { codeHash: `${salt}:${hash}`, attempts: 0, usedAt: null, expiresAt: new Date(Date.now() + 10*60*1000) },
  });
  const verify = await http('POST', '/auth/verify-code', { email: EMAIL, code: KNOWN_CODE });
  add('POST /auth/verify-code', verify, [201]);
  const accessToken = verify.body.accessToken;
  const refreshToken = verify.body.refreshToken;
  add('GET /auth/me', await http('GET', '/auth/me', undefined, accessToken), [200]);
  const refresh = await http('POST', '/auth/refresh', { refreshToken });
  add('POST /auth/refresh', refresh, [201]);
  const refreshedAccess = refresh.body.accessToken;
  const refreshedRefresh = refresh.body.refreshToken;
  add('POST /auth/logout', await http('POST', '/auth/logout', { refreshToken: refreshedRefresh }, refreshedAccess), [201]);

  for (const path of ['/admin/routes','/admin/stops','/admin/schedules','/admin/vehicles','/admin/drivers','/admin/notices']) {
    add(`GET ${path}`, await http('GET', path, undefined, adminToken), [200]);
  }

  const created = {};
  let resp = await http('POST', '/admin/routes', { name: `Ruta QA ${TS}`, description: 'Ruta creada para prueba endpoint por endpoint', direction: 'IDA', status: 'ACTIVE', isActive: true }, adminToken);
  add('POST /admin/routes', resp, [201]);
  created.route = resp.body.id;

  resp = await http('POST', '/admin/stops', { name: `Parada QA ${TS}`, reference: 'Parada temporal QA', latitude: -2.1699, longitude: -79.9211, isActive: true }, adminToken);
  add('POST /admin/stops', resp, [201]);
  created.stop = resp.body.id;

  resp = await http('POST', '/admin/schedules', { routeId: created.route, dayOfWeek: 'MONDAY', direction: 'IDA', departureTime: '09:10', approximateArrivalTime: '09:40', status: 'ACTIVE' }, adminToken);
  add('POST /admin/schedules', resp, [201]);
  created.schedule = resp.body.id;

  resp = await http('POST', '/admin/vehicles', { plate: `QAT-${TS.slice(-4)}`, code: `BUS-QA-${TS.slice(-4)}`, capacity: 28, status: 'ACTIVE' }, adminToken);
  add('POST /admin/vehicles', resp, [201]);
  created.vehicle = resp.body.id;

  resp = await http('POST', '/admin/drivers', { name: `Chofer QA ${TS.slice(-4)}`, phone: '+593900000001', licenseNumber: `LIC-QA-${TS.slice(-4)}`, status: 'ACTIVE', assignedVehicleId: created.vehicle, assignedRouteId: created.route }, adminToken);
  add('POST /admin/drivers', resp, [201]);
  created.driver = resp.body.id;

  resp = await http('POST', '/admin/notices', { title: `Aviso QA ${TS}`, message: 'Aviso de prueba para validar endpoint', severity: 'INFO', publishedFrom: '2026-07-09T02:00:00.000Z', publishedUntil: '2026-07-20T02:00:00.000Z', isActive: true }, adminToken);
  add('POST /admin/notices', resp, [201]);
  created.notice = resp.body.id;

  for (const path of [
    `/admin/routes/${created.route}`,
    `/admin/stops/${created.stop}`,
    `/admin/schedules/${created.schedule}`,
    `/admin/vehicles/${created.vehicle}`,
    `/admin/drivers/${created.driver}`,
    `/admin/notices/${created.notice}`,
  ]) {
    add(`GET ${path}`, await http('GET', path, undefined, adminToken), [200]);
  }

  for (const [path, body] of [
    [`/admin/routes/${created.route}`, { description: 'Ruta QA actualizada', status: 'SUSPENDED' }],
    [`/admin/stops/${created.stop}`, { reference: 'Parada QA actualizada' }],
    [`/admin/schedules/${created.schedule}`, { approximateArrivalTime: '09:45' }],
    [`/admin/vehicles/${created.vehicle}`, { capacity: 30, status: 'MAINTENANCE' }],
    [`/admin/drivers/${created.driver}`, { phone: '+593900000002' }],
    [`/admin/notices/${created.notice}`, { message: 'Aviso QA actualizado', severity: 'WARNING' }],
  ]) {
    add(`PATCH ${path}`, await http('PATCH', path, body, adminToken), [200]);
  }

  const reordered = [...seedRouteStops].reverse().map((rs, index) => ({
    stopId: rs.stopId,
    stopOrder: index + 1,
    estimatedArrivalMinutes: (index + 1) * 7,
    notes: `QA reorder ${index + 1}`,
  }));
  add(`PATCH /admin/routes/${seedRoute.id}/stops/order`, await http('PATCH', `/admin/routes/${seedRoute.id}/stops/order`, { stops: reordered }, adminToken), [200]);

  const mobileRoutes = await http('GET', '/mobile/routes', undefined, studentToken);
  add('GET /mobile/routes', mobileRoutes, [200]);
  const mobileRouteId = mobileRoutes.body.data[0].id;
  add(`GET /mobile/routes/${mobileRouteId}`, await http('GET', `/mobile/routes/${mobileRouteId}`, undefined, studentToken), [200]);
  add(`GET /mobile/routes/${mobileRouteId}/stops`, await http('GET', `/mobile/routes/${mobileRouteId}/stops`, undefined, studentToken), [200]);
  add(`GET /mobile/routes/${mobileRouteId}/schedules`, await http('GET', `/mobile/routes/${mobileRouteId}/schedules`, undefined, studentToken), [200]);
  add('GET /mobile/notices', await http('GET', '/mobile/notices', undefined, studentToken), [200]);

  add('GET /trip-feedback', await http('GET', '/trip-feedback', undefined, studentToken), [200]);
  const trip = await http('POST', '/trip-feedback', { routeId: mobileRouteId, driverId: created.driver, rating: 4, comment: `Feedback QA ${TS}`, travelDate: '2026-07-09T02:05:00.000Z' }, studentToken);
  add('POST /trip-feedback', trip, [201]);
  add(`GET /trip-feedback/${trip.body.id}`, await http('GET', `/trip-feedback/${trip.body.id}`, undefined, studentToken), [200]);

  console.log(JSON.stringify({ total: results.length, passed: results.filter(r => r.ok).length, failed: results.filter(r => !r.ok), results }, null, 2));
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
