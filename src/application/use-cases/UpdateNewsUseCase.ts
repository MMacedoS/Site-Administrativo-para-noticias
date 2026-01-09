// Use Case - Update News (Single Responsibility Principle)
import { INewsRepository } from "@/domain/repositories/INewsRepository";
import { UpdateNewsDTO, News } from "@/domain/entities/News";

export class UpdateNewsUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(
    id: number,
    data: UpdateNewsDTO,
    authorId: number,
    isAdmin: boolean = false
  ): Promise<News> {
    const news = await this.newsRepository.findById(id);

    if (!news) {
      throw new Error("News not found");
    }

    // Check if user is the author (admins can edit any news)
    if (!isAdmin && Number(news.authorId) !== Number(authorId)) {
      throw new Error("Unauthorized");
    }

    const updatedNews = await this.newsRepository.update(id, data);

    if (!updatedNews) {
      throw new Error("Failed to update news");
    }

    return updatedNews;
  }
}
