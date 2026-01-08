// API Route - Get Events
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
        description,
        date,
        location,
        image_url as "imageUrl",
        order_index as "orderIndex",
        created_at as "createdAt"
      FROM events
      ORDER BY order_index ASC, date DESC
    `;

    return successResponse(result.rows);
  } catch (error: any) {
    console.error("Get events error:", error);
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { title, description, date, location, imageUrl, order } = body;

    const result = await sql`
      INSERT INTO events (title, description, date, location, image_url, order_index)
      VALUES (${title}, ${description}, ${date}, ${location}, ${imageUrl}, ${
      order || 0
    })
      RETURNING *
    `;

    return successResponse(result.rows[0], 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
