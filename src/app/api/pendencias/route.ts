import { NextRequest } from "next/server";
import { getDatabase } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

// GET - List all pendencias (admin only)
export async function GET(request: NextRequest) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const db = getDatabase();
    const pendencias = db
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
        ORDER BY created_at DESC`
      )
      .all();

    return successResponse(pendencias);
  } catch (error: any) {
    console.error("Erro na API /api/pendencias GET:", error);
    return errorResponse(error.message);
  }
}

// POST - Create new pendencia (admin only)
export async function POST(request: NextRequest) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { cpf, name, description, amount, dueDate, status } = body;

    const db = getDatabase();
    const result = db
      .prepare(
        `INSERT INTO pendencias (cpf, name, description, amount, due_date, status)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        cpf,
        name,
        description,
        amount || null,
        dueDate || null,
        status || "pendente"
      );

    const newPendencia = db
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
      .get(result.lastInsertRowid);

    return successResponse(newPendencia);
  } catch (error: any) {
    console.error("Erro na API /api/pendencias POST:", error);
    return errorResponse(error.message);
  }
}
