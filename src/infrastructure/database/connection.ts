// Infrastructure - Database Connection (Singleton Pattern)
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { runMigrations } from "./migrations";
import { runSeeders } from "./seeders";

let db: Database.Database | null = null;
let initialized = false;

export function getDatabase(): Database.Database {
  if (db) {
    return db;
  }

  const dbPath = process.env.DATABASE_PATH || "./data/news.db";
  const dbDir = path.dirname(dbPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Run migrations and seeders only once
  if (!initialized) {
    runMigrations();
    runSeeders();
    initialized = true;
  }

  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    initialized = false;
  }
}
