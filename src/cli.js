#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import * as url from 'url';
import { printRoutes } from './printer.js';
import { getRoutes } from './routes.js';
import { getApp, getAppWorkingDirPath, getFrameworkName } from './utils.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pkgJSONFilePath = path.resolve(__dirname, '../package.json');
const pkgJSON = JSON.parse(fs.readFileSync(pkgJSONFilePath));

const examples = [
  '  $ route-list server/app.js',
  '  $ route-list --methods GET,POST server/app.js',
  '  $ route-list --include-paths /users,/events server/app.js'
];

program
  .name(pkgJSON.name)
  .description(pkgJSON.description)
  .argument('<appjs-file>')
  .option('-g, --group', 'Display routes in groups separated with new line')
  .option(
    '-m, --methods <methods>',
    'Include routes registered for HTTP method(s)',
    value => value.split(',').map(method => method.toUpperCase())
  )
  .option(
    '-i, --include-paths <paths>',
    'Include routes starting with path(s)',
    value => value.split(',')
  )
  .option(
    '-e, --exclude-paths <paths>',
    'Exclude routes starting with path(s)',
    value => value.split(',')
  )
  .addHelpText('after', `\nExamples:\n${examples.join('\n')}`)
  .showHelpAfterError()
  .version(pkgJSON.version)
  .parse();

try {
  const appFilePath = path.resolve(process.cwd(), program.args[0]);

  if (!fs.existsSync(appFilePath))
    throw new Error('No such file, invalid path provided.');

  const isPathFile = fs.statSync(appFilePath).isFile();
  if (!isPathFile)
    throw new Error(`${appFilePath} is directory, but file expected.`);

  const fileExtension = path.extname(appFilePath);
  const isFileExtValid = ['.js', '.mjs'].includes(fileExtension);
  if (!isFileExtValid)
    throw new Error('Please specify application .js/.mjs file.');

  const appWorkingDirPath = getAppWorkingDirPath(appFilePath);
  if (!appWorkingDirPath)
    throw new Error('Please initialize local package.json.');

  const frameworkName = getFrameworkName(appWorkingDirPath);
  if (!frameworkName)
    throw new Error("Couldn't detect supported back-end framework.");

  const envFilePath = `${appWorkingDirPath}/.env`;
  if (fs.existsSync(envFilePath)) {
    // Loads environment vars in the current process so application
    // that depends on them can be loaded properly below
    const dotenv = await import(
      `${appWorkingDirPath}/node_modules/dotenv/lib/main.js`
    );
    dotenv.config({ path: envFilePath });
  }

  const appExport = await import(appFilePath);
  const app = getApp(appExport.default, frameworkName);
  const routesMap = getRoutes(app, frameworkName);

  printRoutes(routesMap, program.opts());
  process.exit();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
