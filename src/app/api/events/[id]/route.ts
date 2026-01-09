import { NextRequest } from "next/server";
import { getPool } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pool = getPool();
  const { id } = await params;
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return errorResponse("Evento não encontrado", 404);
    }

    return successResponse(result.rows[0]);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pool = getPool();
  const { id } = await params;
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { title, description, date, location, imageUrl, order } = body;

    const result = await pool.query(
      `UPDATE events 
      SET title = $1, description = $2, date = $3, 
          location = $4, image_url = $5, order_index = $6
      WHERE id = $7
      RETURNING *`,
      [title, description, date, location, imageUrl, order || 0, id]
    );

    return successResponse(result.rows[0]);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pool = getPool();
  const { id } = await params;
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    await pool.query('DELETE FROM events WHERE id = $1', [id]);

    return successResponse({ message: "Evento excluído com sucesso" });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
