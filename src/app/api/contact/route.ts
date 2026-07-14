import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (
      !name ||
      typeof name !== "string" ||
      !email ||
      typeof email !== "string" ||
      !email.includes("@") ||
      !message ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { error: "Name, a valid email, and a message are required" },
        { status: 400 }
      );
    }

    await db.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        message: message.trim(),
      },
    });

    return NextResponse.json({ success: true, message: "Message sent!" });
  } catch (error) {
    console.error("Contact message error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
