// Use Case - Increment News Views
import { INewsRepository } from "@/domain/repositories/INewsRepository";

export class IncrementNewsViewsUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(id: number): Promise<void> {
    // Increment views in the database
    const news = await this.newsRepository.findById(id);
    if (news) {
      await this.newsRepository.incrementViews(id);
    }
  }
}
