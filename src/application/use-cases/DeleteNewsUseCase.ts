// Use Case - Delete News (Single Responsibility Principle)
import { INewsRepository } from "@/domain/repositories/INewsRepository";

export class DeleteNewsUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(
    id: number,
    authorId: number,
    isAdmin: boolean = false
  ): Promise<void> {
    const news = await this.newsRepository.findById(id);

    if (!news) {
      throw new Error("News not found");
    }

    // Check if user is the author (admins can delete any news)
    if (!isAdmin && Number(news.authorId) !== Number(authorId)) {
      throw new Error("Unauthorized");
    }

    const deleted = await this.newsRepository.delete(id);

    if (!deleted) {
      throw new Error("Failed to delete news");
    }
  }
}
