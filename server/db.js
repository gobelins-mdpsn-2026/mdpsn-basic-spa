import pg from "pg";

// One pool for the whole app. DATABASE_URL looks like
// postgres://user:password@host:5432/dbname
export function createPool(url = process.env.DATABASE_URL) {
  if (!url) {
    console.error("DATABASE_URL not set — see .env.example");
    process.exit(1);
  }
  return new pg.Pool({ connectionString: url });
}

// Create the table on first boot. Real apps use migrations; one table is enough here.
export async function ensureSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id serial PRIMARY KEY,
      title text NOT NULL,
      done boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}
