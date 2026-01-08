// Domain - News Repository Interface (Dependency Inversion Principle)
import { News, CreateNewsDTO, UpdateNewsDTO } from "../entities/News";

export interface INewsRepository {
  create(news: CreateNewsDTO): Promise<News>;
  update(id: number, news: UpdateNewsDTO): Promise<News | null>;
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<News | null>;
  findBySlug(slug: string): Promise<News | null>;
  list(published?: boolean): Promise<News[]>;
  listByAuthor(authorId: number): Promise<News[]>;
  incrementViews(id: number): Promise<void>;
}
