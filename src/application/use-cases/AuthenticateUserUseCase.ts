// Use Case - Authenticate User (Single Responsibility Principle)
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { IPasswordHasher } from "@/domain/services/IPasswordHasher";
import { ITokenService } from "@/domain/services/ITokenService";
import { LoginDTO } from "@/domain/entities/User";

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService
  ) {}

  async execute(data: LoginDTO): Promise<{ token: string }> {
    // Find user
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isValidPassword = await this.passwordHasher.compare(
      data.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;

    // Generate token
    const token = this.tokenService.generate(userWithoutPassword);

    return { token };
  }
}
