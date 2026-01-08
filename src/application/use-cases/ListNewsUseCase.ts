// Use Case - List News (Single Responsibility Principle)
import { INewsRepository } from "@/domain/repositories/INewsRepository";
import { News } from "@/domain/entities/News";

export class ListNewsUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(published?: boolean): Promise<News[]> {
    return await this.newsRepository.list(published);
  }
}
