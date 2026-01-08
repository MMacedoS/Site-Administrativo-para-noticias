// Use Case - Create News (Single Responsibility Principle)
import { INewsRepository } from "@/domain/repositories/INewsRepository";
import { CreateNewsDTO, News } from "@/domain/entities/News";

export class CreateNewsUseCase {
  constructor(private newsRepository: INewsRepository) {}

  async execute(data: CreateNewsDTO): Promise<News> {
    return await this.newsRepository.create(data);
  }
}
