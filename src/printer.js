import chalk from 'chalk';

const printRoute = (method, route) => {
  const colorMap = {
    GET: chalk.greenBright,
    POST: chalk.yellowBright,
    PATCH: chalk.yellowBright,
    PUT: chalk.yellowBright,
    DELETE: chalk.redBright
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
  let routes = Object.keys(routesMap);

  if (options.includePaths) {
    routes = options.includePaths
      .flatMap(path => routes.filter(route => route.startsWith(path)));
  }

  if (options.excludePaths) {
    routes = options.excludePaths
      .flatMap(path => routes.filter(route => !route.startsWith(path)));
  }

  const canPrintRoute = (method, route) => {
    const methods = routesMap[route];
    return (
      methods.includes(method) &&
      (!options.methods || options.methods.includes(method))
    );
  };

  const sortedRoutes = routes.sort();
  // We currently don't display only HEAD routes (without GET)
  // That case is probably very rare, might revisit in the future if enough interest from the community
  const totalRoutesNum = Object.values(routesMap)
    .filter(method => method !== 'HEAD')
    .flat().length;

  console.log();
  for (const [index, route] of sortedRoutes.entries()) {
    if (options.group) {
      const basePath = `/${route.split('/')[1]}`;
      const isGroupBreak =
        index > 0 && !sortedRoutes[index - 1]?.startsWith(basePath);
      if (isGroupBreak) console.log();
    }

    if (canPrintRoute('GET', route)) printRoute('GET', route);
    if (canPrintRoute('POST', route)) printRoute('POST', route);
    if (canPrintRoute('PATCH', route)) printRoute('PATCH', route);
    if (canPrintRoute('PUT', route)) printRoute('PUT', route);
    if (canPrintRoute('DELETE', route)) printRoute('DELETE', route);
  }
  console.log(`\n  Listed ${chalk.greenBright(totalRoutesNum)} HTTP routes.\n`);
};
