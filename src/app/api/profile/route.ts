import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, serverError, parseJsonObject, stringifyJson } from "@/lib/api";

function normalize(profile: {
  id: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatarUrl: string | null;
  socialLinks: string;
  seo: string;
  stats: string;
  updatedAt: Date;
}) {
  return {
    ...profile,
    socialLinks: parseJsonObject(profile.socialLinks, {}),
    seo: parseJsonObject(profile.seo, {}),
    stats: parseJsonObject(profile.stats, {}),
  };
}

export async function GET() {
  let profile = await db.profile.findUnique({ where: { id: "singleton" } });
  if (!profile) {
    profile = await db.profile.create({ data: { id: "singleton" } });
  }
  return ok(normalize(profile));
}

export async function PATCH(request: NextRequest) {
  let profile = await db.profile.findUnique({ where: { id: "singleton" } });
  if (!profile) {
    profile = await db.profile.create({ data: { id: "singleton" } });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = String(body.name);
  if (body.title !== undefined) data.title = String(body.title);
  if (body.tagline !== undefined) data.tagline = String(body.tagline);
  if (body.bio !== undefined) data.bio = String(body.bio);
  if (body.avatarUrl !== undefined)
    data.avatarUrl = body.avatarUrl ? String(body.avatarUrl) : null;
  if (body.socialLinks !== undefined && typeof body.socialLinks === "object")
    data.socialLinks = stringifyJson(body.socialLinks);
  if (body.seo !== undefined && typeof body.seo === "object") data.seo = stringifyJson(body.seo);
  if (body.stats !== undefined && typeof body.stats === "object")
    data.stats = stringifyJson(body.stats);

  try {
    const updated = await db.profile.update({ where: { id: "singleton" }, data: data as never });
    return ok(normalize(updated));
  } catch (e) {
    console.error(e);
    return serverError("Failed to update profile");
  }
}
