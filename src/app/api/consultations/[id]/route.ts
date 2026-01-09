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
    const result = await pool.query(
      "SELECT * FROM public_consultations WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse("Consulta pública não encontrada", 404);
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
      `UPDATE public_consultations 
      SET title = $1, description = $2, content = $3, 
          start_date = $4, end_date = $5, status = $6, 
          image_url = $7, document_url = $8
      WHERE id = $9
      RETURNING *`,
      [
        title,
        description,
        content,
        startDate,
        endDate,
        status,
        imageUrl,
        documentUrl,
        id,
      ]
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
    await pool.query("DELETE FROM public_consultations WHERE id = $1", [id]);

    return successResponse({
      message: "Consulta pública excluída com sucesso",
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
