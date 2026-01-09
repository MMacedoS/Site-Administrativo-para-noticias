// API Route - Get Directors
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
        name,
        position,
        email,
        phone,
        bio,
        photo_url as "photoUrl",
        order_index as "orderIndex",
        created_at as "createdAt"
      FROM directors
      ORDER BY order_index ASC
    `);

    return successResponse(result.rows);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function POST(request: NextRequest) {
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { name, position, email, phone, bio, photoUrl, order } = body;

    const result = await pool.query(
      `INSERT INTO directors (name, position, email, phone, bio, photo_url, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [name, position, email, phone, bio, photoUrl, order || 0]
    );

    return successResponse(result.rows[0], 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
