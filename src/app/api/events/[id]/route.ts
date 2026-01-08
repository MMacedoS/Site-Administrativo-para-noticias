import { NextRequest } from "next/server";
import { sql } from "@/infrastructure/database/connection";
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
    const result = await sql`SELECT * FROM events WHERE id = ${id}`;

    if (result.rows.length === 0) {
      return errorResponse("Evento não encontrado", 404);
    }

    return successResponse(result.rows[0]);
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

    const result = await sql`
      UPDATE events 
      SET title = ${title}, description = ${description}, date = ${date}, 
          location = ${location}, image_url = ${imageUrl}, order_index = ${
      order || 0
    }
      WHERE id = ${id}
      RETURNING *
    `;

    return successResponse(result.rows[0]);
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
    await sql`DELETE FROM events WHERE id = ${id}`;

    return successResponse({ message: "Evento excluído com sucesso" });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
