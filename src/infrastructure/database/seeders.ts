import { getPool } from "./connection";
import bcrypt from "bcryptjs";

export async function runSeeders(): Promise<void> {
  const pool = getPool();

  try {
    let count = 0;
    try {
      const result = await pool.query(
        `SELECT COUNT(*)::int as count FROM users`
      );
      count = result.rows[0]?.count || 0;
    } catch (error) {}

    if (count > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database...");

    const hashedPassword = bcrypt.hashSync("admin123", 10);
    await pool.query(
      `INSERT INTO users (name, email, password, is_system)
       VALUES ($1, $2, $3, $4)`,
      ["Super Admin", "admin@unooba.com.br", hashedPassword, true]
    );

    console.log("✅ Admin user created");

    await pool.query(`
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
    `);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("Seeder error:", error);
    throw error;
  }
}
