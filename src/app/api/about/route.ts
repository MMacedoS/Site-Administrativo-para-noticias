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
        title,
        content,
        mission,
        vision,
        company_values as "companyValues",
        image_url as "imageUrl",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM about_us
      LIMIT 1
    `);

    return successResponse(result.rows[0]);
  } catch (error: any) {
    console.error("Erro na API /api/about GET:", error);
    return errorResponse(error.message);
  }
}

export async function PUT(request: NextRequest) {
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { title, content, mission, vision, companyValues, imageUrl } = body;

    // Check if record exists
    const existingResult = await pool.query('SELECT id FROM about_us LIMIT 1');
    const existing = existingResult.rows[0];

    let updated;
    if (existing) {
      // Update existing record
      const result = await pool.query(
        `UPDATE about_us 
        SET title = $1, content = $2, mission = $3, 
            vision = $4, company_values = $5, 
            image_url = $6, updated_at = NOW()
        WHERE id = $7
        RETURNING id, title, content, mission, vision, 
                  company_values as "companyValues", image_url as "imageUrl", 
                  created_at as "createdAt", updated_at as "updatedAt"`,
        [title, content, mission, vision, companyValues, imageUrl, existing.id]
      );
      updated = result.rows[0];
    } else {
      // Create new record
      const result = await pool.query(
        `INSERT INTO about_us (title, content, mission, vision, company_values, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, title, content, mission, vision, 
                  company_values as "companyValues", image_url as "imageUrl", 
                  created_at as "createdAt", updated_at as "updatedAt"`,
        [title, content, mission, vision, companyValues, imageUrl]
      );
      updated = result.rows[0];
    }

    return successResponse(updated);
  } catch (error: any) {
    console.error("Erro na API /api/about PUT:", error);
    return errorResponse(error.message);
  }
}
