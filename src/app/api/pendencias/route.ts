import { NextRequest } from "next/server";
import { getPool } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

// GET - List all pendencias (admin only)
export async function GET(request: NextRequest) {
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const result = await pool.query(`
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
      ORDER BY created_at DESC
    `);

    return successResponse(result.rows);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

// POST - Create new pendencia (admin only)
export async function POST(request: NextRequest) {
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { cpf, name, description, amount, dueDate, status } = body;

    const result = await pool.query(
      `INSERT INTO pendencias (cpf, name, description, amount, due_date, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, cpf, name, description, amount, 
                due_date as "dueDate", status, 
                created_at as "createdAt", updated_at as "updatedAt"`,
      [
        cpf,
        name,
        description,
        amount || null,
        dueDate || null,
        status || "pendente",
      ]
    );

    return successResponse(result.rows[0]);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
