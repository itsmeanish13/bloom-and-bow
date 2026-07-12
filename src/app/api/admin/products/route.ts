import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (category && category !== "all") {
      where.category = category;
    }
    if (status && status !== "all") {
      where.stockStatus = status;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await db.product.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        categoryRef: { select: { id: true, name: true, slug: true } },
      },
    });

    const formatted = products.map((p) => ({
      ...p,
      price: Number(p.price),
      occasions: JSON.parse(p.occasions),
      badges: JSON.parse(p.badges),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Admin products fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { title, description, category, categoryId, occasions, price, imageUrl, stockStatus, badges, sortOrder } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Product title is required" }, { status: 400 });
    }
    if (price === undefined || price <= 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Product with similar name already exists" }, { status: 409 });
    }

    const product = await db.product.create({
      data: {
        slug,
        title: title.trim(),
        description: description?.trim() || "",
        category: category || "flowers",
        categoryId: categoryId || null,
        occasions: JSON.stringify(occasions || []),
        price: Math.round(price),
        imageUrl: imageUrl?.trim() || null,
        stockStatus: stockStatus || "in_stock",
        badges: JSON.stringify(badges || []),
        sortOrder: sortOrder ?? 0,
      },
      include: {
        categoryRef: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({
      ...product,
      price: Number(product.price),
      occasions: JSON.parse(product.occasions),
      badges: JSON.parse(product.badges),
    }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}