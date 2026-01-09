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
        email,
        phone,
        address,
        working_hours as "workingHours",
        map_url as "mapUrl",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM contact
      LIMIT 1
    `);

    return successResponse(result.rows[0]);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function PUT(request: NextRequest) {
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { email, phone, address, workingHours, mapUrl } = body;

    // Check if record exists
    const existingResult = await pool.query('SELECT id FROM contact LIMIT 1');
    const existing = existingResult.rows[0];

    let updated;
    if (existing) {
      // Update existing record
      const result = await pool.query(
        `UPDATE contact 
        SET email = $1, phone = $2, address = $3, 
            working_hours = $4, map_url = $5, updated_at = NOW()
        WHERE id = $6
        RETURNING *`,
        [email, phone, address, workingHours, mapUrl, existing.id]
      );
      updated = result.rows[0];
    } else {
      // Create new record
      const result = await pool.query(
        `INSERT INTO contact (email, phone, address, working_hours, map_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [email, phone, address, workingHours, mapUrl]
      );
      updated = result.rows[0];
    }

    return successResponse(updated);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
