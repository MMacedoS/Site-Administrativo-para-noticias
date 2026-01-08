import { NextRequest } from "next/server";
import { getDatabase } from "@/infrastructure/database/connection";
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

    const db = getDatabase();
    const pendencias = db
      .prepare(
        `SELECT 
          id,
          name,
          description,
          amount,
          due_date as dueDate,
          status,
          created_at as createdAt
        FROM pendencias
        WHERE cpf = ?
        ORDER BY created_at DESC`
      )
      .all(cpf);

    return successResponse({
      cpf,
      hasPendencias: pendencias.length > 0,
      pendencias,
    });
  } catch (error: any) {
    console.error("Erro na API /api/pendencias/cpf GET:", error);
    return errorResponse(error.message);
  }
}
