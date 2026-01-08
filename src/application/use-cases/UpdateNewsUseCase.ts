// Use Case - Update News (Single Responsibility Principle)
import { INewsRepository } from "@/domain/repositories/INewsRepository";
import { UpdateNewsDTO, News } from "@/domain/entities/News";

export class UpdateNewsUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(
    id: number,
    data: UpdateNewsDTO,
    authorId: number
  ): Promise<News> {
    const news = await this.newsRepository.findById(id);

    if (!news) {
      throw new Error("News not found");
    }

    // Check if user is the author
    if (news.authorId !== authorId) {
      throw new Error("Unauthorized");
    }

    const updatedNews = await this.newsRepository.update(id, data);

    if (!updatedNews) {
      throw new Error("Failed to update news");
    }

    return updatedNews;
  }
}
