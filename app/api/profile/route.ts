import sql from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);


export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log("Profile API token:", token);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const result = await sql`SELECT id, name, email FROM "User" WHERE id = ${payload.id}`;
    const user = result[0];
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("JWT verification error:", err);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}


export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { name, password } = await request.json();
    if (!name) {
      return NextResponse.json({ message: "Nama wajib diisi" }, { status: 400 });
    }
    // Update nama
    await sql`UPDATE "User" SET name = ${name} WHERE id = ${payload.id}`;
    // Update password jika diisi
    if (password && password.length >= 6) {
      // Hash password (contoh, gunakan bcrypt di implementasi nyata)
      await sql`UPDATE "User" SET password = ${password} WHERE id = ${payload.id}`;
    }
    return NextResponse.json({ message: "Profil berhasil diupdate" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Gagal update profil" }, { status: 400 });
  }
}
