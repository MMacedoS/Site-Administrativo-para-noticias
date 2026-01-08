// Domain - User Repository Interface (Dependency Inversion Principle)
import { User, CreateUserDTO, UserWithoutPassword } from "../entities/User";

export interface IUserRepository {
  create(user: CreateUserDTO): Promise<UserWithoutPassword>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<UserWithoutPassword | null>;
  list(): Promise<UserWithoutPassword[]>;
}
