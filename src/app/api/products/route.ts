import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const occasion = searchParams.get("occasion");
  const category = searchParams.get("category");

  const where: Record<string, unknown> = {};

  if (occasion && occasion !== "all") {
    where.occasions = { contains: occasion };
  }
  if (category && category !== "all") {
    where.category = category;
  }

  const products = await db.product.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  });

  const formatted = products.map((p) => ({
    ...p,
    occasions: JSON.parse(p.occasions),
    badges: JSON.parse(p.badges),
    price: Number(p.price),
  }));

  return NextResponse.json(formatted);
}