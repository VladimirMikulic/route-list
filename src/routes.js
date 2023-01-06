import _getExpressRoutes from 'express-list-endpoints';

export const getRoutes = (app, frameworkName) => {
  const map = {
    express: getExpressRoutes,
    koa: getKoaRoutes,
    hapi: getHapiRoutes,
    fastify: getFastifyRoutes,
  };
  return map[frameworkName] && map[frameworkName](app);
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
    .map(middlewareFn => middlewareFn.router.stack)
    .flat()
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

  // "<spaces> activity (GET)" -> "GET"
  const getMethod = line => line.trim().split(' ')[1].slice(1, -1);

  const segments = lines.reduce((allSegments, line, index) => {
    const segment = getSegment(line);
    const prevSegment = getSegment(lines[index - 1] || '');

    if (prevSegment === segment) {
      const entries = allSegments.filter(
        item => item.index < index && item.segment === segment
      );
      entries[entries.length - 1].methods.push(getMethod(line));
      return allSegments;
    }

    // spaces preceding segment / not counting single space between segment and (METHOD)
    const spaces = line.replace(/ \(.*\)/g, '').match(/ /g).length;
    const depth = spaces / 4;
    const isRoute = line.includes('(');
    const methods = isRoute ? [getMethod(line)] : null;

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
