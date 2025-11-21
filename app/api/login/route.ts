// app/api/login/route.ts
import sql from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const result = await sql`SELECT id, email, password FROM "User" WHERE email = ${email}`;
  const user = result[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Generate JWT dengan jose
  const token = await new SignJWT({ id: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const response = NextResponse.json(
    {
      message: "Login successful",
      user: { id: user.id, email: user.email },
    },
    { status: 200 }
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "lax",
  });

  return response;
}