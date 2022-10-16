import Hapi from '@hapi/hapi';
import assert from 'assert';
import test from 'node:test';
import { getRoutes } from '../src/routes.js';

const server = Hapi.server({
  port: 8080,
  host: 'localhost'
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => null
});

server.route({
  method: 'GET',
  path: '/activity',
  handler: (request, h) => null
});

server.route({
  method: 'GET',
  path: '/activity/:id',
  handler: (request, h) => null
});

server.route({
  method: 'GET',
  path: '/users',
  handler: (request, h) => null
});

server.route({
  method: ['GET', 'PUT'],
  path: '/users/:id',
  handler: (request, h) => null
});

server.route({
  method: 'GET',
  path: '/users/following',
  handler: (request, h) => null
});

test('Hapi Routes', () => {
  const actualRoutesMap = getRoutes(server, "hapi");
  const expectedRoutesMap = {
    '/activity': ['GET'],
    '/users': ['GET'],
    '/': ['GET'],
    '/activity/:id': ['GET'],
    '/users/:id': ['GET', 'PUT'],
    '/users/following': ['GET']
  };

  assert.deepStrictEqual(actualRoutesMap, expectedRoutesMap);
});
