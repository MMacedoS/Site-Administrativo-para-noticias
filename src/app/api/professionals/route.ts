import { NextResponse } from "next/server";
import { getPool } from "@/infrastructure/database/connection";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

// GET - Lista todos os profissionais (admin)
export async function GET(request: Request) {
  try {
    const authResult = requireAuth(request as any);
    if (authResult instanceof NextResponse) {
      return authResult; // Retorna erro de autenticação
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    const pool = getPool();

    // Contar total
    const countQuery = search
      ? `SELECT COUNT(*) FROM professionals WHERE LOWER(name) LIKE LOWER($1) OR cpf LIKE $1`
      : `SELECT COUNT(*) FROM professionals`;

    const countParams = search ? [`%${search}%`] : [];
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    // Buscar profissionais
    const dataQuery = search
      ? `SELECT 
          id, name, cpf, registration_number as "registrationNumber",
          status, formation, city, state,
          registration_date as "registrationDate",
          created_at as "createdAt", updated_at as "updatedAt"
        FROM professionals
        WHERE LOWER(name) LIKE LOWER($1) OR cpf LIKE $1
        ORDER BY name
        LIMIT $2 OFFSET $3`
      : `SELECT 
          id, name, cpf, registration_number as "registrationNumber",
          status, formation, city, state,
          registration_date as "registrationDate",
          created_at as "createdAt", updated_at as "updatedAt"
        FROM professionals
        ORDER BY name
        LIMIT $1 OFFSET $2`;

    const dataParams = search
      ? [`%${search}%`, limit, offset]
      : [limit, offset];
    const result = await pool.query(dataQuery, dataParams);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching professionals:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar profissionais" },
      { status: 500 }
    );
  }
}

// DELETE - Limpar todos os profissionais (admin)
export async function DELETE(request: Request) {
  try {
    const authResult = requireAuth(request as any);
    if (authResult instanceof NextResponse) {
      return authResult; // Retorna erro de autenticação
    }

    const pool = getPool();
    await pool.query("DELETE FROM professionals");

    return NextResponse.json({
      success: true,
      message: "Todos os profissionais foram removidos",
    });
  } catch (error: any) {
    console.error("Error deleting professionals:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao remover profissionais" },
      { status: 500 }
    );
  }
}
