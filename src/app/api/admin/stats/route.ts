import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      allOrders,
      todayOrderData,
      recentOrders,
    ] = await Promise.all([
      db.order.count(),
      db.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      db.order.count({
        where: {
          status: { in: ["placed", "preparing", "out_for_delivery"] },
        },
      }),
      db.order.aggregate({ _sum: { totalAmount: true } }),
      db.order.aggregate({
        where: { createdAt: { gte: today, lt: tomorrow } },
        _sum: { totalAmount: true },
      }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          recipientName: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalOrders,
      todayOrders,
      pendingOrders,
      totalRevenue: allOrders._sum.totalAmount || 0,
      todayRevenue: todayOrderData._sum.totalAmount || 0,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
      })),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}