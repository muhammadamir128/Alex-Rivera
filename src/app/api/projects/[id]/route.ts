import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, notFound, serverError } from "@/lib/api";
import { parseJsonArray, stringifyJson } from "@/lib/api";
import { DEFAULT_PROJECTS } from "@/lib/data";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const project = await db.project.findUnique({ where: { id } });
    if (project) {
      return ok({
        ...project,
        techTags: parseJsonArray(project.techTags),
        images: parseJsonArray(project.images),
      });
    }
  } catch (err) {
    console.warn("db.project.findUnique failed on Vercel:", err);
  }

  const fallback = DEFAULT_PROJECTS.find((p) => p.id === id || p.slug === id);
  if (!fallback) return notFound("Project not found");
  return ok(fallback);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  let existing: any = null;
  try {
    existing = await db.project.findUnique({ where: { id } });
  } catch {}
  if (!existing) {
    const fallback = DEFAULT_PROJECTS.find((p) => p.id === id || p.slug === id);
    if (!fallback) return notFound("Project not found");
    existing = fallback;
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = String(body.title);
  if (body.slug !== undefined) data.slug = String(body.slug);
  if (body.description !== undefined) data.description = String(body.description);
  if (body.caseStudy !== undefined) data.caseStudy = String(body.caseStudy);
  if (body.coverImage !== undefined)
    data.coverImage = body.coverImage ? String(body.coverImage) : null;
  if (body.images !== undefined)
    data.images = stringifyJson(Array.isArray(body.images) ? (body.images as string[]) : []);
  if (body.techTags !== undefined)
    data.techTags = stringifyJson(Array.isArray(body.techTags) ? (body.techTags as string[]) : []);
  if (body.liveUrl !== undefined) data.liveUrl = body.liveUrl ? String(body.liveUrl) : null;
  if (body.repoUrl !== undefined) data.repoUrl = body.repoUrl ? String(body.repoUrl) : null;
  if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
  if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);
  if (body.order !== undefined) data.order = Number(body.order);

  try {
    const project = await db.project.update({ where: { id }, data: data as never });
    return ok({
      ...project,
      techTags: parseJsonArray(project.techTags),
      images: parseJsonArray(project.images),
    });
  } catch (e) {
    console.error(e);
    return serverError("Failed to update project");
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await db.project.delete({ where: { id } });
    return ok({ ok: true });
  } catch {
    return notFound("Project not found");
  }
}
