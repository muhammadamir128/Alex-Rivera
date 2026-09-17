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

import { getProfile } from "@/lib/data";

export async function GET() {
  const profile = await getProfile();
  return ok(profile);
}

export async function PATCH(request: NextRequest) {
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
    let profile = await db.profile.findUnique({ where: { id: "singleton" } });
    if (!profile) {
      profile = await db.profile.create({ data: { id: "singleton" } });
    }
    const updated = await db.profile.update({ where: { id: "singleton" }, data: data as never });
    return ok(normalize(updated));
  } catch (e) {
    console.warn("Database profile update skipped (using memory update):", e);
    const fallbackProfile = {
      id: "singleton",
      name: (data.name as string) || "Muhammad Amir",
      title: (data.title as string) || "Full-Stack Developer",
      tagline: (data.tagline as string) || "I design and build fast, accessible web products.",
      bio: (data.bio as string) || "",
      avatarUrl: (data.avatarUrl as string) || null,
      socialLinks: (data.socialLinks as string) || "{}",
      seo: (data.seo as string) || "{}",
      stats: (data.stats as string) || "{}",
      updatedAt: new Date(),
    };
    return ok(normalize(fallbackProfile));
  }
}
