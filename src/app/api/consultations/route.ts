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
        content,
        start_date as "startDate",
        end_date as "endDate",
        status,
        image_url as "imageUrl",
        document_url as "documentUrl",
        created_at as "createdAt"
      FROM public_consultations
      ORDER BY created_at DESC
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
    const {
      title,
      description,
      content,
      startDate,
      endDate,
      status,
      imageUrl,
      documentUrl,
    } = body;

    const result = await pool.query(
      `INSERT INTO public_consultations (title, description, content, start_date, end_date, status, image_url, document_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [title, description, content, startDate, endDate, status, imageUrl, documentUrl]
    );

    return successResponse(result.rows[0], 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
