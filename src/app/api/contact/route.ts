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
        email,
        phone,
        address,
        working_hours as "workingHours",
        map_url as "mapUrl",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM contact
      LIMIT 1
    `;

    return successResponse(result.rows[0]);
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

    // Check if record exists
    const existingResult = await sql`SELECT id FROM contact LIMIT 1`;
    const existing = existingResult.rows[0];

    let updated;
    if (existing) {
      // Update existing record
      const result = await sql`
        UPDATE contact 
        SET email = ${email}, phone = ${phone}, address = ${address}, 
            working_hours = ${workingHours}, map_url = ${mapUrl}, updated_at = NOW()
        WHERE id = ${existing.id}
        RETURNING *
      `;
      updated = result.rows[0];
    } else {
      // Create new record
      const result = await sql`
        INSERT INTO contact (email, phone, address, working_hours, map_url)
        VALUES (${email}, ${phone}, ${address}, ${workingHours}, ${mapUrl})
        RETURNING *
      `;
      updated = result.rows[0];
    }

    return successResponse(updated);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
