import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./admin-auth";

export function requireAdmin(request: NextRequest): NextResponse | null {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}