# route-list

![Version](https://img.shields.io/npm/v/route-list)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
[![CI](https://github.com/VladimirMikulic/route-list/actions/workflows/ci.yml/badge.svg)](https://github.com/VladimirMikulic/route-list/actions)
[![Twitter: VladoDev](https://img.shields.io/twitter/follow/VladoDev.svg?style=social)](https://twitter.com/VladoDev)

> ✨ Beautifully shows Express/Koa/Hapi/Fastify/Next.js routes in CLI.

![route-list CLI example](./screenshots/showcase.png)

## 📦 Installation

```sh
# Installs the package so it's globally accessible in terminal
npm i route-list -g
```

## 🔌 Configuration

### Traditional Frameworks

Before you can use `route-list` on your project, we first need to make sure it's
configured properly. In order for `route-list` to work, we need to export server
"app". The example below is for Express but it also applies to Koa (with
@koa/router)/Hapi/Fastify.

**app.js** / **app.ts**

```js
const app = express();

app.get("/", (req, res) => res.sendStatus(200));
app.get("/products", (req, res) => res.sendStatus(200));
app.get("/products/:id", (req, res) => res.sendStatus(200));

// CJS
// Option 1: module.exports = app;
// Option 2: module.exports = { app, yourOtherExports... };
// Option 3: module.exports = functionThatReturnsApp;

// ESM
// Option 1: export default app;
// Option 2: export default { app, yourOtherExports... };
// Option 3: export default functionThatReturnsApp;
```

> NOTE: In case you use
> [SocketIO with Express](https://socket.io/get-started/chat#the-web-framework),
> make sure to **export Express app**, not `http.createServer` server instance.

### Next.js App Router

For Next.js applications using the App Router (13+), `route-list` will
automatically detect and list your API routes. Your API routes should follow
Next.js conventions:

**app/api/users/route.ts**

```ts
export async function GET(request: Request) {
    return new Response("GET users");
}

export async function POST(request: Request) {
    return new Response("Create user");
}
```

## ☁️ Usage

### Options

- `-g, --group` - Display routes in groups separated with new line
- `-m, --methods <methods>` - Include routes registered for HTTP method(s)
- `-i, --include-paths <paths>` - Include routes starting with path(s)
- `-e, --exclude-paths <paths>` - Exclude routes starting with path(s)

### Examples

```sh
# Traditional frameworks (Express, Koa, Hapi, Fastify)
route-list server/app.js
route-list --group server/app.js
route-list --methods GET,POST server/app.js

# Next.js App Router (13+)
route-list app/api                        # List all API routes
route-list app/api --group                # Group API routes by path
route-list app/api --methods GET,POST     # Show only GET and POST routes
```

> NOTE: In case an app is part of NX monorepo, make sure to build it first.

## 💻 Programmatic Usage

```js
import RouteList from "route-list";

// For traditional frameworks
const routesMap = RouteList.getRoutes(app, "express");
// Example result: { "/": ["GET"], "/users": ["GET", "POST"] }

// For Next.js
const routesMap = RouteList.getRoutes("app/api", "next");
// Example result: { "/users": ["GET", "POST"], "/users/:id": ["GET", "PUT"] }

// Print routes to console
RouteList.printRoutes(routesMap);
```

## 🚀 Framework Support

### Traditional Frameworks

- Express
- Koa (with @koa/router or koa-router)
- Hapi
- Fastify

### Next.js

- Supports Next.js 13+ (App Router)
- Automatically detects API routes in app/api directory
- Supports dynamic routes ([param] -> :param)
- Detects HTTP methods from route handlers
- Example structure:

  ```plaintext
  app/
  └── api/
      ├── users/
      │   └── route.ts      # GET, POST /users
      └── users/[id]/
          └── route.ts      # GET, PUT /users/:id
  ```

## 👨 Author

**Vladimir Mikulic**

- Twitter: [@VladoDev](https://twitter.com/VladoDev)
- Github: [@VladimirMikulic](https://github.com/VladimirMikulic)
- LinkedIn: [@vladimirmikulic](https://www.linkedin.com/in/vladimir-mikulic/)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

## 🍻 Credits

The project was inspired by new `route:list` command in Laravel 9. New
[`route:list`](https://github.com/laravel/framework/pull/40269) itself was
inspired by [`pretty-routes`](https://github.com/Wulfheart/pretty-routes)
project. Big thanks to [Λlex Wulf](https://twitter.com/alexfwulf) for building
`pretty-routes` and Laravel community for recognizing the usefulness of the
project.

## ✏️ License

This project is licensed under [MIT](https://opensource.org/licenses/MIT)
license.

## 👨‍🚀 Show your support

Give a ⭐️ if this project helped you!
