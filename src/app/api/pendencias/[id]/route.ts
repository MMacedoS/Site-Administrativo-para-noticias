import { NextRequest } from "next/server";
import { sql } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

// GET - Get single pendencia
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  const { id } = await params;

  try {
    const result = await sql`
      SELECT 
        id,
        cpf,
        name,
        description,
        amount,
        due_date as "dueDate",
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM pendencias
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return errorResponse("Pendência não encontrada", 404);
    }

    return successResponse(result.rows[0]);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

// PUT - Update pendencia
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  const { id } = await params;

  try {
    const body = await request.json();
    const { cpf, name, description, amount, dueDate, status } = body;

    const result = await sql`
      UPDATE pendencias 
      SET cpf = ${cpf}, name = ${name}, description = ${description}, 
          amount = ${amount || null}, due_date = ${dueDate || null}, 
          status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, cpf, name, description, amount, 
                due_date as "dueDate", status, 
                created_at as "createdAt", updated_at as "updatedAt"
    `;

    return successResponse(result.rows[0]);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

// DELETE - Delete pendencia
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  const { id } = await params;

  try {
    await sql`DELETE FROM pendencias WHERE id = ${id}`;

    return successResponse({ message: "Pendência excluída com sucesso" });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
