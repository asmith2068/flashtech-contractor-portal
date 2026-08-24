import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// ─────────────────────────────────────────────────────────────────────────────
// Dev-only: run the /api serverless functions locally.
//
// `vite dev` doesn't serve the api/ folder, which used to mean local development
// had to call the DEPLOYED function — so every click on localhost was writing to
// the production database. This middleware loads api/<name>.js and calls it with
// the same (req, res) shape Vercel provides, so `npm run dev` is self-contained
// and talks to whatever database .env.local names.
// ─────────────────────────────────────────────────────────────────────────────
function localApi() {
  return {
    name: "local-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) return next();

        const name = req.url.split("?")[0].replace(/^\/api\//, "").replace(/\/+$/, "");
        const file = path.resolve(process.cwd(), "api", `${name}.js`);
        if (!name || name.includes("..") || !fs.existsSync(file)) return next();

        // Vercel hands the handler an already-parsed body.
        const raw = await new Promise((resolve) => {
          let b = "";
          req.on("data", (c) => { b += c; });
          req.on("end", () => resolve(b));
          req.on("error", () => resolve(""));
        });
        try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = raw; }
        req.query = Object.fromEntries(new URL(req.url, "http://localhost").searchParams);

        // The handlers use res.status().json() / .end() / .setHeader(); the last
        // two are native, so only status + json need shimming.
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (obj) => {
          if (!res.headersSent) res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(obj));
          return res;
        };

        try {
          const mod = await server.ssrLoadModule(file);
          await mod.default(req, res);
        } catch (err) {
          server.config.logger.error(`[local-api] ${name}: ${err?.stack || err}`);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: String(err?.message || err) }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // The api/ handlers read process.env, which vite doesn't populate on its own.
  const env = loadEnv(mode, process.cwd(), "");
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v;
  }

  // True when .env.local carries real server credentials — i.e. the local API
  // above can actually serve requests and dev is isolated from production.
  const hasLocalApi = Boolean(env.SUPABASE_SERVICE_ROLE && env.SESSION_SECRET);

  return {
    plugins: [react(), localApi()],
    // Honour PORT so more than one dev server can run side by side.
    server: { port: Number(process.env.PORT) || 5173 },
    define: { __LOCAL_API__: JSON.stringify(hasLocalApi) },
  };
});
