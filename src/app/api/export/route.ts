import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { parseJsonArray, parseJsonObject } from "@/lib/api";
import { requireAdmin } from "@/lib/session";

/**
 * Admin-only JSON export. Streams a full portfolio snapshot as a
 * `Content-Disposition: attachment` JSON file download.
 */
export async function GET(_request: NextRequest) {
  await requireAdmin();

  const [projects, skills, experience, testimonials, messages, profile, admin] =
    await Promise.all([
      db.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
      db.skill.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
      db.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] }),
      db.testimonial.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      db.message.findMany({ orderBy: { createdAt: "desc" } }),
      db.profile.findUnique({ where: { id: "singleton" } }),
      db.admin.findFirst({ select: { id: true, email: true, name: true } }),
    ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    admin: admin ? { email: admin.email, name: admin.name } : null,
    profile: profile
      ? {
          ...profile,
          socialLinks: parseJsonObject(profile.socialLinks, {}),
          seo: parseJsonObject(profile.seo, {}),
          stats: parseJsonObject(profile.stats, {}),
        }
      : null,
    projects: projects.map((p) => ({
      ...p,
      techTags: parseJsonArray(p.techTags),
      images: parseJsonArray(p.images),
    })),
    skills,
    experience: experience.map((e) => ({
      ...e,
      techUsed: parseJsonArray(e.techUsed),
    })),
    testimonials,
    // Omit message bodies from the export? No — admin owns the data, include
    // them so the export is a complete backup. (They're already
    // admin-only behind requireAdmin.)
    messages,
  };

  const json = JSON.stringify(payload, null, 2);
  const filename = `portfolio-export-${new Date().toISOString().slice(0, 10)}.json`;

  return new Response(json, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
