// Domain - Token Service Interface (Dependency Inversion Principle)
import { UserWithoutPassword } from "../entities/User";

export interface ITokenService {
  generate(user: UserWithoutPassword): string;
  verify(token: string): UserWithoutPassword | null;
}
