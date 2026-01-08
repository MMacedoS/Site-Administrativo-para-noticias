// Infrastructure - Database Connection for Vercel Postgres
import { sql } from "@vercel/postgres";

let initialized = false;

export async function initializeDatabase() {
  if (initialized) {
    return;
  }

  try {
    // Import migrations and seeders dynamically to avoid circular dependencies
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

export { sql };
