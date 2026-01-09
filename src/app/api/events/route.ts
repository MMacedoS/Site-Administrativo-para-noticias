// API Route - Get Events
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
        description,
        date,
        location,
        image_url as "imageUrl",
        order_index as "orderIndex",
        created_at as "createdAt"
      FROM events
      ORDER BY order_index ASC, date DESC
    `);

    return successResponse(result.rows);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { title, description, date, location, imageUrl, order } = body;

    const result = await pool.query(
      `INSERT INTO events (title, description, date, location, image_url, order_index)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [title, description, date, location, imageUrl, order || 0]
    );

    return successResponse(result.rows[0], 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
