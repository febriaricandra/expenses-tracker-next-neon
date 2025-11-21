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
    // Ambil pengeluaran per kategori 1 bulan terakhir
    const result = await sql`
      SELECT c.name as category, SUM(t.amount) as total
      FROM "Transaction" t
      JOIN "Category" c ON t."categoryid" = c.id
      WHERE t."userId" = ${userId}
        AND t.type = 'expense'
        AND t.date >= NOW() - INTERVAL '1 month'
      GROUP BY c.name
      ORDER BY total DESC
    `;
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
