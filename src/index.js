
import { getRoutes } from './routes.js';
import { printRoutes } from './printer.js';

const printer = (framework, app, opts) => printRoutes(getRoutes(app, framework), opts)

export const express = (app, opts = {}) => printer("express", app, opts)
export const koa = (app, opts = {}) => printer("koa", app, opts)
export const hapi = (app, opts = {}) => printer("hapi", app, opts)
export const fastify = (app, opts = {}) => printer("fastify", app, opts)
