// API - Database Restore
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/http/middleware/auth";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  // Verificar autenticação
  const authResult = requireAuth(request);

  // Se retornou um Response, é um erro de autenticação
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 }
      );
    }

    // Verificar se é um arquivo .db
    if (!file.name.endsWith(".db")) {
      return NextResponse.json(
        { error: "Apenas arquivos .db são permitidos" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const dbPath = path.join(process.cwd(), "data", "news.db");
    const backupPath = path.join(
      process.cwd(),
      "data",
      `news-backup-${Date.now()}.db`
    );

    // Fazer backup do banco atual antes de substituir
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
    }

    // Garantir que o diretório existe
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Remover arquivos relacionados ao banco antigo
    const relatedFiles = [dbPath, `${dbPath}-shm`, `${dbPath}-wal`];

    for (const filePath of relatedFiles) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Escrever o novo arquivo
    fs.writeFileSync(dbPath, buffer);

    return NextResponse.json({
      message: "Banco de dados restaurado com sucesso",
      backupFile: path.basename(backupPath),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao restaurar banco de dados" },
      { status: 500 }
    );
  }
}
