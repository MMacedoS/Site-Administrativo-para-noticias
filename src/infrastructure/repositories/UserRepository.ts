// Infrastructure - User Repository Implementation for Vercel Postgres
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import {
  User,
  CreateUserDTO,
  UserWithoutPassword,
} from "@/domain/entities/User";
import { sql } from "../database/connection";

export class UserRepository implements IUserRepository {
  async create(user: CreateUserDTO): Promise<UserWithoutPassword> {
    const result = await sql`
      INSERT INTO users (email, password, name)
      VALUES (${user.email}, ${user.password}, ${user.name})
      RETURNING id, email, name, created_at as "createdAt"
    `;

    const row = result.rows[0];

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: new Date(row.createdAt),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await sql`
      SELECT id, email, password, name, created_at as "createdAt"
      FROM users
      WHERE email = ${email}
    `;

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      createdAt: new Date(row.createdAt),
    };
  }

  async findById(id: number): Promise<UserWithoutPassword | null> {
    const result = await sql`
      SELECT id, email, name, created_at as "createdAt"
      FROM users
      WHERE id = ${id}
    `;

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: new Date(row.createdAt),
    };
  }

  async list(): Promise<UserWithoutPassword[]> {
    const result = await sql`
      SELECT id, email, name, created_at as "createdAt"
      FROM users
      ORDER BY created_at DESC
    `;

    return result.rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: new Date(row.createdAt),
    }));
  }
}
