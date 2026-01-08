// Infrastructure - News Repository Implementation
import { INewsRepository } from "@/domain/repositories/INewsRepository";
import { News, CreateNewsDTO, UpdateNewsDTO } from "@/domain/entities/News";
import { getDatabase } from "../database/connection";
import { generateSlug } from "@/lib/slugify";

export class NewsRepository implements INewsRepository {
  async create(news: CreateNewsDTO): Promise<News> {
    const db = getDatabase();

    // Gerar slug a partir do título
    let slug = generateSlug(news.title);

    // Verificar se slug já existe e adicionar sufixo se necessário
    let counter = 1;
    let uniqueSlug = slug;
    while (true) {
      const existing = db
        .prepare("SELECT id FROM news WHERE slug = ?")
        .get(uniqueSlug);
      if (!existing) break;
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const stmt = db.prepare(`
      INSERT INTO news (title, slug, content, summary, category, author_id, published, image_url, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    const result = stmt.run(
      news.title,
      uniqueSlug,
      news.content,
      news.summary,
      news.category || null,
      news.authorId,
      news.published ? 1 : 0,
      news.imageUrl || null
    );

    const now = new Date();

    return {
      id: Number(result.lastInsertRowid),
      ...news,
      slug: uniqueSlug,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };
  }

  async update(id: number, news: UpdateNewsDTO): Promise<News | null> {
    const db = getDatabase();

    const updates: string[] = [];
    const values: any[] = [];

    if (news.title !== undefined) {
      updates.push("title = ?");
      values.push(news.title);

      // Atualizar slug se título foi alterado
      const currentNews = await this.findById(id);
      if (currentNews) {
        let newSlug = generateSlug(news.title);

        // Verificar unicidade do novo slug
        let counter = 1;
        let uniqueSlug = newSlug;
        while (true) {
          const existing: any = db
            .prepare("SELECT id FROM news WHERE slug = ? AND id != ?")
            .get(uniqueSlug, id);
          if (!existing) break;
          uniqueSlug = `${newSlug}-${counter}`;
          counter++;
        }

        updates.push("slug = ?");
        values.push(uniqueSlug);
      }
    }
    if (news.content !== undefined) {
      updates.push("content = ?");
      values.push(news.content);
    }
    if (news.summary !== undefined) {
      updates.push("summary = ?");
      values.push(news.summary);
    }
    if (news.category !== undefined) {
      updates.push("category = ?");
      values.push(news.category);
    }
    if (news.imageUrl !== undefined) {
      updates.push("image_url = ?");
      values.push(news.imageUrl);
    }
    if (news.published !== undefined) {
      updates.push("published = ?");
      values.push(news.published ? 1 : 0);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    const stmt = db.prepare(`
      UPDATE news
      SET ${updates.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...values);

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const db = getDatabase();

    const stmt = db.prepare("DELETE FROM news WHERE id = ?");
    const result = stmt.run(id);

    return result.changes > 0;
  }

  async findById(id: number): Promise<News | null> {
    const db = getDatabase();

    const stmt = db.prepare(`
      SELECT 
        id, title, slug, content, summary, category, views,
        image_url as imageUrl,
        author_id as authorId, published,
        created_at as createdAt, updated_at as updatedAt
      FROM news
      WHERE id = ?
    `);

    const row = stmt.get(id) as any;

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      summary: row.summary,
      category: row.category,
      views: row.views || 0,
      imageUrl: row.imageUrl,
      authorId: row.authorId,
      published: Boolean(row.published),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  async findBySlug(slug: string): Promise<News | null> {
    const db = getDatabase();

    const stmt = db.prepare(`
      SELECT 
        id, title, slug, content, summary, category, views,
        image_url as imageUrl,
        author_id as authorId, published,
        created_at as createdAt, updated_at as updatedAt
      FROM news
      WHERE slug = ?
    `);

    const row = stmt.get(slug) as any;

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      summary: row.summary,
      category: row.category,
      views: row.views || 0,
      imageUrl: row.imageUrl,
      authorId: row.authorId,
      published: Boolean(row.published),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  async list(published?: boolean): Promise<News[]> {
    const db = getDatabase();

    let query = `
      SELECT 
        id, title, slug, content, summary, category, views,
        image_url as imageUrl,
        author_id as authorId, published,
        created_at as createdAt, updated_at as updatedAt
      FROM news
    `;

    if (published !== undefined) {
      query += " WHERE published = ?";
    }

    query += " ORDER BY created_at DESC";

    const stmt = db.prepare(query);
    const rows =
      published !== undefined
        ? (stmt.all(published ? 1 : 0) as any[])
        : (stmt.all() as any[]);

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      summary: row.summary,
      category: row.category,
      views: row.views || 0,
      imageUrl: row.imageUrl,
      authorId: row.authorId,
      published: Boolean(row.published),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  async listByAuthor(authorId: number): Promise<News[]> {
    const db = getDatabase();

    const stmt = db.prepare(`
      SELECT 
        id, title, slug, content, summary, category, views,
        image_url as imageUrl,
        author_id as authorId, published,
        created_at as createdAt, updated_at as updatedAt
      FROM news
      WHERE author_id = ?
      ORDER BY created_at DESC
    `);

    const rows = stmt.all(authorId) as any[];

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      summary: row.summary,
      category: row.category,
      views: row.views || 0,
      imageUrl: row.imageUrl,
      authorId: row.authorId,
      published: Boolean(row.published),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  async incrementViews(id: number): Promise<void> {
    const db = getDatabase();
    const stmt = db.prepare("UPDATE news SET views = views + 1 WHERE id = ?");
    stmt.run(id);
  }
}
