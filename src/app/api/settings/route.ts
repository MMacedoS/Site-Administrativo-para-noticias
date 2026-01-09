import { NextRequest } from "next/server";
import { getPool } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

export async function GET(request: NextRequest) {
  const pool = getPool();
  try {
    const result = await pool.query(`
      SELECT 
        id,
        site_name as "siteName",
        site_logo as "siteLogo",
        show_carousel as "showCarousel",
        show_recent_news as "showRecentNews",
        show_top_news as "showTopNews",
        show_directors as "showDirectors",
        menu_home as "menuHome",
        menu_news as "menuNews",
        menu_about as "menuAbout",
        menu_contact as "menuContact",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM settings
      LIMIT 1
    `);

    return successResponse(result.rows[0]);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function PUT(request: NextRequest) {
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const {
      siteName,
      siteLogo,
      showCarousel,
      showRecentNews,
      showTopNews,
      showDirectors,
      menuHome,
      menuNews,
      menuAbout,
      menuContact,
    } = body;

    // Check if record exists
    const existingResult = await pool.query("SELECT id FROM settings LIMIT 1");
    const existing = existingResult.rows[0];

    let updated;
    if (existing) {
      // Update existing record
      const result = await pool.query(
        `UPDATE settings 
        SET site_name = $1, 
            site_logo = $2, 
            show_carousel = $3, 
            show_recent_news = $4, 
            show_top_news = $5, 
            show_directors = $6,
            menu_home = $7,
            menu_news = $8,
            menu_about = $9,
            menu_contact = $10,
            updated_at = NOW()
        WHERE id = $11
        RETURNING id, site_name as "siteName", site_logo as "siteLogo", 
                  show_carousel as "showCarousel", show_recent_news as "showRecentNews", 
                  show_top_news as "showTopNews", show_directors as "showDirectors",
                  menu_home as "menuHome", menu_news as "menuNews", 
                  menu_about as "menuAbout", menu_contact as "menuContact"`,
        [
          siteName,
          siteLogo,
          showCarousel ? 1 : 0,
          showRecentNews ? 1 : 0,
          showTopNews ? 1 : 0,
          showDirectors ? 1 : 0,
          menuHome ? 1 : 0,
          menuNews ? 1 : 0,
          menuAbout ? 1 : 0,
          menuContact ? 1 : 0,
          existing.id,
        ]
      );
      updated = result.rows[0];
    } else {
      // Create new record
      const result = await pool.query(
        `INSERT INTO settings (
          site_name, 
          site_logo, 
          show_carousel, 
          show_recent_news, 
          show_top_news, 
          show_directors,
          menu_home,
          menu_news,
          menu_about,
          menu_contact
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, site_name as "siteName", site_logo as "siteLogo", 
                  show_carousel as "showCarousel", show_recent_news as "showRecentNews", 
                  show_top_news as "showTopNews", show_directors as "showDirectors",
                  menu_home as "menuHome", menu_news as "menuNews", 
                  menu_about as "menuAbout", menu_contact as "menuContact"`,
        [
          siteName,
          siteLogo,
          showCarousel ? 1 : 0,
          showRecentNews ? 1 : 0,
          showTopNews ? 1 : 0,
          showDirectors ? 1 : 0,
          menuHome ? 1 : 0,
          menuNews ? 1 : 0,
          menuAbout ? 1 : 0,
          menuContact ? 1 : 0,
        ]
      );
      updated = result.rows[0];
    }

    return successResponse(updated);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
