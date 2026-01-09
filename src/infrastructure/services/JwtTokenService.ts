// Infrastructure - JWT Token Service Implementation
import jwt from "jsonwebtoken";
import { ITokenService } from "@/domain/services/ITokenService";
import { UserWithoutPassword } from "@/domain/entities/User";

export class JwtTokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn: string | number;

  constructor() {
    this.secret = process.env.JWT_SECRET || "default-secret-change-this";
    this.expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  }

  generate(user: UserWithoutPassword): string {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      isSystem: user.isSystem || false,
    };

    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as any });
  }

  verify(token: string): UserWithoutPassword | null {
    try {
      const decoded = jwt.verify(token, this.secret) as any;

      return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        isSystem: decoded.isSystem || false,
        createdAt: new Date(),
      };
    } catch (error) {
      return null;
    }
  }
}
