import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { todosRouter } from "./todos.js";

const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../client/dist");

export function createApp(pool) {
  const app = express();
  app.use(express.json());

  app.get("/healthz", async (req, res) => {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  });

  app.use("/api/todos", todosRouter(pool));

  // Production: serve the built React app. Any other GET returns index.html
  // so the browser loads the SPA, which then talks to /api.
  app.use(express.static(clientDist));
  app.get("/{*splat}", (req, res) => res.sendFile(path.join(clientDist, "index.html")));

  app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: "internal server error" });
  });

  return app;
}
