import { NextRequest, NextResponse } from "next/server";
import sql from "@/utils/db";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your_jwt_secret");

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id;
    const categories = await sql`SELECT id, name, icon, color FROM "Category" WHERE userId = ${userId}`;
    return NextResponse.json({ categories }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id;
    const { name, icon, color } = await request.json();
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO "Category" (id, userId, name, icon, color, createdAt)
      VALUES (${id}, ${userId}, ${name}, ${icon}, ${color}, NOW())
    `;
    return NextResponse.json({ message: "Kategori berhasil ditambahkan", id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Gagal menambah kategori" }, { status: 400 });
  }
}
