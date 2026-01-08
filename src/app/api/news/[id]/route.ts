// API Route - News by ID
import { NextRequest } from "next/server";
import {
  getNewsByIdUseCase,
  updateNewsUseCase,
  deleteNewsUseCase,
} from "@/infrastructure/di/container";
import { updateNewsSchema } from "@/application/validators/newsValidators";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

// GET - Get news by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await getNewsByIdUseCase.execute(Number(id));
    return successResponse(news);
  } catch (error) {
    return errorResponse(error, 404);
  }
}

// PUT - Update news (requires authentication)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = requireAuth(request);
    if (user instanceof Response) {
      return user;
    }

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateNewsSchema.parse(body);

    // Execute use case
    const news = await updateNewsUseCase.execute(
      Number(id),
      {
        ...validatedData,
        category: validatedData.category || undefined,
        imageUrl: validatedData.imageUrl || undefined,
      },
      user.id
    );

    return successResponse(news);
  } catch (error: any) {
    console.error("PUT /api/news/[id] - Erro:", error.message, error);
    return errorResponse(error, 400);
  }
}

// DELETE - Delete news (requires authentication)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = requireAuth(request);
    if (user instanceof Response) {
      return user;
    }

    const { id } = await params;

    // Execute use case
    await deleteNewsUseCase.execute(Number(id), user.id);

    return successResponse({ message: "News deleted successfully" });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
