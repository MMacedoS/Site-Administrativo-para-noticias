import { NextRequest } from "next/server";
import { getDatabase } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";
import bcrypt from "bcryptjs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, password } = body;

    const db = getDatabase();

    // Check if user exists and is not system user
    const existingUser = db
      .prepare("SELECT id, is_system FROM users WHERE id = ?")
      .get(id) as { id: number; is_system: number } | undefined;

    if (!existingUser) {
      return errorResponse("Usuário não encontrado");
    }

    if (existingUser.is_system === 1) {
      return errorResponse("Usuário do sistema não pode ser alterado");
    }

    // Check if email is already used by another user
    if (email) {
      const emailExists = db
        .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
        .get(email, id);

      if (emailExists) {
        return errorResponse("Email já está em uso");
      }
    }

    // Build update query
    let updateQuery = "UPDATE users SET ";
    const updateParams: any[] = [];

    if (name) {
      updateQuery += "name = ?, ";
      updateParams.push(name);
    }

    if (email) {
      updateQuery += "email = ?, ";
      updateParams.push(email);
    }

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      updateQuery += "password = ?, ";
      updateParams.push(hashedPassword);
    }

    // Remove trailing comma and add WHERE clause
    updateQuery = updateQuery.slice(0, -2) + " WHERE id = ?";
    updateParams.push(id);

    db.prepare(updateQuery).run(...updateParams);

    const updated = db
      .prepare(
        `SELECT 
          id,
          name,
          email,
          is_system as isSystem,
          created_at as createdAt
        FROM users
        WHERE id = ?`
      )
      .get(id);

    return successResponse(updated);
  } catch (error: any) {
    console.error("Erro na API /api/users/[id] PUT:", error);
    return errorResponse(error.message);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const { id } = await params;
    const db = getDatabase();

    // Check if user exists and is not system user
    const existingUser = db
      .prepare("SELECT id, is_system FROM users WHERE id = ?")
      .get(id) as { id: number; is_system: number } | undefined;

    if (!existingUser) {
      return errorResponse("Usuário não encontrado");
    }

    if (existingUser.is_system === 1) {
      return errorResponse("Usuário do sistema não pode ser removido");
    }

    // Delete user
    db.prepare("DELETE FROM users WHERE id = ?").run(id);

    return successResponse({ message: "Usuário removido com sucesso" });
  } catch (error: any) {
    console.error("Erro na API /api/users/[id] DELETE:", error);
    return errorResponse(error.message);
  }
}
