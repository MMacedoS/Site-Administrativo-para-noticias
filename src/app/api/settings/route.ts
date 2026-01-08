import { NextRequest } from "next/server";
import { getDatabase } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const settings = db
      .prepare(
        `SELECT 
          id,
          site_name as siteName,
          site_logo as siteLogo,
          show_carousel as showCarousel,
          show_recent_news as showRecentNews,
          show_top_news as showTopNews,
          show_directors as showDirectors,
          menu_home as menuHome,
          menu_news as menuNews,
          menu_about as menuAbout,
          menu_contact as menuContact,
          created_at as createdAt,
          updated_at as updatedAt
        FROM settings
        LIMIT 1`
      )
      .get();

    return successResponse(settings);
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

    const db = getDatabase();

    // Check if record exists
    const existing = db.prepare("SELECT id FROM settings LIMIT 1").get() as
      | { id: number }
      | undefined;

    if (existing) {
      // Update existing record
      db.prepare(
        `UPDATE settings 
         SET site_name = ?, 
             site_logo = ?, 
             show_carousel = ?, 
             show_recent_news = ?, 
             show_top_news = ?, 
             show_directors = ?,
             menu_home = ?,
             menu_news = ?,
             menu_about = ?,
             menu_contact = ?,
             updated_at = datetime('now')
         WHERE id = ?`
      ).run(
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
        existing.id
      );
    } else {
      // Create new record
      db.prepare(
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
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        siteName,
        siteLogo,
        showCarousel ? 1 : 0,
        showRecentNews ? 1 : 0,
        showTopNews ? 1 : 0,
        showDirectors ? 1 : 0,
        menuHome ? 1 : 0,
        menuNews ? 1 : 0,
        menuAbout ? 1 : 0,
        menuContact ? 1 : 0
      );
    }

    const updated = db
      .prepare(
        `SELECT 
          id,
          site_name as siteName,
          site_logo as siteLogo,
          show_carousel as showCarousel,
          show_recent_news as showRecentNews,
          show_top_news as showTopNews,
          show_directors as showDirectors,
          menu_home as menuHome,
          menu_news as menuNews,
          menu_about as menuAbout,
          menu_contact as menuContact
        FROM settings 
        LIMIT 1`
      )
      .get();

    return successResponse(updated);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
