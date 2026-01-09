// Infrastructure - User Repository Implementation for Vercel Postgres
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import {
  User,
  CreateUserDTO,
  UserWithoutPassword,
} from "@/domain/entities/User";
import { getPool } from "../database/connection";

export class UserRepository implements IUserRepository {
  async create(user: CreateUserDTO): Promise<UserWithoutPassword> {
    const pool = getPool();
    const result = await pool.query(
      `
      INSERT INTO users (email, password, name)
      VALUES ($1, $2, $3)
      RETURNING id, email, name, is_system as "isSystem", created_at as "createdAt"
    `,
      [user.email, user.password, user.name]
    );

    const row = result.rows[0];

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      isSystem: row.isSystem || false,
      createdAt: new Date(row.createdAt),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const pool = getPool();
    const result = await pool.query(
      `
      SELECT id, email, password, name, is_system as "isSystem", created_at as "createdAt"
      FROM users
      WHERE email = $1
    `,
      [email]
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      isSystem: row.isSystem || false,
      createdAt: new Date(row.createdAt),
    };
  }

  async findById(id: number): Promise<UserWithoutPassword | null> {
    const pool = getPool();
    const result = await pool.query(
      `
      SELECT id, email, name, is_system as "isSystem", created_at as "createdAt"
      FROM users
      WHERE id = $1
    `,
      [id]
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      isSystem: row.isSystem || false,
      createdAt: new Date(row.createdAt),
    };
  }

  async list(): Promise<UserWithoutPassword[]> {
    const pool = getPool();
    const result = await pool.query(`
      SELECT id, email, name, is_system as "isSystem", created_at as "createdAt"
      FROM users
      ORDER BY created_at DESC
    `);

    return result.rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      isSystem: row.isSystem || false,
      createdAt: new Date(row.createdAt),
    }));
  }
}
