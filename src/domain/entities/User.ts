// Domain - User Entity
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  isSystem?: boolean;
  createdAt: Date;
}

export type UserWithoutPassword = Omit<User, "password">;

export type CreateUserDTO = Omit<User, "id" | "createdAt">;

export type LoginDTO = {
  email: string;
  password: string;
};
