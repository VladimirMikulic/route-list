import assert from 'assert';
import test from 'node:test';
import path from 'path';
import { getAppWorkingDirPath, getFrameworkName } from '../src/utils.js';

const appFilePath = path.join(
  process.cwd(),
  'examples/express-app/server/app.js'
);

test('getAppWorkingDirPath', () => {
  const actualWorkingDirPath = getAppWorkingDirPath(appFilePath);
  const expectedWorkingDirPath = path.join(
    process.cwd(),
    'examples/express-app'
  );

  assert.strictEqual(actualWorkingDirPath, expectedWorkingDirPath);
});

test('getFrameworkName', () => {
  const workingDirPath = getAppWorkingDirPath(appFilePath);
  const actualFrameworkName = getFrameworkName(workingDirPath);
  const expectedFrameworkName = 'express';

  assert.strictEqual(actualFrameworkName, expectedFrameworkName);
});
