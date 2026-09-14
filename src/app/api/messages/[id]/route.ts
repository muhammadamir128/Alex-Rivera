import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, notFound, serverError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await db.message.findUnique({ where: { id } });
  if (!existing) return notFound("Message not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const data: Record<string, unknown> = {};
  if (body.isRead !== undefined) data.isRead = Boolean(body.isRead);

  try {
    const msg = await db.message.update({ where: { id }, data: data as never });
    return ok(msg);
  } catch (e) {
    console.error(e);
    return serverError("Failed to update message");
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await db.message.delete({ where: { id } });
    return ok({ ok: true });
  } catch {
    return notFound("Message not found");
  }
}
