// API Route - Register User
import { NextRequest } from "next/server";
import { registerUserUseCase } from "@/infrastructure/di/container";
import { registerUserSchema } from "@/application/validators/userValidators";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { runMigrations } from "@/infrastructure/database/migrations";

// Run migrations on server start
runMigrations();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerUserSchema.parse(body);

    // Execute use case
    const user = await registerUserUseCase.execute(validatedData);

    return successResponse(user, 201);
  } catch (error) {
    return errorResponse(error, 400);
  }
}
