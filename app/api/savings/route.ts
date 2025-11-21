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
    const savings = await sql`SELECT id, bank, accountNumber, amount FROM "Savings" WHERE userId = ${userId}`;
    return NextResponse.json({ savings }, { status: 200 });
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
    const { bank, accountNumber, amount } = await request.json();
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO "Savings" (id, userId, bank, accountNumber, amount, createdAt, updatedAt)
      VALUES (${id}, ${userId}, ${bank}, ${accountNumber}, ${amount}, NOW(), NOW())
    `;
    return NextResponse.json({ message: "Tabungan berhasil ditambahkan", id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Gagal menambah tabungan" }, { status: 400 });
  }
}
