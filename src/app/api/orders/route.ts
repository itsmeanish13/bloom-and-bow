import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `BB-${datePart}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      items,
      recipientName,
      recipientPhone,
      address,
      city = "Kathmandu",
      landmark,
      giftNote,
      deliverySlot = "same_day",
      paymentMethod = "cod",
      totalAmount,
    } = body;

    // Validate required fields
    if (!recipientName || !recipientPhone || !address || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 }
      );
    }

    // Generate unique order number
    let orderNumber = generateOrderNumber();
    let exists = await db.order.findUnique({ where: { orderNumber } });
    while (exists) {
      orderNumber = generateOrderNumber();
      exists = await db.order.findUnique({ where: { orderNumber } });
    }

    // Create the order with items in a transaction
    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          recipientName,
          recipientPhone,
          address,
          city,
          landmark: landmark || null,
          giftNote: giftNote || null,
          deliverySlot,
          paymentMethod,
          paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
          totalAmount,
          status: "placed",
          items: {
            create: items.map((item: { productId: string; title: string; price: number; qty: number }) => ({
              productId: item.productId,
              title: item.title,
              price: item.price,
              qty: item.qty,
            })),
          },
        },
        include: { items: true },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        orderNumber: order.orderNumber,
        id: order.id,
        status: order.status,
        totalAmount: Number(order.totalAmount),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}