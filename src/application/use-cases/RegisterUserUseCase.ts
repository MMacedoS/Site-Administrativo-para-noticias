// Use Case - Register User (Single Responsibility Principle)
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { IPasswordHasher } from "@/domain/services/IPasswordHasher";
import { CreateUserDTO, UserWithoutPassword } from "@/domain/entities/User";

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(data: CreateUserDTO): Promise<UserWithoutPassword> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Hash password
    const hashedPassword = await this.passwordHasher.hash(data.password);

    // Create user
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }
}
