import { NextRequest } from "next/server";
import { sql } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const result = await sql`
      SELECT * FROM public_consultations WHERE id = ${id}
    `;

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

    const result = await sql`
      UPDATE public_consultations 
      SET title = ${title}, description = ${description}, content = ${content}, 
          start_date = ${startDate}, end_date = ${endDate}, status = ${status}, 
          image_url = ${imageUrl}, document_url = ${documentUrl}
      WHERE id = ${id}
      RETURNING *
    `;

    return successResponse(result.rows[0]);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    await sql`DELETE FROM public_consultations WHERE id = ${id}`;

    return successResponse({
      message: "Consulta pública excluída com sucesso",
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
