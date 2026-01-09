import { NextRequest } from "next/server";
import { getPool } from "@/infrastructure/database/connection";
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
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  const { id } = await params;

  try {
    const result = await pool.query(
      `SELECT 
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
      WHERE id = $1`,
      [id]
    );

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
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  const { id } = await params;

  try {
    const body = await request.json();
    const { cpf, name, description, amount, dueDate, status } = body;

    const result = await pool.query(
      `UPDATE pendencias 
      SET cpf = $1, name = $2, description = $3, 
          amount = $4, due_date = $5, 
          status = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING id, cpf, name, description, amount, 
                due_date as "dueDate", status, 
                created_at as "createdAt", updated_at as "updatedAt"`,
      [cpf, name, description, amount || null, dueDate || null, status, id]
    );

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
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  const { id } = await params;

  try {
    await pool.query("DELETE FROM pendencias WHERE id = $1", [id]);

    return successResponse({ message: "Pendência excluída com sucesso" });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
