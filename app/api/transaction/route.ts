import { NextRequest, NextResponse } from "next/server";
import sql from "@/utils/db";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id;
    const type = request.nextUrl.searchParams.get("type");
    const limit = Number(request.nextUrl.searchParams.get("limit")) || 10;
    let query = sql`SELECT * FROM "Transaction" WHERE "userId" = ${userId} ORDER BY date DESC LIMIT ${limit}`;
    if (type) query = sql`SELECT * FROM "Transaction" WHERE "userId" = ${userId} AND type = ${type} ORDER BY date DESC LIMIT ${limit}`;
    const transactions = await query;
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (err) {
    console.log(err);
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
    const { title, amount, date, category, description, type } = await request.json();
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO "Transaction" (id, "userId", title, amount, date, "categoryid", description, type)
      VALUES (${id}, ${userId}, ${title}, ${amount}, ${date}, ${category}, ${description}, ${type})
    `;
    return NextResponse.json({ message: "Transaksi berhasil ditambahkan", id }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Gagal menambah transaksi" }, { status: 400 });
  }
}
