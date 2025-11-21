import sql from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  // Validasi input
  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Name, email, and password are required" },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { message: "Invalid email format" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  // Cek apakah user sudah ada
  const existing = await sql`SELECT id FROM "User" WHERE email = ${email}`;
  if (existing.length > 0) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  // Insert user baru dengan id UUID
  const result = await sql`
    INSERT INTO "User" (id, name, email, password)
    VALUES (${id}, ${name}, ${email}, ${hashedPassword})
    RETURNING id, email
  `;
  const newUser = result[0];

  return NextResponse.json(
    {
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email },
    },
    { status: 201 }
  );
}