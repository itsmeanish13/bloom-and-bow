import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();
    const { isRead } = body;

    if (typeof isRead !== "boolean") {
      return NextResponse.json(
        { error: "isRead must be a boolean" },
        { status: 400 }
      );
    }

    const message = await db.contactMessage.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Contact message update error:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact message delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
