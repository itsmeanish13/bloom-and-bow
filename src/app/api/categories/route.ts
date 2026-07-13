import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Public categories fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}