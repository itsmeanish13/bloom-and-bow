import crypto from "crypto";

const SALT = "bloom-and-bow-admin";

export function verifyAdmin(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}

export function getAdminToken(): string {
  const secret = (process.env.ADMIN_PASSWORD || "") + SALT;
  return crypto.createHash("sha256").update(secret).digest("hex");
}

export function verifyToken(token: string): boolean {
  return token === getAdminToken();
}