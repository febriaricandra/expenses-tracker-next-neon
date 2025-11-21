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
    // Ambil data penganggaran user
    const budgets = await sql`
      SELECT b.id, b.limit, b.period, b.startDate, b.endDate, c.name as category, c.icon, c.color
      FROM "Budget" b
      JOIN "Category" c ON b.categoryId = c.id
      WHERE b.userId = ${userId}
    `;
    return NextResponse.json({ budgets }, { status: 200 });
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
    const body = await request.json();
    const { categoryId, limit, period, startDate, endDate } = body;
    if (!categoryId || !limit || !period || !startDate || !endDate) {
      return NextResponse.json({ message: "Kategori, nominal, periode, dan tanggal wajib diisi" }, { status: 400 });
    }
    // Insert budget
    const id = crypto.randomUUID();
    const result = await sql`
      INSERT INTO "Budget" (id, "limit", categoryId, userId, period, startDate, endDate)
      VALUES (${id}, ${limit}, ${categoryId}, ${userId}, ${period}, ${startDate}, ${endDate})
      RETURNING id
    `;
    return NextResponse.json({ id: result[0].id }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Gagal tambah anggaran" }, { status: 400 });
  }
}
