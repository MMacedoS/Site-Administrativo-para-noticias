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
    const about = db
      .prepare(
        `SELECT 
          id,
          title,
          content,
          mission,
          vision,
          company_values as companyValues,
          image_url as imageUrl,
          created_at as createdAt,
          updated_at as updatedAt
        FROM about_us
        LIMIT 1`
      )
      .get();

    return successResponse(about);
  } catch (error: any) {
    console.error("Erro na API /api/about GET:", error);
    return errorResponse(error.message);
  }
}

export async function PUT(request: NextRequest) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { title, content, mission, vision, companyValues, imageUrl } = body;

    const db = getDatabase();

    // Check if record exists
    const existing = db.prepare("SELECT id FROM about_us LIMIT 1").get() as
      | { id: number }
      | undefined;

    if (existing) {
      // Update existing record
      db.prepare(
        `UPDATE about_us 
         SET title = ?, content = ?, mission = ?, vision = ?, company_values = ?, image_url = ?, updated_at = datetime('now')
         WHERE id = ?`
      ).run(
        title,
        content,
        mission,
        vision,
        companyValues,
        imageUrl,
        existing.id
      );
    } else {
      // Create new record
      db.prepare(
        `INSERT INTO about_us (title, content, mission, vision, company_values, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(title, content, mission, vision, companyValues, imageUrl);
    }

    const updated = db
      .prepare(
        `SELECT 
          id,
          title,
          content,
          mission,
          vision,
          company_values as companyValues,
          image_url as imageUrl,
          created_at as createdAt,
          updated_at as updatedAt
        FROM about_us 
        LIMIT 1`
      )
      .get();

    return successResponse(updated);
  } catch (error: any) {
    console.error("Erro na API /api/about PUT:", error);
    return errorResponse(error.message);
  }
}
