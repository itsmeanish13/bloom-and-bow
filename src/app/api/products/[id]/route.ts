import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const formatted = {
    ...product,
    occasions: JSON.parse(product.occasions),
    badges: JSON.parse(product.badges),
    price: Number(product.price),
  };

  // Also fetch 4 related products (same category, different id)
  const related = await db.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    orderBy: { sortOrder: "asc" },
    take: 4,
  });

  const formattedRelated = related.map((p) => ({
    ...p,
    occasions: JSON.parse(p.occasions),
    badges: JSON.parse(p.badges),
    price: Number(p.price),
  }));

  return NextResponse.json({ product: formatted, related: formattedRelated });
}