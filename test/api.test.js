import { test, before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import { createPool, ensureSchema } from "../server/db.js";
import { createApp } from "../server/app.js";

// Needs a running Postgres: DATABASE_URL=postgres://todo:todo@localhost:5432/todo
let pool, server, base;

before(async () => {
  pool = createPool();
  await ensureSchema(pool);
  server = createApp(pool).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});
beforeEach(() => pool.query("DELETE FROM todos"));
after(async () => {
  server.close();
  await pool.end();
});

const json = (path, init) =>
  fetch(base + path, { headers: { "Content-Type": "application/json" }, ...init });

test("empty list", async () => {
  const res = await json("/api/todos");
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), []);
});

test("create then list", async () => {
  const res = await json("/api/todos", { method: "POST", body: JSON.stringify({ title: "Pain" }) });
  assert.equal(res.status, 201);
  const todo = await res.json();
  assert.equal(todo.title, "Pain");
  assert.equal(todo.done, false);
  const list = await (await json("/api/todos")).json();
  assert.equal(list.length, 1);
});

test("blank title is rejected", async () => {
  const res = await json("/api/todos", { method: "POST", body: JSON.stringify({ title: "  " }) });
  assert.equal(res.status, 400);
});

test("toggle flips done", async () => {
  const { id } = await (await json("/api/todos", { method: "POST", body: JSON.stringify({ title: "Lire" }) })).json();
  const toggled = await (await json(`/api/todos/${id}/toggle`, { method: "POST" })).json();
  assert.equal(toggled.done, true);
});

test("toggle unknown id is 404", async () => {
  const res = await json("/api/todos/999999/toggle", { method: "POST" });
  assert.equal(res.status, 404);
});

test("delete one and clear done", async () => {
  const a = await (await json("/api/todos", { method: "POST", body: JSON.stringify({ title: "A" }) })).json();
  const b = await (await json("/api/todos", { method: "POST", body: JSON.stringify({ title: "B" }) })).json();
  await json(`/api/todos/${a.id}/toggle`, { method: "POST" });
  assert.equal((await json("/api/todos/done", { method: "DELETE" })).status, 204);
  assert.equal((await json(`/api/todos/${b.id}`, { method: "DELETE" })).status, 204);
  assert.deepEqual(await (await json("/api/todos")).json(), []);
});

test("healthz", async () => {
  const res = await json("/healthz");
  assert.deepEqual(await res.json(), { status: "ok" });
});
