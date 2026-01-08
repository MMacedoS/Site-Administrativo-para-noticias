import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rotas /admin (exceto /admin/login e /admin/register)
  if (pathname.startsWith("/admin")) {
    // Permitir acesso às rotas de autenticação
    if (pathname === "/admin/login" || pathname === "/admin/register") {
      return NextResponse.next();
    }

    // Verificar token no cookie
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      // Redirecionar para login se não tiver token
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Token válido, permitir acesso
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
