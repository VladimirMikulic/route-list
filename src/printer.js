import chalk from 'chalk';

const printRoute = (method, route) => {
  const colorMap = {
    GET: chalk.greenBright,
    POST: chalk.yellowBright,
    PATCH: chalk.yellowBright,
    PUT: chalk.yellowBright,
    DELETE: chalk.redBright,
  };

  const coloredMethod = colorMap[method](method);
  const methodText =
    method === 'GET' ? `${coloredMethod}${chalk.grey('|HEAD')}` : coloredMethod;

  const spacesCount = method === 'GET' ? 6 : 14 - method.length;
  const spaces = Array(spacesCount).fill(' ').join('');

  const dotsCount = process.stdout.columns - 16 - route.length - 4;
  const dots = dotsCount > 0 ? Array(dotsCount).fill('.').join('') : 0;

  const routeText = route
    .split('/')
    .map(segment => {
      // { - Hapi, : - Express, Koa, Fastify
      const isDynamicSegment = ['{', ':'].includes(segment[0]);
      return isDynamicSegment ? chalk.yellowBright(segment) : segment;
    })
    .join('/');

  console.log(`  ${methodText}${spaces}${routeText}${chalk.grey(dots)}`);
};

export const printRoutes = (routesMap, options) => {
  const { includePaths, excludePaths, methods, group } = options || {};
  const routesMapToPrint = Object.keys(routesMap)
    .sort()
    .filter(route => {
      if (includePaths)
        return includePaths.some(path => route.startsWith(path));
      if (excludePaths)
        return !excludePaths.some(path => route.startsWith(path));
      return true;
    })
    .reduce((map, route) => {
      // We currently don't display only HEAD routes (without GET)
      // That case is probably very rare, might revisit in the future if enough interest from the community
      const methodsToPrint = routesMap[route].filter(
        method => method !== 'HEAD' && (!methods || methods.includes(method))
      );
      if (methodsToPrint.length === 0) return map;
      map[route] = methodsToPrint;
      return map;
    }, {});

  const printedRoutesCount = Object.values(routesMapToPrint).flat().length;

  console.log();
  let previousRoute;
  for (const [route, methods] of Object.entries(routesMapToPrint)) {
    if (group) {
      const basePath = `/${route.split('/')[1]}`;
      const isGroupBreak =
        previousRoute && !previousRoute?.startsWith(basePath);

      if (isGroupBreak) console.log();
      previousRoute = route;
    }

    if (methods.includes('GET')) printRoute('GET', route);
    if (methods.includes('POST')) printRoute('POST', route);
    if (methods.includes('PATCH')) printRoute('PATCH', route);
    if (methods.includes('PUT')) printRoute('PUT', route);
    if (methods.includes('DELETE')) printRoute('DELETE', route);
  }
  console.log(
    `\n  Listed ${chalk.greenBright(printedRoutesCount)} HTTP routes.\n`
  );
};
