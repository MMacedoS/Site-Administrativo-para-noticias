// API Route - Login User
import { NextRequest } from "next/server";
import { authenticateUserUseCase } from "@/infrastructure/di/container";
import { loginUserSchema } from "@/application/validators/userValidators";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = loginUserSchema.parse(body);

    // Execute use case
    const result = await authenticateUserUseCase.execute(validatedData);

    return successResponse(result);
  } catch (error) {
    return errorResponse(error, 401);
  }
}
