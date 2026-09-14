import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, serverError, stringifyJson } from "@/lib/api";

export async function GET() {
  const items = await db.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
  return ok(
    items.map((e) => ({ ...e, techUsed: JSON.parse(e.techUsed || "[]") }))
  );
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const role = String(body.role || "").trim();
  const company = String(body.company || "").trim();
  if (!role || !company) return badRequest("Role and company are required");
  try {
    const exp = await db.experience.create({
      data: {
        role,
        company,
        location: body.location ? String(body.location) : null,
        startDate: String(body.startDate || ""),
        endDate: body.endDate ? String(body.endDate) : null,
        current: Boolean(body.current),
        description: String(body.description || ""),
        techUsed: stringifyJson(
          Array.isArray(body.techUsed) ? (body.techUsed as string[]) : []
        ),
        order: Number(body.order || 0),
      },
    });
    return ok({ ...exp, techUsed: JSON.parse(exp.techUsed || "[]") });
  } catch (e) {
    console.error(e);
    return serverError("Failed to create experience entry");
  }
}
