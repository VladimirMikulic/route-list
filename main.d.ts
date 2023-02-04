type HTTPMethod = 'HEAD' | 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type RoutesMap = {
  [route: string]: Array<HTTPMethod>;
};

declare namespace RouteList {
  function getRoutes(
    app: unknown,
    framework: 'express' | 'koa' | 'hapi' | 'fastify'
  ): RoutesMap;

  function printRoutes(
    routesMap: RoutesMap,
    options?: {
      includePaths?: string[];
      excludePaths?: string[];
      methods?: HTTPMethod[];
      group?: boolean;
    }
  ): void;
}

export default RouteList;
