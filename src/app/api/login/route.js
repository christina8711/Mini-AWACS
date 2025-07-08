import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // 2. Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid password" }), { status: 401 });
    }

    // ✅ Login success → send success response
    return new Response(JSON.stringify({ message: "Login successful", userId: user.id }), { status: 200 });

  } catch (error) {
    console.error("[Login Error]:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
