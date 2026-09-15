import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { setSessionCookies } from "@/lib/session";
import { ok, badRequest, unauthorized, serverError, getClientIp } from "@/lib/api";
import { loginRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = loginRateLimit(ip);
  if (!limit.ok) {
    return badRequest("Too many login attempts. Please try again later.");
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || !password) {
    return badRequest("Email and password are required");
  }

  const admin = await db.admin.findUnique({ where: { email } });
  if (!admin) {
    return unauthorized("Invalid email or password");
  }
  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return unauthorized("Invalid email or password");
  }

  // Set session cookies immediately
  const cookiePromise = setSessionCookies(admin.id, admin.email);

  // Update lastLoginAt non-blocking to prevent unnecessary wait
  db.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  }).catch((err) => console.warn("Failed to update lastLoginAt:", err));

  await cookiePromise;
  return ok({
    admin: { id: admin.id, email: admin.email, name: admin.name },
  });
}
