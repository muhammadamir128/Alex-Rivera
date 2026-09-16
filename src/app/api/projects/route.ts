import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/api";
import { parseJsonArray, stringifyJson } from "@/lib/api";
import { slugify, uniqueSlug } from "@/lib/upload";
import { getAdminWithRefresh } from "@/lib/session";

import { getProjectBySlug } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const tag = searchParams.get("tag");
  const slug = searchParams.get("slug");
  const all = searchParams.get("all") === "true";

  if (slug) {
    const project = await getProjectBySlug(slug);
    return ok(project);
  }

  try {
    const isAdmin = all ? Boolean(await getAdminWithRefresh()) : false;
    const includeUnpublished = all && isAdmin;

    const where: { isFeatured?: boolean; isPublished?: boolean; techTags?: { contains: string } } = includeUnpublished
      ? {}
      : { isPublished: true };
    if (featured === "true") where.isFeatured = true;
    if (tag) where.techTags = { contains: tag };

    const projects = await db.project.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return ok(
      projects.map((p) => ({
        ...p,
        techTags: parseJsonArray(p.techTags),
        images: parseJsonArray(p.images),
      }))
    );
  } catch (e) {
    console.error("API GET /api/projects DB query failed:", (e as Error).message);
    return ok([]);
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const title = String(body.title || "").trim();
  if (!title) return badRequest("Title is required");

  const allSlugs = (await db.project.findMany({ select: { slug: true } })).map((p) => p.slug);
  const slug = uniqueSlug(slugify(body.slug ? String(body.slug) : title), allSlugs);

  try {
    const project = await db.project.create({
      data: {
        title,
        slug,
        description: String(body.description || ""),
        caseStudy: String(body.caseStudy || ""),
        coverImage: body.coverImage ? String(body.coverImage) : null,
        images: stringifyJson(
          Array.isArray(body.images) ? (body.images as string[]) : []
        ),
        techTags: stringifyJson(
          Array.isArray(body.techTags) ? (body.techTags as string[]) : []
        ),
        liveUrl: body.liveUrl ? String(body.liveUrl) : null,
        repoUrl: body.repoUrl ? String(body.repoUrl) : null,
        isFeatured: Boolean(body.isFeatured),
        isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished),
        order: Number(body.order || 0),
      },
    });
    return ok({
      ...project,
      techTags: parseJsonArray(project.techTags),
      images: parseJsonArray(project.images),
    });
  } catch (e) {
    console.error(e);
    return serverError("Failed to create project");
  }
}
