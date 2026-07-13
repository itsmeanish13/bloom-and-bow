import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const occasion = searchParams.get("occasion");
  const category = searchParams.get("category");
  const categoryId = searchParams.get("categoryId");

  const where: Record<string, unknown> = {};

  if (occasion && occasion !== "all") {
    where.occasions = { contains: occasion };
  }

  // Support both legacy string-based category and new categoryId-based filtering
  if (categoryId) {
    where.categoryId = categoryId;
  } else if (category && category !== "all") {
    // Match by category string OR by categoryRef slug for flexibility
    where.OR = [
      { category: category },
      { categoryRef: { slug: category } },
    ];
  }

  const products = await db.product.findMany({
    where,
    orderBy: { sortOrder: "asc" },
    include: {
      categoryRef: { select: { id: true, name: true, slug: true } },
    },
  });

  const formatted = products.map((p) => ({
    ...p,
    occasions: JSON.parse(p.occasions),
    badges: JSON.parse(p.badges),
    price: Number(p.price),
  }));

  return NextResponse.json(formatted);
}