// Domain - Password Hasher Interface (Dependency Inversion Principle)
export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
