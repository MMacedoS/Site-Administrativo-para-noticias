// Infrastructure - Password Hasher Implementation using bcrypt
import bcrypt from "bcryptjs";
import { IPasswordHasher } from "@/domain/services/IPasswordHasher";

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
