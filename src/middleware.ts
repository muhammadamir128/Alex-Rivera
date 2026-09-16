import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken, COOKIE_ACCESS } from "@/lib/auth";

// Public GET endpoints for the portfolio site (reads)
const PUBLIC_GET_PREFIXES = [
  "/api/profile",
  "/api/projects",
  "/api/skills",
  "/api/experience",
  "/api/education",
  "/api/testimonials",
];

function isPublicGet(pathname: string): boolean {
  return PUBLIC_GET_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // 1) Protect /admin pages (except the login page itself) -> redirect to login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const access = request.cookies.get(COOKIE_ACCESS)?.value;
    const valid = access ? await verifyAccessToken(access) : null;
    if (!valid) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2) Protect API mutation routes
  if (pathname.startsWith("/api/")) {
    let needsAuth = false;

    if (pathname === "/api/auth/login" || pathname === "/api/auth/refresh") {
      needsAuth = false;
    } else if (pathname === "/api/messages" && method === "POST") {
      // public contact form submit
      needsAuth = false;
    } else if (pathname === "/api/analytics/track" && method === "POST") {
      // public page-view tracking
      needsAuth = false;
    } else if (method === "GET" && isPublicGet(pathname)) {
      // public portfolio reads
      needsAuth = false;
    } else if (method === "OPTIONS") {
      needsAuth = false;
    } else {
      // everything else (mutations, admin reads like /api/messages GET, /api/upload, /api/auth/me)
      needsAuth = true;
    }

    if (needsAuth) {
      const access = request.cookies.get(COOKIE_ACCESS)?.value;
      const valid = access ? await verifyAccessToken(access) : null;
      if (!valid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
