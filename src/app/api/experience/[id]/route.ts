import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, notFound, serverError, stringifyJson } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await db.experience.findUnique({ where: { id } });
  if (!existing) return notFound("Experience not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const data: Record<string, unknown> = {};
  if (body.role !== undefined) data.role = String(body.role);
  if (body.company !== undefined) data.company = String(body.company);
  if (body.location !== undefined) data.location = body.location ? String(body.location) : null;
  if (body.startDate !== undefined) data.startDate = String(body.startDate);
  if (body.endDate !== undefined) data.endDate = body.endDate ? String(body.endDate) : null;
  if (body.current !== undefined) data.current = Boolean(body.current);
  if (body.description !== undefined) data.description = String(body.description);
  if (body.techUsed !== undefined)
    data.techUsed = stringifyJson(Array.isArray(body.techUsed) ? (body.techUsed as string[]) : []);
  if (body.order !== undefined) data.order = Number(body.order);

  try {
    const exp = await db.experience.update({ where: { id }, data: data as never });
    return ok({ ...exp, techUsed: JSON.parse(exp.techUsed || "[]") });
  } catch (e) {
    console.error(e);
    return serverError("Failed to update experience");
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await db.experience.delete({ where: { id } });
    return ok({ ok: true });
  } catch {
    return notFound("Experience not found");
  }
}
