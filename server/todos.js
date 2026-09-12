import { Router } from "express";

// JSON in, JSON out. The browser never gets HTML from these routes.
export function todosRouter(pool) {
  const router = Router();

  router.get("/", async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM todos ORDER BY created_at, id");
    res.json(rows);
  });

  router.post("/", async (req, res) => {
    const title = String(req.body?.title ?? "").trim();
    if (!title) return res.status(400).json({ error: "title is required" });
    const { rows } = await pool.query(
      "INSERT INTO todos (title) VALUES ($1) RETURNING *",
      [title],
    );
    res.status(201).json(rows[0]);
  });

  router.post("/:id/toggle", async (req, res) => {
    const { rows } = await pool.query(
      "UPDATE todos SET done = NOT done WHERE id = $1 RETURNING *",
      [Number(req.params.id)],
    );
    if (rows.length === 0) return res.status(404).json({ error: "not found" });
    res.json(rows[0]);
  });

  // Declared before /:id so "done" is not read as an id.
  router.delete("/done", async (req, res) => {
    await pool.query("DELETE FROM todos WHERE done = true");
    res.status(204).end();
  });

  router.delete("/:id", async (req, res) => {
    await pool.query("DELETE FROM todos WHERE id = $1", [Number(req.params.id)]);
    res.status(204).end();
  });

  return router;
}
