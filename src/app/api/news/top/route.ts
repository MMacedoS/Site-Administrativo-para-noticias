// API Route - Get Top News
import { NextRequest } from "next/server";
import { getDatabase } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const news = db
      .prepare(
        `
      SELECT 
        id,
        title,
        slug,
        summary,
        category,
        views,
        image_url as imageUrl,
        created_at as createdAt,
        updated_at as updatedAt
      FROM news
      WHERE published = 1
      ORDER BY views DESC
      LIMIT ?
    `
      )
      .all(limit);

    return successResponse(news);
  } catch (error: any) {
    console.error("Get top news error:", error);
    return errorResponse(error.message, 500);
  }
}
