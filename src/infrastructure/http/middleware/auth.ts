// Middleware - Authentication
import { NextRequest, NextResponse } from "next/server";
import { JwtTokenService } from "@/infrastructure/services/JwtTokenService";

const tokenService = new JwtTokenService();

export function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const user = tokenService.verify(token);

  return user;
}

export function requireAuth(request: NextRequest) {
  const user = authenticateRequest(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return user;
}
