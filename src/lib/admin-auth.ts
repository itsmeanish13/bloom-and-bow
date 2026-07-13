import crypto from "crypto";

const SALT = "bloom-and-bow-admin";

// Fallback password in case env variable is not loaded
const ADMIN_PWD = process.env.ADMIN_PASSWORD || "bloom2024";

export function verifyAdmin(password: string): boolean {
  return password === ADMIN_PWD;
}

export function getAdminToken(): string {
  const secret = ADMIN_PWD + SALT;
  return crypto.createHash("sha256").update(secret).digest("hex");
}

export function verifyToken(token: string): boolean {
  return token === getAdminToken();
}