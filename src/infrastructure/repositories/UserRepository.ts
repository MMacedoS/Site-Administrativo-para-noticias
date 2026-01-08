// Infrastructure - User Repository Implementation
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import {
  User,
  CreateUserDTO,
  UserWithoutPassword,
} from "@/domain/entities/User";
import { getDatabase } from "../database/connection";

export class UserRepository implements IUserRepository {
  async create(user: CreateUserDTO): Promise<UserWithoutPassword> {
    const db = getDatabase();

    const stmt = db.prepare(`
      INSERT INTO users (email, password, name)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(user.email, user.password, user.name);

    return {
      id: Number(result.lastInsertRowid),
      email: user.email,
      name: user.name,
      createdAt: new Date(),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = getDatabase();

    const stmt = db.prepare(`
      SELECT id, email, password, name, created_at as createdAt
      FROM users
      WHERE email = ?
    `);

    const row = stmt.get(email) as any;

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
    const db = getDatabase();

    const stmt = db.prepare(`
      SELECT id, email, name, created_at as createdAt
      FROM users
      WHERE id = ?
    `);

    const row = stmt.get(id) as any;

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
    const db = getDatabase();

    const stmt = db.prepare(`
      SELECT id, email, name, created_at as createdAt
      FROM users
      ORDER BY created_at DESC
    `);

    const rows = stmt.all() as any[];

    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: new Date(row.createdAt),
    }));
  }
}
