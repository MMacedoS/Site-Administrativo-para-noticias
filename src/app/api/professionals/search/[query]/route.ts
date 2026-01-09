import { NextResponse } from "next/server";
import { getPool } from "@/infrastructure/database/connection";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ query: string }> }
) {
  try {
    const { query } = await params;

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Por favor, forneça pelo menos 3 caracteres para a busca",
        },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Limpar CPF se for numérico
    const cleanQuery = query.replace(/\D/g, "");

    // Buscar por CPF ou Nome
    const result = await pool.query(
      `SELECT 
        id, name, cpf, registration_number as "registrationNumber",
        status, formation, city, state, 
        registration_date as "registrationDate",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM professionals
      WHERE cpf = $1 OR LOWER(name) LIKE LOWER($2)
      ORDER BY name
      LIMIT 10`,
      [cleanQuery, `%${query}%`]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: true,
        found: false,
        message: "Nenhum profissional encontrado com os dados informados",
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      found: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error searching professional:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao consultar profissional" },
      { status: 500 }
    );
  }
}
