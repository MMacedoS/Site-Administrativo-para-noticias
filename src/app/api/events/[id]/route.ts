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
    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(id);

    if (!event) {
      return errorResponse("Evento não encontrado", 404);
    }

    return successResponse(event);
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
    const { title, description, date, location, imageUrl, order } = body;

    const db = getDatabase();
    db.prepare(
      `UPDATE events 
       SET title = ?, description = ?, date = ?, location = ?, image_url = ?, order_index = ?
       WHERE id = ?`
    ).run(title, description, date, location, imageUrl, order || 0, id);

    const updated = db.prepare("SELECT * FROM events WHERE id = ?").get(id);

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
    db.prepare("DELETE FROM events WHERE id = ?").run(id);

    return successResponse({ message: "Evento excluído com sucesso" });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
