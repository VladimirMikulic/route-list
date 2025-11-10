import assert from 'assert';
import test from 'node:test';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRoutes } from '../src/routes.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOCK_NEXT_APP_PATH = path.join(__dirname, 'fixtures/next-app/app/api');

test('Next.js Routes', () => {
  
  const actualRoutesMap = getRoutes(MOCK_NEXT_APP_PATH, "next");
  const expectedRoutesMap = {
    '/users': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  };

  assert.deepStrictEqual(actualRoutesMap, expectedRoutesMap);
}); 