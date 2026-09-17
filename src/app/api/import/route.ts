import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/api";
import { requireAdmin } from "@/lib/session";

/**
 * Admin-only JSON import / restore.
 * Accepts a full or partial portfolio backup snapshot.
 * Mode: "merge" (default, adds/updates items) or "overwrite" (wipes existing content collections and replaces).
 */
export async function POST(request: NextRequest) {
  await requireAdmin();

  let body: any;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const mode = body.mode === "overwrite" ? "overwrite" : "merge";
  const data = body.data || body;

  if (!data || typeof data !== "object") {
    return badRequest("No valid import data found");
  }

  const {
    profile,
    projects = [],
    skills = [],
    experience = [],
    education = [],
    testimonials = [],
  } = data;

  try {
    const counts = {
      projects: 0,
      skills: 0,
      experience: 0,
      education: 0,
      testimonials: 0,
      profileUpdated: false,
    };

    await db.$transaction(async (tx) => {
      // 1. If overwrite mode, purge collection tables
      if (mode === "overwrite") {
        if (Array.isArray(projects) && projects.length > 0) {
          await tx.project.deleteMany();
        }
        if (Array.isArray(skills) && skills.length > 0) {
          await tx.skill.deleteMany();
        }
        if (Array.isArray(experience) && experience.length > 0) {
          await tx.experience.deleteMany();
        }
        if (Array.isArray(education) && education.length > 0) {
          await tx.education.deleteMany();
        }
        if (Array.isArray(testimonials) && testimonials.length > 0) {
          await tx.testimonial.deleteMany();
        }
      }

      // 2. Profile restoration
      if (profile && typeof profile === "object") {
        await tx.profile.upsert({
          where: { id: "singleton" },
          update: {
            name: profile.name ?? undefined,
            title: profile.title ?? undefined,
            tagline: profile.tagline ?? undefined,
            bio: profile.bio ?? undefined,
            avatarUrl: profile.avatarUrl ?? undefined,
            socialLinks:
              typeof profile.socialLinks === "object"
                ? JSON.stringify(profile.socialLinks)
                : profile.socialLinks,
            seo:
              typeof profile.seo === "object"
                ? JSON.stringify(profile.seo)
                : profile.seo,
            stats:
              typeof profile.stats === "object"
                ? JSON.stringify(profile.stats)
                : profile.stats,
          },
          create: {
            id: "singleton",
            name: profile.name || "Muhammad Amir",
            title: profile.title || "Full-Stack Developer",
            tagline: profile.tagline || "",
            bio: profile.bio || "",
            avatarUrl: profile.avatarUrl || null,
            socialLinks:
              typeof profile.socialLinks === "object"
                ? JSON.stringify(profile.socialLinks)
                : profile.socialLinks || "{}",
            seo:
              typeof profile.seo === "object"
                ? JSON.stringify(profile.seo)
                : profile.seo || "{}",
            stats:
              typeof profile.stats === "object"
                ? JSON.stringify(profile.stats)
                : profile.stats || "{}",
          },
        });
        counts.profileUpdated = true;
      }

      // 3. Projects
      if (Array.isArray(projects)) {
        for (const p of projects) {
          if (!p.title || !p.slug) continue;
          const techTags = Array.isArray(p.techTags)
            ? JSON.stringify(p.techTags)
            : typeof p.techTags === "string"
            ? p.techTags
            : "[]";
          const images = Array.isArray(p.images)
            ? JSON.stringify(p.images)
            : typeof p.images === "string"
            ? p.images
            : "[]";

          await tx.project.upsert({
            where: { slug: p.slug },
            update: {
              title: p.title,
              description: p.description || "",
              caseStudy: p.caseStudy || "",
              coverImage: p.coverImage || null,
              images,
              techTags,
              liveUrl: p.liveUrl || null,
              repoUrl: p.repoUrl || null,
              isFeatured: Boolean(p.isFeatured),
              isPublished: p.isPublished !== undefined ? Boolean(p.isPublished) : true,
              order: Number(p.order || 0),
            },
            create: {
              title: p.title,
              slug: p.slug,
              description: p.description || "",
              caseStudy: p.caseStudy || "",
              coverImage: p.coverImage || null,
              images,
              techTags,
              liveUrl: p.liveUrl || null,
              repoUrl: p.repoUrl || null,
              isFeatured: Boolean(p.isFeatured),
              isPublished: p.isPublished !== undefined ? Boolean(p.isPublished) : true,
              order: Number(p.order || 0),
            },
          });
          counts.projects++;
        }
      }

      // 4. Skills
      if (Array.isArray(skills)) {
        for (const s of skills) {
          if (!s.name) continue;
          if (mode === "merge" && s.id) {
            const existing = await tx.skill.findUnique({ where: { id: s.id } });
            if (existing) {
              await tx.skill.update({
                where: { id: s.id },
                data: {
                  name: s.name,
                  category: s.category || "Frontend",
                  proficiency: Number(s.proficiency || 80),
                  order: Number(s.order || 0),
                  icon: s.icon || null,
                },
              });
              counts.skills++;
              continue;
            }
          }
          await tx.skill.create({
            data: {
              name: s.name,
              category: s.category || "Frontend",
              proficiency: Number(s.proficiency || 80),
              order: Number(s.order || 0),
              icon: s.icon || null,
            },
          });
          counts.skills++;
        }
      }

      // 5. Experience
      if (Array.isArray(experience)) {
        for (const e of experience) {
          if (!e.role || !e.company) continue;
          const techUsed = Array.isArray(e.techUsed)
            ? JSON.stringify(e.techUsed)
            : typeof e.techUsed === "string"
            ? e.techUsed
            : "[]";

          if (mode === "merge" && e.id) {
            const existing = await tx.experience.findUnique({ where: { id: e.id } });
            if (existing) {
              await tx.experience.update({
                where: { id: e.id },
                data: {
                  role: e.role,
                  company: e.company,
                  location: e.location || null,
                  startDate: String(e.startDate || ""),
                  endDate: e.endDate ? String(e.endDate) : null,
                  current: Boolean(e.current),
                  description: e.description || "",
                  techUsed,
                  order: Number(e.order || 0),
                },
              });
              counts.experience++;
              continue;
            }
          }
          await tx.experience.create({
            data: {
              role: e.role,
              company: e.company,
              location: e.location || null,
              startDate: String(e.startDate || ""),
              endDate: e.endDate ? String(e.endDate) : null,
              current: Boolean(e.current),
              description: e.description || "",
              techUsed,
              order: Number(e.order || 0),
            },
          });
          counts.experience++;
        }
      }

      // 6. Education
      if (Array.isArray(education)) {
        for (const ed of education) {
          if (!ed.degree || !ed.institution) continue;
          if (mode === "merge" && ed.id) {
            const existing = await tx.education.findUnique({ where: { id: ed.id } });
            if (existing) {
              await tx.education.update({
                where: { id: ed.id },
                data: {
                  degree: ed.degree,
                  institution: ed.institution,
                  field: ed.field || null,
                  location: ed.location || null,
                  startDate: String(ed.startDate || ""),
                  endDate: ed.endDate ? String(ed.endDate) : null,
                  current: Boolean(ed.current),
                  grade: ed.grade || null,
                  description: ed.description || "",
                  order: Number(ed.order || 0),
                },
              });
              counts.education++;
              continue;
            }
          }
          await tx.education.create({
            data: {
              degree: ed.degree,
              institution: ed.institution,
              field: ed.field || null,
              location: ed.location || null,
              startDate: String(ed.startDate || ""),
              endDate: ed.endDate ? String(ed.endDate) : null,
              current: Boolean(ed.current),
              grade: ed.grade || null,
              description: ed.description || "",
              order: Number(ed.order || 0),
            },
          });
          counts.education++;
        }
      }

      // 7. Testimonials
      if (Array.isArray(testimonials)) {
        for (const t of testimonials) {
          if (!t.name || !t.company || !t.message) continue;
          if (mode === "merge" && t.id) {
            const existing = await tx.testimonial.findUnique({ where: { id: t.id } });
            if (existing) {
              await tx.testimonial.update({
                where: { id: t.id },
                data: {
                  name: t.name,
                  role: t.role || "",
                  company: t.company,
                  message: t.message,
                  avatarUrl: t.avatarUrl || null,
                  rating: Number(t.rating || 5),
                  approved: Boolean(t.approved),
                  order: Number(t.order || 0),
                },
              });
              counts.testimonials++;
              continue;
            }
          }
          await tx.testimonial.create({
            data: {
              name: t.name,
              role: t.role || "",
              company: t.company,
              message: t.message,
              avatarUrl: t.avatarUrl || null,
              rating: Number(t.rating || 5),
              approved: Boolean(t.approved),
              order: Number(t.order || 0),
            },
          });
          counts.testimonials++;
        }
      }
    });

    return ok({
      ok: true,
      mode,
      imported: counts,
    });
  } catch (err) {
    console.error("Import failed:", err);
    return serverError(`Import failed: ${(err as Error).message}`);
  }
}
