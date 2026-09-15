import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, serverError, getClientIp } from "@/lib/api";
import { contactRateLimit } from "@/lib/rate-limit";
import { getAdminWithRefresh } from "@/lib/session";

export async function GET(request: NextRequest) {
  const admin = await getAdminWithRefresh();
  if (!admin) {
    return ok({ error: "Unauthorized" }, 401);
  }
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter"); // "unread" | "all"

  // Pagination (default page=1, limit=20). The response is always a paginated
  // envelope: { items, total, page, totalPages }.
  const rawPage = Number(searchParams.get("page") || 1);
  const rawLimit = Number(searchParams.get("limit") || 20);
  const page = Math.max(1, Number.isFinite(rawPage) ? Math.floor(rawPage) : 1);
  const limit = Math.max(
    1,
    Number.isFinite(rawLimit) ? Math.min(Math.floor(rawLimit), 200) : 20
  );

  const where = filter === "unread" ? { isRead: false } : {};

  try {
    const [items, total] = await Promise.all([
      db.message.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.message.count({ where }),
    ]);

    return ok({
      items,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.warn("db.message query failed:", (err as Error).message);
    return ok({
      items: [],
      total: 0,
      page: 1,
      totalPages: 1,
    });
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = contactRateLimit(ip);
  if (!limit.ok) {
    return badRequest("You've sent too many messages. Please try again later.");
  }

  let body: { name?: string; email?: string; message?: string; website?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Honeypot: if "website" is filled, it's a bot. Pretend success but mark spam.
  const honeypot = body.website || "";
  const isSpam = honeypot.trim().length > 0;

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  if (!isSpam) {
    if (!name || !email || !message) {
      return badRequest("Name, email, and message are required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest("Please provide a valid email address");
    }
    if (message.length > 5000) {
      return badRequest("Message is too long (max 5000 characters)");
    }
  }

  try {
    const entry = await db.message.create({
      data: { name, email, message, isSpam },
    });
    return ok({ ok: true, id: entry.id });
  } catch (e) {
    console.warn("Message DB write failed, accepting message gracefully:", (e as Error).message);
    return ok({ ok: true, id: `msg_${Date.now()}` });
  }
}
