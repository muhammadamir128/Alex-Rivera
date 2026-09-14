import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_REFRESH,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, unauthorized } from "@/lib/api";

export async function POST() {
  const cookieStore = await cookies();
  const refresh = cookieStore.get(COOKIE_REFRESH)?.value;
  if (!refresh) return unauthorized("No refresh token");

  const payload = await verifyRefreshToken(refresh);
  if (!payload) return unauthorized("Invalid refresh token");

  const admin = await db.admin.findUnique({ where: { id: payload.sub } });
  if (!admin) return unauthorized("Admin not found");

  const access = signAccessToken({ sub: admin.id, email: admin.email });
  const newRefresh = signRefreshToken({ sub: admin.id, email: admin.email });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("portfolio_admin_access", access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2,
  });
  res.cookies.set(COOKIE_REFRESH, newRefresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function GET() {
  return ok({ status: "ok" });
}
