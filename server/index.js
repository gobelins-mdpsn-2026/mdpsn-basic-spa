import { createPool, ensureSchema } from "./db.js";
import { createApp } from "./app.js";

const pool = createPool();
await ensureSchema(pool);

const port = Number(process.env.PORT) || 3000;
createApp(pool).listen(port, "0.0.0.0", () => {
  console.log(`basic-spa API on http://0.0.0.0:${port}`);
});
