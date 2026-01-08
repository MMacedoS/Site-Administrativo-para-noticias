// Infrastructure - News Repository Implementation
import { INewsRepository } from "@/domain/repositories/INewsRepository";
import { News, CreateNewsDTO, UpdateNewsDTO } from "@/domain/entities/News";
import { sql } from "../database/connection";
import { generateSlug } from "@/lib/slugify";

export class NewsRepository implements INewsRepository {
  async create(news: CreateNewsDTO): Promise<News> {
    // Gerar slug a partir do título
    let slug = generateSlug(news.title);

    // Verificar se slug já existe e adicionar sufixo se necessário
    let counter = 1;
    let uniqueSlug = slug;
    while (true) {
      const existing = await sql`
        SELECT id FROM news WHERE slug = ${uniqueSlug}
      `;
      if (existing.rows.length === 0) break;
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const result = await sql`
      INSERT INTO news (title, slug, content, summary, category, author_id, published, image_url, views)
      VALUES (
        ${news.title},
        ${uniqueSlug},
        ${news.content},
        ${news.summary},
        ${news.category || null},
        ${news.authorId},
        ${news.published ? true : false},
        ${news.imageUrl || null},
        0
      )
      RETURNING *
    `;

    const row = result.rows[0];

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      summary: row.summary,
      category: row.category,
      views: row.views || 0,
      imageUrl: row.image_url,
      authorId: row.author_id,
      published: Boolean(row.published),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async update(id: number, news: UpdateNewsDTO): Promise<News | null> {
    const updates: string[] = [];
    const updateData: any = {};

    if (news.title !== undefined) {
      updateData.title = news.title;

      // Atualizar slug se título foi alterado
      const currentNews = await this.findById(id);
      if (currentNews) {
        let newSlug = generateSlug(news.title);

        // Verificar unicidade do novo slug
        let counter = 1;
        let uniqueSlug = newSlug;
        while (true) {
          const existing = await sql`
            SELECT id FROM news WHERE slug = ${uniqueSlug} AND id != ${id}
          `;
          if (existing.rows.length === 0) break;
          uniqueSlug = `${newSlug}-${counter}`;
          counter++;
        }

        updateData.slug = uniqueSlug;
      }
    }
    if (news.content !== undefined) {
      updateData.content = news.content;
    }
    if (news.summary !== undefined) {
      updateData.summary = news.summary;
    }
    if (news.category !== undefined) {
      updateData.category = news.category;
    }
    if (news.imageUrl !== undefined) {
      updateData.image_url = news.imageUrl;
    }
    if (news.published !== undefined) {
      updateData.published = news.published;
    }

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    // Construir query dinamicamente
    const setClauses = Object.keys(updateData).map(
      (key, index) => `${key} = $${index + 1}`
    );
    const values = Object.values(updateData);
    values.push(id);

    const query = `
      UPDATE news
      SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING *
    `;

    const result = await sql.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      summary: row.summary,
      category: row.category,
      views: row.views || 0,
      imageUrl: row.image_url,
      authorId: row.author_id,
      published: Boolean(row.published),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async delete(id: number): Promise<boolean> {
    const result = await sql`
      DELETE FROM news WHERE id = ${id}
    `;

    return result.rowCount !== null && result.rowCount > 0;
  }

  async findById(id: number): Promise<News | null> {
    const result = await sql`
      SELECT 
        id, title, slug, content, summary, category, views,
        image_url, author_id, published,
        created_at, updated_at
      FROM news
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      summary: row.summary,
      category: row.category,
      views: row.views || 0,
      imageUrl: row.image_url,
      authorId: row.author_id,
      published: Boolean(row.published),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async findBySlug(slug: string): Promise<News | null> {
    const result = await sql`
      SELECT 
        id, title, slug, content, summary, category, views,
        image_url, author_id, published,
        created_at, updated_at
      FROM news
      WHERE slug = ${slug}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      summary: row.summary,
      category: row.category,
      views: row.views || 0,
      imageUrl: row.image_url,
      authorId: row.author_id,
      published: Boolean(row.published),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async list(published?: boolean): Promise<News[]> {
    const result =
      published !== undefined
        ? await sql`
          SELECT 
            id, title, slug, content, summary, category, views,
            image_url, author_id, published,
            created_at, updated_at
          FROM news
          WHERE published = ${published}
          ORDER BY created_at DESC
        `
        : await sql`
          SELECT 
            id, title, slug, content, summary, category, views,
            image_url, author_id, published,
            created_at, updated_at
          FROM news
          ORDER BY created_at DESC
        `;

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      summary: row.summary,
      category: row.category,
      views: row.views || 0,
      imageUrl: row.image_url,
      authorId: row.author_id,
      published: Boolean(row.published),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  async listByAuthor(authorId: number): Promise<News[]> {
    const result = await sql`
      SELECT 
        id, title, slug, content, summary, category, views,
        image_url, author_id, published,
        created_at, updated_at
      FROM news
      WHERE author_id = ${authorId}
      ORDER BY created_at DESC
    `;

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      summary: row.summary,
      category: row.category,
      views: row.views || 0,
      imageUrl: row.image_url,
      authorId: row.author_id,
      published: Boolean(row.published),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  async incrementViews(id: number): Promise<void> {
    await sql`
      UPDATE news SET views = views + 1 WHERE id = ${id}
    `;
  }
}
