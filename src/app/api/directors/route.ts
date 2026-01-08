// API Route - Get Directors
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

    const directors = db
      .prepare(
        `
      SELECT 
        id,
        name,
        position,
        email,
        phone,
        bio,
        photo_url as photoUrl,
        order_index as orderIndex,
        created_at as createdAt
      FROM directors
      ORDER BY order_index ASC
    `
      )
      .all();

    return successResponse(directors);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function POST(request: NextRequest) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { name, position, email, phone, bio, photoUrl, order } = body;

    const db = getDatabase();
    const result = db
      .prepare(
        `INSERT INTO directors (name, position, email, phone, bio, photo_url, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(name, position, email, phone, bio, photoUrl, order || 0);

    const director = db
      .prepare("SELECT * FROM directors WHERE id = ?")
      .get(result.lastInsertRowid);

    return successResponse(director, 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
