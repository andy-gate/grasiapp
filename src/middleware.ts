import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/id/login", request.url));
  }

  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/id/login", request.url));
  }

  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/api")
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    if (!token) {
      const locale = request.cookies.get("NEXT_LOCALE")?.value;
      const loginPath =
        locale === "en" ? "/en/login" : "/id/login";
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/u/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
