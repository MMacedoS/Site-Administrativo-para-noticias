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
        content,
        start_date as "startDate",
        end_date as "endDate",
        status,
        image_url as "imageUrl",
        document_url as "documentUrl",
        created_at as "createdAt"
      FROM public_consultations
      ORDER BY created_at DESC
    `;

    return successResponse(result.rows);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function POST(request: NextRequest) {
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

    const result = await sql`
      INSERT INTO public_consultations (title, description, content, start_date, end_date, status, image_url, document_url)
      VALUES (${title}, ${description}, ${content}, ${startDate}, ${endDate}, ${status}, ${imageUrl}, ${documentUrl})
      RETURNING *
    `;

    return successResponse(result.rows[0], 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
