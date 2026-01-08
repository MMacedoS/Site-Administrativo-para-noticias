// API Route - Get News by Slug
import { NextRequest } from "next/server";
import { getNewsRepository } from "@/infrastructure/di/container";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const newsRepository = getNewsRepository();

    const news = await newsRepository.findBySlug(slug);

    if (!news) {
      return errorResponse("Notícia não encontrada", 404);
    }

    return successResponse(news);
  } catch (error) {
    return errorResponse(error);
  }
}
