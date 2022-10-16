import Router from '@koa/router';
import assert from 'assert';
import Koa from 'koa';
import test from 'node:test';
import { getRoutes } from '../src/routes.js';

const app = new Koa();
const router = new Router();

router.get('/', (req, res) => (ctx.status = 200));
router.get('/activity', (req, res) => (ctx.status = 200));
router.get('/activity/:id', (req, res) => (ctx.status = 200));

router.get('/users', (req, res) => (ctx.status = 200));
router.get('/users/:id', (req, res) => (ctx.status = 200));
router.put('/users/:id', (req, res) => (ctx.status = 200));
router.get('/users/following', (req, res) => (ctx.status = 200));

app.use(router.routes());
app.use(ctx => console.log('Non-router middleware'));

test('Koa Routes', () => {
  const actualRoutesMap = getRoutes(app, "koa");
  const expectedRoutesMap = {
    '/': ['HEAD', 'GET'],
    '/activity': ['HEAD', 'GET'],
    '/activity/:id': ['HEAD', 'GET'],
    '/users': ['HEAD', 'GET'],
    '/users/:id': ['HEAD', 'GET', 'PUT'],
    '/users/following': ['HEAD', 'GET']
  };

  assert.deepStrictEqual(actualRoutesMap, expectedRoutesMap);
});
