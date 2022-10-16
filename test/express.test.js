import assert from 'assert';
import express from 'express';
import test from 'node:test';
import { getRoutes } from '../src/routes.js';

const app = express();

app.get('/', (req, res) => res.sendStatus(200));
app.get('/activity', (req, res) => res.sendStatus(200));
app.get('/activity/:id', (req, res) => res.sendStatus(200));

app.get('/users', (req, res) => res.sendStatus(200));
app.get('/users/:id', (req, res) => res.sendStatus(200));
app.put('/users/:id', (req, res) => res.sendStatus(200));
app.get('/users/following', (req, res) => res.sendStatus(200));

test('Express Routes', () => {
  const actualRoutesMap = getRoutes(app, "express");
  const expectedRoutesMap = {
    '/': ['GET'],
    '/activity': ['GET'],
    '/activity/:id': ['GET'],
    '/users': ['GET'],
    '/users/:id': ['GET', 'PUT'],
    '/users/following': ['GET']
  };

  assert.deepStrictEqual(actualRoutesMap, expectedRoutesMap);
});
