// API Route - Get Top News
import { NextRequest } from "next/server";
import { getPool } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";

export async function GET(request: NextRequest) {
  const pool = getPool();
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await pool.query(
      `SELECT 
        id,
        title,
        slug,
        summary,
        category,
        views,
        image_url as "imageUrl",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM news
      WHERE published = true
      ORDER BY views DESC
      LIMIT $1`,
      [limit]
    );

    return successResponse(result.rows);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
