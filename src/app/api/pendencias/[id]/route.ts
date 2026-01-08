import { NextRequest } from "next/server";
import { getDatabase } from "@/infrastructure/database/connection";
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
    const db = getDatabase();
    const pendencia = db
      .prepare(
        `SELECT 
          id,
          cpf,
          name,
          description,
          amount,
          due_date as dueDate,
          status,
          created_at as createdAt,
          updated_at as updatedAt
        FROM pendencias
        WHERE id = ?`
      )
      .get(id);

    if (!pendencia) {
      return errorResponse("Pendência não encontrada", 404);
    }

    return successResponse(pendencia);
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

    const db = getDatabase();
    db.prepare(
      `UPDATE pendencias 
       SET cpf = ?, name = ?, description = ?, amount = ?, due_date = ?, status = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).run(
      cpf,
      name,
      description,
      amount || null,
      dueDate || null,
      status,
      id
    );

    const updated = db
      .prepare(
        `SELECT 
          id,
          cpf,
          name,
          description,
          amount,
          due_date as dueDate,
          status,
          created_at as createdAt,
          updated_at as updatedAt
        FROM pendencias 
        WHERE id = ?`
      )
      .get(id);

    return successResponse(updated);
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
    const db = getDatabase();
    db.prepare("DELETE FROM pendencias WHERE id = ?").run(id);

    return successResponse({ message: "Pendência excluída com sucesso" });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
