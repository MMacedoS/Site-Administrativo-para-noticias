import { NextRequest } from "next/server";
import { sql } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const result = await sql`
      SELECT 
        id,
        name,
        email,
        is_system as "isSystem",
        created_at as "createdAt"
      FROM users
      ORDER BY created_at DESC
    `;

    return successResponse(result.rows);
  } catch (error: any) {
    console.error("Erro na API /api/users GET:", error);
    return errorResponse(error.message);
  }
}

export async function POST(request: NextRequest) {
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return errorResponse("Nome, email e senha são obrigatórios");
    }

    // Check if email already exists
    const existingResult =
      await sql`SELECT id FROM users WHERE email = ${email}`;

    if (existingResult.rows.length > 0) {
      return errorResponse("Email já cadastrado");
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const result = await sql`
      INSERT INTO users (name, email, password, is_system) 
      VALUES (${name}, ${email}, ${hashedPassword}, 0)
      RETURNING id, name, email, is_system as "isSystem", created_at as "createdAt"
    `;

    return successResponse(result.rows[0]);
  } catch (error: any) {
    console.error("Erro na API /api/users POST:", error);
    return errorResponse(error.message);
  }
}
