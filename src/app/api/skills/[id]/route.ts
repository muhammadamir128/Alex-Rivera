import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, notFound, serverError } from "@/lib/api";
import { stringifyJson } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await db.skill.findUnique({ where: { id } });
  if (!existing) return notFound("Skill not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = String(body.name);
  if (body.category !== undefined) data.category = String(body.category);
  if (body.proficiency !== undefined)
    data.proficiency = Math.min(100, Math.max(0, Number(body.proficiency)));
  if (body.order !== undefined) data.order = Number(body.order);
  if (body.icon !== undefined) data.icon = body.icon ? String(body.icon) : null;

  // silence unused import warning
  void stringifyJson;

  try {
    const skill = await db.skill.update({ where: { id }, data: data as never });
    return ok(skill);
  } catch (e) {
    console.error(e);
    return serverError("Failed to update skill");
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await db.skill.delete({ where: { id } });
    return ok({ ok: true });
  } catch {
    return notFound("Skill not found");
  }
}
