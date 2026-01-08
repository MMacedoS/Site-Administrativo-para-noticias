// API - Database Backup
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/http/middleware/auth";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest): Promise<Response> {
  // Verificar autenticação
  const authResult = requireAuth(request);

  // Se retornou um Response, é um erro de autenticação
  if (authResult instanceof Response) {
    return authResult;
  }

  const dbPath = path.join(process.cwd(), "data", "news.db");

  // Verificar se o arquivo existe
  if (!fs.existsSync(dbPath)) {
    return NextResponse.json(
      { error: "Banco de dados não encontrado" },
      { status: 404 }
    );
  }

  try {
    // Ler o arquivo do banco de dados
    const fileBuffer = fs.readFileSync(dbPath);

    // Criar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup-unooba-${timestamp}.db`;

    // Retornar o arquivo como download
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao fazer backup do banco de dados:", error);
    return NextResponse.json(
      { error: "Erro ao fazer backup do banco de dados" },
      { status: 500 }
    );
  }
}
