// API Route - Get Events
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

    const events = db
      .prepare(
        `
      SELECT 
        id,
        title,
        description,
        date,
        location,
        image_url as imageUrl,
        order_index as orderIndex,
        created_at as createdAt
      FROM events
      ORDER BY order_index ASC, date DESC
    `
      )
      .all();

    return successResponse(events);
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

    const db = getDatabase();
    const result = db
      .prepare(
        `INSERT INTO events (title, description, date, location, image_url, order_index)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(title, description, date, location, imageUrl, order || 0);

    const event = db
      .prepare("SELECT * FROM events WHERE id = ?")
      .get(result.lastInsertRowid);

    return successResponse(event, 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
