import { NextRequest } from "next/server";
import { getDatabase } from "@/infrastructure/database/connection";
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
    const db = getDatabase();
    const users = db
      .prepare(
        `SELECT 
          id,
          name,
          email,
          is_system as isSystem,
          created_at as createdAt
        FROM users
        ORDER BY created_at DESC`
      )
      .all();

    return successResponse(users);
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

    const db = getDatabase();

    // Check if email already exists
    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existing) {
      return errorResponse("Email já cadastrado");
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const result = db
      .prepare(
        "INSERT INTO users (name, email, password, is_system) VALUES (?, ?, ?, 0)"
      )
      .run(name, email, hashedPassword);

    const newUser = db
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
      .get(result.lastInsertRowid);

    return successResponse(newUser);
  } catch (error: any) {
    console.error("Erro na API /api/users POST:", error);
    return errorResponse(error.message);
  }
}
