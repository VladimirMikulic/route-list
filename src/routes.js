import _getExpressRoutes from 'express-list-endpoints';
import fs from 'fs';
import path from 'path';
import { EXPRESS_FRAMEWORK, FASTIFY_FRAMEWORK, HAPI_FRAMEWORK, KOA_FRAMEWORK, NEXT_FRAMEWORK } from './constants.js';

export const getRoutes = (app, frameworkName) => {
  if (frameworkName === NEXT_FRAMEWORK) return getNextRoutes(app);
  if (frameworkName === EXPRESS_FRAMEWORK) return getExpressRoutes(app);
  if (frameworkName === KOA_FRAMEWORK) return getKoaRoutes(app);
  if (frameworkName === HAPI_FRAMEWORK) return getHapiRoutes(app);
  if (frameworkName === FASTIFY_FRAMEWORK) return getFastifyRoutes(app);
};

const getExpressRoutes = app =>
  _getExpressRoutes(app).reduce(
    (routesMap, result) => ({
      ...routesMap,
      [result.path]: result.methods
    }),
    {}
  );

const getKoaRoutes = app =>
  app.middleware
    .filter(middlewareFn => middlewareFn.router)
    .flatMap(middlewareFn => middlewareFn.router.stack)
    .reduce((routesMap, route) => {
      if (!routesMap[route.path]) routesMap[route.path] = [];
      routesMap[route.path].push(...route.methods);
      return routesMap;
    }, {});

const getHapiRoutes = app =>
  Array.from(app._core.router.routes.keys()).reduce((routesMap, method) => {
    const routes = app._core.router.routes.get(method).routes.map(r => r.path);

    for (const route of routes) {
      if (!routesMap[route]) routesMap[route] = [];
      routesMap[route].push(method.toUpperCase());
    }

    return routesMap;
  }, {});

const getFastifyRoutes = app => {
  const printedRoutes = app
    .printRoutes()
    .replace(/─|└|│|├/g, ' ')
    .trimEnd();

  const lines = printedRoutes.split('\n');

  // "<spaces> activity (GET)" -> "activity"
  const getSegment = line => line.replace(/ \(.*\)/g, '').trim();

  // "<spaces> activity (GET)" -> ["GET"] <= v4.13
  // "<spaces> activity (POST)" -> ["POST"] <= v4.13
  // "<spaces> activity (GET, POST)" -> ["GET", "POST"] > v4.13
  const getMethods = line => line.trim().split(' (')[1].slice(0,-1).split(", ");

  const segments = lines.reduce((allSegments, line, index) => {
    const segment = getSegment(line);
    const prevSegment = getSegment(lines[index - 1] || '');

    if (prevSegment === segment) {
      const entries = allSegments.filter(
        item => item.index < index && item.segment === segment
      );
      entries[entries.length - 1].methods.push(...getMethods(line));
      return allSegments;
    }

    // spaces preceding segment / not counting single space between segment and (METHOD)
    const spaces = line.replace(/ \(.*\)/g, '').match(/ /g).length;
    const depth = spaces / 4;
    const isRoute = line.includes('(');
    const methods = isRoute ? getMethods(line) : null;

    allSegments.push({ segment, index, depth, isRoute, methods });
    return allSegments;
  }, []);

  const routesMap = segments
    .filter(item => item.isRoute)
    .reduce((routesMap, item) => {
      const ancestorSegments = segments
        .filter(seg => seg.index < item.index && seg.depth < item.depth)
        .filter(
          (seg, index, prevArr) =>
            !prevArr.find(
              item => item.depth === seg.depth && item.index > seg.index
            )
        );

      const route = [
        ...ancestorSegments.map(r => r.segment),
        item.segment
      ].join('');

      routesMap[route] = item.methods;
      return routesMap;
    }, {});

  return routesMap;
};

const getNextRoutes = (appDir) => {
  const routesMap = {};
  const apiDir = appDir;
  
  function processDirectory(currentPath, parentRoute = '') {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        // Skip special Next.js directories
        if (['_app', '_document'].includes(item)) continue;
        
        // Handle dynamic routes [param]
        const routePart = item.startsWith('[') ? `:${item.slice(1, -1)}` : item;
        
        // Process nested routes
        processDirectory(fullPath, `${parentRoute}/${routePart}`);
      } else if (stats.isFile()) {
        if (['route.js', 'route.tsx', 'route.ts'].includes(item)) {
          // No need to add /api prefix since we're already in the api directory
          const route = parentRoute || '/';
          // Read the file content to detect HTTP methods
          const content = fs.readFileSync(fullPath, 'utf8');
          const methods = [];
          
          // Check for exported HTTP methods
          if (content.includes('export const GET') || content.includes('export async function GET')) methods.push('GET');
          if (content.includes('export const POST') || content.includes('export async function POST')) methods.push('POST');
          if (content.includes('export const PUT') || content.includes('export async function PUT')) methods.push('PUT');
          if (content.includes('export const DELETE') || content.includes('export async function DELETE')) methods.push('DELETE');
          if (content.includes('export const PATCH') || content.includes('export async function PATCH')) methods.push('PATCH');
          
          routesMap[route] = methods;
        }
      }
    }
  }

  if (fs.existsSync(apiDir)) {
    processDirectory(apiDir);
  }

  return routesMap;
};
