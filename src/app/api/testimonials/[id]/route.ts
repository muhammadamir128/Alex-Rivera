import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, notFound, serverError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await db.testimonial.findUnique({ where: { id } });
  if (!existing) return notFound("Testimonial not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = String(body.name);
  if (body.role !== undefined) data.role = String(body.role);
  if (body.company !== undefined) data.company = String(body.company);
  if (body.message !== undefined) data.message = String(body.message);
  if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl ? String(body.avatarUrl) : null;
  if (body.rating !== undefined) data.rating = Math.min(5, Math.max(1, Number(body.rating)));
  if (body.approved !== undefined) data.approved = Boolean(body.approved);
  if (body.order !== undefined) data.order = Number(body.order);

  try {
    const t = await db.testimonial.update({ where: { id }, data: data as never });
    return ok(t);
  } catch (e) {
    console.error(e);
    return serverError("Failed to update testimonial");
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await db.testimonial.delete({ where: { id } });
    return ok({ ok: true });
  } catch {
    return notFound("Testimonial not found");
  }
}
