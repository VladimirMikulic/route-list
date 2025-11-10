import fs from 'fs';
import path from 'path';
import { EXPRESS_FRAMEWORK, FASTIFY_FRAMEWORK, HAPI_FRAMEWORK, KOA_FRAMEWORK, NEXT_FRAMEWORK } from './constants.js';

export const getAppWorkingDirPath = appFilePath => {
  let lastParsedPath = path.parse(appFilePath);

  // Once the following condition returns false it means we traversed the whole file system
  while (lastParsedPath.base && lastParsedPath.root !== lastParsedPath.dir) {
    const parentDirItems = fs.readdirSync(lastParsedPath.dir);

    const pkgJSON = parentDirItems.find(item => item === 'package.json');
    if (pkgJSON) return lastParsedPath.dir;
    else lastParsedPath = path.parse(lastParsedPath.dir);
  }

  return null;
};

export const getFrameworkName = appWorkingDirPath => {
  const pkgJSONFilePath = `${appWorkingDirPath}/package.json`;
  const pkgJSON = JSON.parse(fs.readFileSync(pkgJSONFilePath));
  const { dependencies } = pkgJSON;

  if (dependencies.next) return NEXT_FRAMEWORK;
  if (dependencies.express) return EXPRESS_FRAMEWORK;
  if (dependencies.koa && dependencies['@koa/router']) return KOA_FRAMEWORK;
  if (dependencies.koa && dependencies['koa-router']) return KOA_FRAMEWORK;
  if (dependencies['@hapi/hapi']) return HAPI_FRAMEWORK;
  if (dependencies.fastify) return FASTIFY_FRAMEWORK;
  return null;
};

// See README for different export options
export const getApp = (appExport, frameworkName) => {
  // hapi app instance also has an internal "app" property
  if (frameworkName === HAPI_FRAMEWORK)
    return appExport.app?.app ? appExport.app : appExport;
  return appExport.app || appExport;
};
