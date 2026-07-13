import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./admin-auth";

export function requireAdmin(request: NextRequest): NextResponse | null {
  // Check cookie first, then fallback to X-Admin-Token header
  const cookieToken = request.cookies.get("admin_token")?.value;
  const headerToken = request.headers.get("x-admin-token");

  const token = cookieToken || headerToken;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}