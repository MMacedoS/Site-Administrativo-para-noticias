// Dependency Injection Container (Dependency Inversion Principle)
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { NewsRepository } from "@/infrastructure/repositories/NewsRepository";
import { BcryptPasswordHasher } from "@/infrastructure/services/BcryptPasswordHasher";
import { JwtTokenService } from "@/infrastructure/services/JwtTokenService";
import { RegisterUserUseCase } from "@/application/use-cases/RegisterUserUseCase";
import { AuthenticateUserUseCase } from "@/application/use-cases/AuthenticateUserUseCase";
import { CreateNewsUseCase } from "@/application/use-cases/CreateNewsUseCase";
import { UpdateNewsUseCase } from "@/application/use-cases/UpdateNewsUseCase";
import { DeleteNewsUseCase } from "@/application/use-cases/DeleteNewsUseCase";
import { ListNewsUseCase } from "@/application/use-cases/ListNewsUseCase";
import { GetNewsByIdUseCase } from "@/application/use-cases/GetNewsByIdUseCase";
import { IncrementNewsViewsUseCase } from "@/application/use-cases/IncrementNewsViewsUseCase";

// Repositories
const userRepository = new UserRepository();
const newsRepository = new NewsRepository();

// Export repository getter
export const getNewsRepository = () => newsRepository;

// Services
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

// Use Cases - User
export const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  passwordHasher
);

export const authenticateUserUseCase = new AuthenticateUserUseCase(
  userRepository,
  passwordHasher,
  tokenService
);

// Use Cases - News
export const createNewsUseCase = new CreateNewsUseCase(newsRepository);
export const updateNewsUseCase = new UpdateNewsUseCase(newsRepository);
export const deleteNewsUseCase = new DeleteNewsUseCase(newsRepository);
export const listNewsUseCase = new ListNewsUseCase(newsRepository);
export const getNewsByIdUseCase = new GetNewsByIdUseCase(newsRepository);
export const incrementNewsViewsUseCase = new IncrementNewsViewsUseCase(
  newsRepository
);
