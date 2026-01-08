// Use Case - Get News By Id (Single Responsibility Principle)
import { INewsRepository } from "@/domain/repositories/INewsRepository";
import { News } from "@/domain/entities/News";

export class GetNewsByIdUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(id: number): Promise<News> {
    const news = await this.newsRepository.findById(id);

    if (!news) {
      throw new Error("News not found");
    }

    return news;
  }
}
