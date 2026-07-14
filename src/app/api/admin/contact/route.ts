import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Contact messages fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
