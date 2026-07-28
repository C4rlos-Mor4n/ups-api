require('dotenv').config();
require('reflect-metadata');
const assert = require('node:assert/strict');
const { NestFactory } = require('@nestjs/core');
const { SwaggerModule } = require('@nestjs/swagger');
const { AppModule } = require('../dist/src/app.module');
const { buildSwaggerDocumentConfig } = require('../dist/src/config/swagger.config');

(async () => {
  const app = await NestFactory.create(AppModule, { logger: false });
  const document = SwaggerModule.createDocument(app, buildSwaggerDocumentConfig());
  await app.close();

  const tags = (document.tags || []).map((tag) => tag.name);
  assert.equal(tags.includes('Users'), false, 'Users tag should not be declared when unused');

  const urls = (document.servers || []).map((server) => server.url);
  assert.equal(urls.includes('https://staging-api.example.com'), false, 'Placeholder staging server should be removed');
  assert.equal(urls.includes('https://ups-api-sfq9.onrender.com'), false, 'Legacy Render server should be removed');
  assert.equal(urls.includes(process.env.APP_PUBLIC_URL), true, 'Current public server should be documented');

  const requestCodeResponses = document.paths['/auth/request-code'].post.responses;
  assert.ok(requestCodeResponses['400'], 'request-code should document 400 responses');

  const targets = [
    ['get', '/health', '200'],
    ['get', '/health/db', '200'],
    ['post', '/auth/request-code', '201'],
    ['post', '/auth/logout', '200'],
    ['patch', '/admin/routes/{id}/stops/order', '200'],
  ];

  for (const [method, path, code] of targets) {
    const operation = document.paths[path] && document.paths[path][method];
    const response = operation && operation.responses && operation.responses[code];
    const schema = response && response.content && response.content['application/json'] && response.content['application/json'].schema;
    assert.ok(schema, `${method.toUpperCase()} ${path} should have explicit application/json schema`);
  }

  console.log('openapi contract checks passed');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
