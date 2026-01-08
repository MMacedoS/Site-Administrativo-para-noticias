// API Route - News CRUD
import { NextRequest } from "next/server";
import {
  createNewsUseCase,
  listNewsUseCase,
} from "@/infrastructure/di/container";
import { createNewsSchema } from "@/application/validators/newsValidators";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

// GET - List all news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    let publishedFilter: boolean | undefined;
    if (published === "true") publishedFilter = true;
    if (published === "false") publishedFilter = false;

    const news = await listNewsUseCase.execute(publishedFilter);
    return successResponse(news);
  } catch (error) {
    return errorResponse(error);
  }
}

// POST - Create news (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = requireAuth(request);
    if (user instanceof Response) {
      return user; // Return unauthorized response
    }

    const body = await request.json();

    // Validate input
    const validatedData = createNewsSchema.parse(body);

    // Execute use case
    const news = await createNewsUseCase.execute({
      ...validatedData,
      category: validatedData.category || undefined,
      imageUrl: validatedData.imageUrl || undefined,
      authorId: user.id,
    });

    return successResponse(news, 201);
  } catch (error) {
    return errorResponse(error, 400);
  }
}
