import { NextRequest } from "next/server";
import { sql } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    const result = await sql`
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
    `;

    return successResponse(result.rows[0]);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function PUT(request: NextRequest) {
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
    const existingResult = await sql`SELECT id FROM settings LIMIT 1`;
    const existing = existingResult.rows[0];

    let updated;
    if (existing) {
      // Update existing record
      const result = await sql`
        UPDATE settings 
        SET site_name = ${siteName}, 
            site_logo = ${siteLogo}, 
            show_carousel = ${showCarousel ? 1 : 0}, 
            show_recent_news = ${showRecentNews ? 1 : 0}, 
            show_top_news = ${showTopNews ? 1 : 0}, 
            show_directors = ${showDirectors ? 1 : 0},
            menu_home = ${menuHome ? 1 : 0},
            menu_news = ${menuNews ? 1 : 0},
            menu_about = ${menuAbout ? 1 : 0},
            menu_contact = ${menuContact ? 1 : 0},
            updated_at = NOW()
        WHERE id = ${existing.id}
        RETURNING id, site_name as "siteName", site_logo as "siteLogo", 
                  show_carousel as "showCarousel", show_recent_news as "showRecentNews", 
                  show_top_news as "showTopNews", show_directors as "showDirectors",
                  menu_home as "menuHome", menu_news as "menuNews", 
                  menu_about as "menuAbout", menu_contact as "menuContact"
      `;
      updated = result.rows[0];
    } else {
      // Create new record
      const result = await sql`
        INSERT INTO settings (
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
        VALUES (${siteName}, ${siteLogo}, ${showCarousel ? 1 : 0}, 
                ${showRecentNews ? 1 : 0}, ${showTopNews ? 1 : 0}, 
                ${showDirectors ? 1 : 0}, ${menuHome ? 1 : 0}, 
                ${menuNews ? 1 : 0}, ${menuAbout ? 1 : 0}, ${
        menuContact ? 1 : 0
      })
        RETURNING id, site_name as "siteName", site_logo as "siteLogo", 
                  show_carousel as "showCarousel", show_recent_news as "showRecentNews", 
                  show_top_news as "showTopNews", show_directors as "showDirectors",
                  menu_home as "menuHome", menu_news as "menuNews", 
                  menu_about as "menuAbout", menu_contact as "menuContact"
      `;
      updated = result.rows[0];
    }

    return successResponse(updated);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
