import assert from 'assert';
import fastify from 'fastify';
import test from 'node:test';
import { getRoutes } from '../src/routes.js';

const app = fastify();

app.get('/', (req, res) => res.status(200));
app.get('/activity', (req, res) => res.status(200));
app.get('/activity/:id', (req, res) => res.status(200));

app.get('/users', (req, res) => res.status(200));
app.get('/users/:id', (req, res) => res.status(200));
app.put('/users/:id', (req, res) => res.status(200));
app.get('/users/following', (req, res) => res.status(200));

test('Fastify Routes', () => {
  const actualRoutesMap = getRoutes(app, "fastify");
  const expectedRoutesMap = {
    '/': ['GET', 'HEAD'],
    '/activity': ['GET', 'HEAD'],
    '/activity/:id': ['GET', 'HEAD'],
    '/users': ['GET', 'HEAD'],
    '/users/:id': ['GET', 'HEAD', 'PUT'],
    '/users/following': ['GET']
  };

  assert.deepStrictEqual(actualRoutesMap, expectedRoutesMap);
});
