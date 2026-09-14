import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me-in-production-please";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-me";

export const ACCESS_TOKEN_EXPIRY = "2h";
export const REFRESH_TOKEN_EXPIRY = "7d";

export interface AdminTokenPayload {
  sub: string;
  email: string;
  type: "access" | "refresh";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: Omit<AdminTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "access" }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function signRefreshToken(payload: Omit<AdminTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "refresh" }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

/**
 * Verify an access token. Uses the edge-compatible `jose` library so the same
 * function works in Next.js middleware (Edge runtime) and Node route handlers.
 * Falls back to `jsonwebtoken` if `jose` chokes (shouldn't happen).
 */
export async function verifyAccessToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    if (payload.type !== "access") return null;
    return payload as unknown as AdminTokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_REFRESH_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    if (payload.type !== "refresh") return null;
    return payload as unknown as AdminTokenPayload;
  } catch {
    return null;
  }
}

export const COOKIE_ACCESS = "portfolio_admin_access";
export const COOKIE_REFRESH = "portfolio_admin_refresh";
