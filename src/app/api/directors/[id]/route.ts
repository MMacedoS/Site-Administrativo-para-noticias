import { NextRequest } from "next/server";
import { getDatabase } from "@/infrastructure/database/connection";
import {
  successResponse,
  errorResponse,
} from "@/infrastructure/http/helpers/response";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDatabase();
    const director = db.prepare("SELECT * FROM directors WHERE id = ?").get(id);

    if (!director) {
      return errorResponse("Diretor não encontrado", 404);
    }

    return successResponse(director);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const body = await request.json();
    const { name, position, email, phone, bio, photoUrl, order } = body;

    const db = getDatabase();
    db.prepare(
      `UPDATE directors 
       SET name = ?, position = ?, email = ?, phone = ?, bio = ?, photo_url = ?, order_index = ?
       WHERE id = ?`
    ).run(name, position, email, phone, bio, photoUrl, order || 0, id);

    const updated = db.prepare("SELECT * FROM directors WHERE id = ?").get(id);

    return successResponse(updated);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = requireAuth(request);
  if (user instanceof Response) return user;

  try {
    const db = getDatabase();
    db.prepare("DELETE FROM directors WHERE id = ?").run(id);

    return successResponse({ message: "Diretor excluído com sucesso" });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
