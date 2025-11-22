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
    let query = sql`SELECT t.*, s.bank || ' - ' || s.accountNumber AS savings_name FROM "Transaction" t LEFT JOIN "Savings" s ON t.savingsid = s.id WHERE t."userId" = ${userId} ORDER BY t.date DESC LIMIT ${limit}`;
    if (type) query = sql`SELECT t.*, s.bank || ' - ' || s.accountNumber AS savings_name FROM "Transaction" t LEFT JOIN "Savings" s ON t.savingsid = s.id WHERE t."userId" = ${userId} AND t.type = ${type} ORDER BY t.date DESC LIMIT ${limit}`;
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
    const { title, amount, date, category, description, type, savingsid } = await request.json();
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO "Transaction" (id, "userId", title, amount, date, "categoryid", description, type, savingsid)
      VALUES (${id}, ${userId}, ${title}, ${amount}, ${date}, ${category}, ${description}, ${type}, ${savingsid})
    `;
    return NextResponse.json({ message: "Transaksi berhasil ditambahkan", id }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Gagal menambah transaksi" }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id;
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "ID transaksi wajib" }, { status: 400 });
    }
    const { title, amount, date, category, description, type, savingsid } = await request.json();
    await sql`
      UPDATE "Transaction"
      SET title = ${title}, amount = ${amount}, date = ${date}, "categoryid" = ${category}, description = ${description}, type = ${type}, savingsid = ${savingsid}
      WHERE id = ${id} AND "userId" = ${userId}
    `;
    return NextResponse.json({ message: "Transaksi berhasil diupdate" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Gagal update transaksi" }, { status: 400 });
  }
}
