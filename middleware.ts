// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/homepage", "/pemasukan", "/pengeluaran", "/penganggaran", "/profile"];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      console.error("JWT error:", err);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("token", "", { path: "/", maxAge: 0 });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/homepage/:path*", "/pemasukan/:path*", "/pengeluaran/:path*", "/penganggaran/:path*", "/profile/:path*"]
};