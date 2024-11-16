import type { Express as ExpressApp } from "express";
import type { FastifyInstance as FastifyApp } from "fastify";
import type { Server as HapiApp } from "@hapi/hapi";
import type KoaApp from "koa";

type App = ExpressApp | FastifyApp | HapiApp | KoaApp;
type Framework = "express" | "fastify" | "hapi" | "koa";
type HTTPMethod = "HEAD" | "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type RoutesMap = Record<string, HTTPMethod[]>;

declare namespace RouteList {
  function getRoutes(app: App, framework: Framework): RoutesMap;

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
