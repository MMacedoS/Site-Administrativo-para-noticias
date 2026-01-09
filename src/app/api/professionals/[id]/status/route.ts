import { NextResponse } from "next/server";
import { getPool } from "@/infrastructure/database/connection";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireAuth(request as any);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;
    const { status } = await request.json();

    if (
      !["Regular", "Irregular", "Cancelado", "Cancelado (i)"].includes(status)
    ) {
      return NextResponse.json(
        { success: false, message: "Status inválido" },
        { status: 400 }
      );
    }

    const pool = getPool();
    const result = await pool.query(
      `UPDATE professionals 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Profissional não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status atualizado com sucesso",
      data: result.rows[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao atualizar status",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
