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
    `;

    return successResponse(result.rows[0]);
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

    // Check if record exists
    const existingResult = await sql`SELECT id FROM about_us LIMIT 1`;
    const existing = existingResult.rows[0];

    let updated;
    if (existing) {
      // Update existing record
      const result = await sql`
        UPDATE about_us 
        SET title = ${title}, content = ${content}, mission = ${mission}, 
            vision = ${vision}, company_values = ${companyValues}, 
            image_url = ${imageUrl}, updated_at = NOW()
        WHERE id = ${existing.id}
        RETURNING id, title, content, mission, vision, 
                  company_values as "companyValues", image_url as "imageUrl", 
                  created_at as "createdAt", updated_at as "updatedAt"
      `;
      updated = result.rows[0];
    } else {
      // Create new record
      const result = await sql`
        INSERT INTO about_us (title, content, mission, vision, company_values, image_url)
        VALUES (${title}, ${content}, ${mission}, ${vision}, ${companyValues}, ${imageUrl})
        RETURNING id, title, content, mission, vision, 
                  company_values as "companyValues", image_url as "imageUrl", 
                  created_at as "createdAt", updated_at as "updatedAt"
      `;
      updated = result.rows[0];
    }

    return successResponse(updated);
  } catch (error: any) {
    console.error("Erro na API /api/about PUT:", error);
    return errorResponse(error.message);
  }
}
