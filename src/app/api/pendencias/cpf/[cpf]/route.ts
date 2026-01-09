import { NextRequest } from "next/server";
import { getPool } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cpf: string }> }
) {
  const pool = getPool();
  try {
    const { cpf: cpfParam } = await params;
    const cpf = cpfParam.replace(/\D/g, ""); // Remove non-numeric characters

    if (!cpf || cpf.length !== 11) {
      return errorResponse("CPF inválido");
    }

    const result = await pool.query(
      `SELECT 
        id,
        name,
        description,
        amount,
        due_date as "dueDate",
        status,
        created_at as "createdAt"
      FROM pendencias
      WHERE cpf = $1
      ORDER BY created_at DESC`,
      [cpf]
    );

    return successResponse({
      cpf,
      hasPendencias: result.rows.length > 0,
      pendencias: result.rows,
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
