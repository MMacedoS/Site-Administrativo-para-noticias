import { Pool } from "pg";

let initialized = false;
let pool: Pool;

const connectionString =
  process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error("Database connection string not found");
}

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 10,
    });
  }
  return pool;
}

export async function initializeDatabase() {
  if (initialized) {
    return;
  }

  try {
    const { runMigrations } = await import("./migrations");
    const { runSeeders } = await import("./seeders");

    await runMigrations();
    await runSeeders();
    initialized = true;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export { getPool };
