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
    const contact = db
      .prepare(
        `SELECT 
          id,
          email,
          phone,
          address,
          working_hours as workingHours,
          map_url as mapUrl,
          created_at as createdAt,
          updated_at as updatedAt
        FROM contact
        LIMIT 1`
      )
      .get();

    return successResponse(contact);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function PUT(request: NextRequest) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { email, phone, address, workingHours, mapUrl } = body;

    const db = getDatabase();

    // Check if record exists
    const existing = db.prepare("SELECT id FROM contact LIMIT 1").get() as
      | { id: number }
      | undefined;

    if (existing) {
      // Update existing record
      db.prepare(
        `UPDATE contact 
         SET email = ?, phone = ?, address = ?, working_hours = ?, map_url = ?, updated_at = datetime('now')
         WHERE id = ?`
      ).run(email, phone, address, workingHours, mapUrl, existing.id);
    } else {
      // Create new record
      db.prepare(
        `INSERT INTO contact (email, phone, address, working_hours, map_url)
         VALUES (?, ?, ?, ?, ?)`
      ).run(email, phone, address, workingHours, mapUrl);
    }

    const updated = db.prepare("SELECT * FROM contact LIMIT 1").get();
    return successResponse(updated);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
