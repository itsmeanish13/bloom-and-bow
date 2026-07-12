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

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const {
      title, description, category, categoryId,
      occasions, price, imageUrl, stockStatus, badges, sortOrder
    } = body;

    let slug = existing.slug;
    if (title?.trim() && title.trim() !== existing.title) {
      slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const slugExists = await db.product.findFirst({ where: { slug, NOT: { id } } });
      if (slugExists) {
        return NextResponse.json({ error: "Product with similar name already exists" }, { status: 409 });
      }
    }

    const product = await db.product.update({
      where: { id },
      data: {
        ...(title?.trim() ? { title: title.trim() } : {}),
        slug,
        ...(description !== undefined ? { description: description?.trim() || "" } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(categoryId !== undefined ? { categoryId: categoryId || null } : {}),
        ...(occasions !== undefined ? { occasions: JSON.stringify(occasions) } : {}),
        ...(price !== undefined ? { price: Math.round(price) } : {}),
        ...(imageUrl !== undefined ? { imageUrl: imageUrl?.trim() || null } : {}),
        ...(stockStatus !== undefined ? { stockStatus } : {}),
        ...(badges !== undefined ? { badges: JSON.stringify(badges) } : {}),
        ...(sortOrder !== undefined ? { sortOrder } : {}),
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
    });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
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
    const existing = await db.product.findUnique({
      where: { id },
      include: { _count: { select: { orderItems: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (existing._count.orderItems > 0) {
      return NextResponse.json(
        { error: `Cannot delete product with ${existing._count.orderItems} order(s). Consider marking it as sold out instead.` },
        { status: 400 }
      );
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}