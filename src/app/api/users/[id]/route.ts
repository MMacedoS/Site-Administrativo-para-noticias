import { NextRequest } from "next/server";
import { getPool } from "@/infrastructure/database/connection";
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
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, password } = body;

    // Check if user exists and is not system user
    const existingUserResult = await pool.query(
      "SELECT id, is_system FROM users WHERE id = $1",
      [id]
    );
    const existingUser = existingUserResult.rows[0];

    if (!existingUser) {
      return errorResponse("Usuário não encontrado");
    }

    if (existingUser.is_system === 1) {
      return errorResponse("Usuário do sistema não pode ser alterado");
    }

    // Check if email is already used by another user
    if (email) {
      const emailExistsResult = await pool.query(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [email, id]
      );

      if (emailExistsResult.rows.length > 0) {
        return errorResponse("Email já está em uso");
      }
    }

    // Build update fields
    const updates = [];
    const values: any = {};

    if (name) {
      updates.push("name");
      values.name = name;
    }

    if (email) {
      updates.push("email");
      values.email = email;
    }

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      updates.push("password");
      values.password = hashedPassword;
    }

    // Perform update
    let result;
    if (name && email && password) {
      result = await pool.query(
        `UPDATE users 
        SET name = $1, email = $2, password = $3
        WHERE id = $4
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"`,
        [values.name, values.email, values.password, id]
      );
    } else if (name && email) {
      result = await pool.query(
        `UPDATE users 
        SET name = $1, email = $2
        WHERE id = $3
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"`,
        [values.name, values.email, id]
      );
    } else if (name && password) {
      result = await pool.query(
        `UPDATE users 
        SET name = $1, password = $2
        WHERE id = $3
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"`,
        [values.name, values.password, id]
      );
    } else if (email && password) {
      result = await pool.query(
        `UPDATE users 
        SET email = $1, password = $2
        WHERE id = $3
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"`,
        [values.email, values.password, id]
      );
    } else if (name) {
      result = await pool.query(
        `UPDATE users 
        SET name = $1
        WHERE id = $2
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"`,
        [values.name, id]
      );
    } else if (email) {
      result = await pool.query(
        `UPDATE users 
        SET email = $1
        WHERE id = $2
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"`,
        [values.email, id]
      );
    } else if (password) {
      result = await pool.query(
        `UPDATE users 
        SET password = $1
        WHERE id = $2
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"`,
        [values.password, id]
      );
    }

    return successResponse(result?.rows[0]);
  } catch (error: any) {
    console.error("Erro na API /api/users/[id] PUT:", error);
    return errorResponse(error.message);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pool = getPool();
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const { id } = await params;

    // Check if user exists and is not system user
    const existingUserResult = await pool.query(
      "SELECT id, is_system FROM users WHERE id = $1",
      [id]
    );
    const existingUser = existingUserResult.rows[0];

    if (!existingUser) {
      return errorResponse("Usuário não encontrado");
    }

    if (existingUser.is_system === 1) {
      return errorResponse("Usuário do sistema não pode ser removido");
    }

    // Delete user
    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    return successResponse({ message: "Usuário removido com sucesso" });
  } catch (error: any) {
    console.error("Erro na API /api/users/[id] DELETE:", error);
    return errorResponse(error.message);
  }
}
