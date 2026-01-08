import { NextRequest } from "next/server";
import { sql } from "@/infrastructure/database/connection";
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

    // Check if user exists and is not system user
    const existingUserResult = await sql`
      SELECT id, is_system FROM users WHERE id = ${id}
    `;
    const existingUser = existingUserResult.rows[0];

    if (!existingUser) {
      return errorResponse("Usuário não encontrado");
    }

    if (existingUser.is_system === 1) {
      return errorResponse("Usuário do sistema não pode ser alterado");
    }

    // Check if email is already used by another user
    if (email) {
      const emailExistsResult = await sql`
        SELECT id FROM users WHERE email = ${email} AND id != ${id}
      `;

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
      result = await sql`
        UPDATE users 
        SET name = ${values.name}, email = ${values.email}, password = ${values.password}
        WHERE id = ${id}
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"
      `;
    } else if (name && email) {
      result = await sql`
        UPDATE users 
        SET name = ${values.name}, email = ${values.email}
        WHERE id = ${id}
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"
      `;
    } else if (name && password) {
      result = await sql`
        UPDATE users 
        SET name = ${values.name}, password = ${values.password}
        WHERE id = ${id}
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"
      `;
    } else if (email && password) {
      result = await sql`
        UPDATE users 
        SET email = ${values.email}, password = ${values.password}
        WHERE id = ${id}
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"
      `;
    } else if (name) {
      result = await sql`
        UPDATE users 
        SET name = ${values.name}
        WHERE id = ${id}
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"
      `;
    } else if (email) {
      result = await sql`
        UPDATE users 
        SET email = ${values.email}
        WHERE id = ${id}
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"
      `;
    } else if (password) {
      result = await sql`
        UPDATE users 
        SET password = ${values.password}
        WHERE id = ${id}
        RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"
      `;
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
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const { id } = await params;

    // Check if user exists and is not system user
    const existingUserResult = await sql`
      SELECT id, is_system FROM users WHERE id = ${id}
    `;
    const existingUser = existingUserResult.rows[0];

    if (!existingUser) {
      return errorResponse("Usuário não encontrado");
    }

    if (existingUser.is_system === 1) {
      return errorResponse("Usuário do sistema não pode ser removido");
    }

    // Delete user
    await sql`DELETE FROM users WHERE id = ${id}`;

    return successResponse({ message: "Usuário removido com sucesso" });
  } catch (error: any) {
    console.error("Erro na API /api/users/[id] DELETE:", error);
    return errorResponse(error.message);
  }
}
