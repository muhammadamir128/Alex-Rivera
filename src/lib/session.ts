import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  COOKIE_ACCESS,
  COOKIE_REFRESH,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";

export async function getSession() {
  const cookieStore = await cookies();
  const access = cookieStore.get(COOKIE_ACCESS)?.value;
  if (!access) return null;
  const payload = await verifyAccessToken(access);
  if (!payload) return null;
  return payload;
}

export async function getAdmin() {
  const session = await getSession();
  if (!session) return null;
  const admin = await db.admin.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, name: true, lastLoginAt: true },
  });
  return admin;
}

/** Require an authenticated admin. Returns the admin or throws a 401-ish response marker. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) {
    throw new UnauthorizedError();
  }
  return admin as { id: string; email: string; name: string | null; lastLoginAt: Date | null };
}

export class UnauthorizedError extends Error {
  status = 401;
  constructor() {
    super("Unauthorized");
  }
}

/** Issue new access + refresh tokens and set them as httpOnly cookies. */
export async function setSessionCookies(adminId: string, email: string) {
  const cookieStore = await cookies();
  const access = signAccessToken({ sub: adminId, email });
  const refresh = signRefreshToken({ sub: adminId, email });
  cookieStore.set(COOKIE_ACCESS, access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2, // 2h
  });
  cookieStore.set(COOKIE_REFRESH, refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 60 * 60 * 24 * 7, // 7d
  });
  return { access, refresh };
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_ACCESS);
  cookieStore.delete(COOKIE_REFRESH);
}

/** Attempt to rotate via refresh token cookie. Returns true if a new access token was set. */
export async function tryRefreshFromCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  const refresh = cookieStore.get(COOKIE_REFRESH)?.value;
  if (!refresh) return false;
  const payload = await verifyRefreshToken(refresh);
  if (!payload) return false;
  const admin = await db.admin.findUnique({ where: { id: payload.sub } });
  if (!admin) return false;
  await setSessionCookies(admin.id, admin.email);
  return true;
}

/** Get admin, but try refresh first if access token is missing/expired. */
export async function getAdminWithRefresh() {
  let admin = await getAdmin();
  if (!admin) {
    const refreshed = await tryRefreshFromCookie();
    if (refreshed) {
      admin = await getAdmin();
    }
  }
  return admin;
}
