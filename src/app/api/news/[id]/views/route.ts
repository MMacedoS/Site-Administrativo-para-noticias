// API Route - Increment News Views
import { NextRequest } from "next/server";
import { incrementNewsViewsUseCase } from "@/infrastructure/di/container";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";

// POST - Increment views
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await incrementNewsViewsUseCase.execute(Number(id));
    return successResponse({ message: "Visualização registrada" });
  } catch (error) {
    return errorResponse(error, 500);
  }
}
