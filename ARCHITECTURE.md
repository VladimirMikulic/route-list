# ARCHITECTURE

## Background

Initially, the following implementation approaches were considered:

- Runtime (requiring/importing app)
- Static Analysis (crawling source code)

However, due to fragmentation is Node's ecosystem of frameworks (Express, Hapi,
Fastify...), module systems (ESM/CJS) and project structures, doing static
analysis would be extremely difficult, slow and would probably not work for the
majority of projects.

## Implementation

Choosing runtime option made implementation straightforward and allows greater
future project extensibility. The only thing we require is server app export
which is usually done anyways in most projects.

The program's flow can be broken down in the following steps:

- CLI options and arguments validation
- Initializing application's environment (.env)
- (Optional) compiling TypeScript app.ts to app.js
- Importing application
- Detecting web framework
- Parsing routes
- Printing routes
