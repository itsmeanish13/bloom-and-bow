import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const categories = await db.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { name, description, sortOrder, isActive } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 409 });
    }

    const category = await db.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Category create error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}