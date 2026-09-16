import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/api";

import { getSkills } from "@/lib/data";

export async function GET() {
  const skills = await getSkills();
  return ok(skills);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const name = String(body.name || "").trim();
  if (!name) return badRequest("Name is required");
  try {
    const skill = await db.skill.create({
      data: {
        name,
        category: String(body.category || "Frontend"),
        proficiency: Math.min(100, Math.max(0, Number(body.proficiency || 80))),
        order: Number(body.order || 0),
        icon: body.icon ? String(body.icon) : null,
      },
    });
    return ok(skill);
  } catch (e) {
    console.error(e);
    return serverError("Failed to create skill");
  }
}
