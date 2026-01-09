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
    const result = await pool.query('SELECT * FROM directors WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return errorResponse("Diretor não encontrado", 404);
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
    const { name, position, email, phone, bio, photoUrl, order } = body;

    const result = await pool.query(
      `UPDATE directors 
      SET name = $1, position = $2, email = $3, 
          phone = $4, bio = $5, photo_url = $6, 
          order_index = $7
      WHERE id = $8
      RETURNING *`,
      [name, position, email, phone, bio, photoUrl, order || 0, id]
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
    await pool.query('DELETE FROM directors WHERE id = $1', [id]);

    return successResponse({ message: "Diretor excluído com sucesso" });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
