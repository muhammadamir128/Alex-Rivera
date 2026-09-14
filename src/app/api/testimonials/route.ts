import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const approvedOnly = searchParams.get("approved") !== "false";
  const where = approvedOnly ? { approved: true } : {};
  const items = await db.testimonial.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return ok(items);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const name = String(body.name || "").trim();
  const role = String(body.role || "").trim();
  const company = String(body.company || "").trim();
  const message = String(body.message || "").trim();
  if (!name || !role || !company || !message) {
    return badRequest("Name, role, company, and message are required");
  }
  try {
    const t = await db.testimonial.create({
      data: {
        name,
        role,
        company,
        message,
        avatarUrl: body.avatarUrl ? String(body.avatarUrl) : null,
        rating: Math.min(5, Math.max(1, Number(body.rating || 5))),
        approved: Boolean(body.approved ?? true),
        order: Number(body.order || 0),
      },
    });
    return ok(t);
  } catch (e) {
    console.error(e);
    return serverError("Failed to create testimonial");
  }
}
