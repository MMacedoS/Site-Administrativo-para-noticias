import { NextRequest } from "next/server";
import { sql } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cpf: string }> }
) {
  try {
    const { cpf: cpfParam } = await params;
    const cpf = cpfParam.replace(/\D/g, ""); // Remove non-numeric characters

    if (!cpf || cpf.length !== 11) {
      return errorResponse("CPF inválido");
    }

    const result = await sql`
      SELECT 
        id,
        name,
        description,
        amount,
        due_date as "dueDate",
        status,
        created_at as "createdAt"
      FROM pendencias
      WHERE cpf = ${cpf}
      ORDER BY created_at DESC
    `;

    return successResponse({
      cpf,
      hasPendencias: result.rows.length > 0,
      pendencias: result.rows,
    });
  } catch (error: any) {
    console.error("Erro na API /api/pendencias/cpf GET:", error);
    return errorResponse(error.message);
  }
}
