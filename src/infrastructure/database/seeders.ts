// Infrastructure - Database Seeders for Vercel Postgres
import { sql } from "./connection";
import bcrypt from "bcryptjs";

export async function runSeeders(): Promise<void> {
  try {
    // Check if we already have data
    const result = await sql`SELECT COUNT(*) as count FROM users`;
    const count = parseInt(result.rows[0]?.count || "0");

    if (count > 0) {
      return;
    }

    // Create Super Admin User (protected system user)
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    await sql`
      INSERT INTO users (name, email, password, is_system)
      VALUES ('Super Admin', 'admin@unooba.com.br', ${hashedPassword}, true)
    `;

    // Insert default settings
    await sql`
      INSERT INTO settings (
        site_name,
        show_carousel,
        show_recent_news,
        show_top_news,
        show_directors,
        menu_home,
        menu_news,
        menu_about,
        menu_contact
      ) VALUES (
        'Unooba',
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true
      )
    `;
  } catch (error) {
    console.error("Seeder error:", error);
    throw error;
  }
}
