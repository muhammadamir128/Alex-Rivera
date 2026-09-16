import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, notFound, serverError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await db.education.findUnique({ where: { id } });
  if (!existing) return notFound("Education record not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const data: Record<string, unknown> = {};
  if (body.degree !== undefined) data.degree = String(body.degree).trim();
  if (body.institution !== undefined) data.institution = String(body.institution).trim();
  if (body.field !== undefined) data.field = body.field ? String(body.field).trim() : null;
  if (body.location !== undefined) data.location = body.location ? String(body.location).trim() : null;
  if (body.startDate !== undefined) data.startDate = String(body.startDate).trim();
  if (body.endDate !== undefined) data.endDate = body.endDate ? String(body.endDate).trim() : null;
  if (body.current !== undefined) data.current = Boolean(body.current);
  if (body.grade !== undefined) data.grade = body.grade ? String(body.grade).trim() : null;
  if (body.description !== undefined) data.description = String(body.description).trim();
  if (body.order !== undefined) data.order = Number(body.order);

  try {
    const updated = await db.education.update({ where: { id }, data: data as never });
    return ok(updated);
  } catch (e) {
    console.error(e);
    return serverError("Failed to update education record");
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await db.education.delete({ where: { id } });
    return ok({ ok: true });
  } catch {
    return notFound("Education record not found");
  }
}
