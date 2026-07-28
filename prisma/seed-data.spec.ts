import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAllowedDomains, getDemoCatalog, shouldIncludeDemoData } from './seed-data';

test('shouldIncludeDemoData enables demo data by default outside production', () => {
  assert.equal(shouldIncludeDemoData('development', undefined), true);
  assert.equal(shouldIncludeDemoData('test', undefined), true);
});

test('shouldIncludeDemoData disables demo data by default in production unless explicitly enabled', () => {
  assert.equal(shouldIncludeDemoData('production', undefined), false);
  assert.equal(shouldIncludeDemoData('production', 'false'), false);
  assert.equal(shouldIncludeDemoData('production', 'true'), true);
  assert.equal(shouldIncludeDemoData('production', '1'), true);
});

test('buildAllowedDomains normalizes comma-separated domains and removes empties', () => {
  assert.deepEqual(buildAllowedDomains(' ups.edu.ec, gmail.com ,, est.ups.edu.ec '), [
    'ups.edu.ec',
    'gmail.com',
    'est.ups.edu.ec',
  ]);
});

test('getDemoCatalog returns enough demo data to visualize the API', () => {
  const catalog = getDemoCatalog();

  assert.ok(catalog.users.length >= 12);
  assert.ok(catalog.routes.length >= 7);
  assert.ok(catalog.stops.length >= 12);
  assert.ok(catalog.routeStops.length >= 30);
  assert.ok(catalog.schedules.length >= 70);
  assert.ok(catalog.vehicles.length >= 5);
  assert.ok(catalog.drivers.length >= 5);
  assert.ok(catalog.notices.length >= 6);
  assert.ok(catalog.tripFeedbacks.length >= 12);
});
