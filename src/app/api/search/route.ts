import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, parseJsonArray } from "@/lib/api";
import { requireAdmin } from "@/lib/session";

type SearchResult = {
  type: "project" | "skill" | "experience" | "education" | "testimonial" | "message";
  id: string;
  title: string;
  subtitle: string | null;
  href: string;
};

const MAX_PER_GROUP = 3;

/**
 * Admin-only global search. Searches across:
 *   - projects: title + description
 *   - skills:   name
 *   - experience: role + company
 *   - education: degree + institution + field
 *   - testimonials: name + message
 *   - messages: name + email + body
 *
 * Returns grouped results (max 3 per group).
 */
export async function GET(request: NextRequest) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const raw = (searchParams.get("q") || "").trim();
  if (raw.length < 2) {
    return ok({ groups: [] });
  }

  // Split the query into AND-matched terms. Prisma's `contains` is a single
  // substring match, so we additionally filter client-side to narrow by all
  // terms (multi-word queries should AND).
  const terms = raw.toLowerCase().split(/\s+/).filter(Boolean);
  const matchesAll = (haystack: string) => {
    const lower = haystack.toLowerCase();
    return terms.every((t) => lower.includes(t));
  };

  const [projects, skills, experience, education, testimonials, messages] = await Promise.all([
    db.project.findMany({
      where: { OR: [{ title: { contains: raw } }, { description: { contains: raw } }] },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: MAX_PER_GROUP,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        techTags: true,
      },
    }),
    db.skill.findMany({
      where: { name: { contains: raw } },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      take: MAX_PER_GROUP,
      select: { id: true, name: true, category: true, proficiency: true },
    }),
    db.experience.findMany({
      where: {
        OR: [{ role: { contains: raw } }, { company: { contains: raw } }],
      },
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
      take: MAX_PER_GROUP,
      select: { id: true, role: true, company: true, startDate: true, endDate: true, current: true },
    }),
    db.education.findMany({
      where: {
        OR: [
          { degree: { contains: raw } },
          { institution: { contains: raw } },
          { field: { contains: raw } },
        ],
      },
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
      take: MAX_PER_GROUP,
      select: { id: true, degree: true, institution: true, field: true, startDate: true, endDate: true },
    }),
    db.testimonial.findMany({
      where: {
        OR: [{ name: { contains: raw } }, { message: { contains: raw } }],
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: MAX_PER_GROUP,
      select: { id: true, name: true, role: true, company: true, message: true },
    }),
    db.message.findMany({
      where: {
        OR: [
          { name: { contains: raw } },
          { email: { contains: raw } },
          { message: { contains: raw } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: MAX_PER_GROUP,
      select: { id: true, name: true, email: true, message: true, createdAt: true },
    }),
  ]);

  const projectResults: SearchResult[] = projects
    .filter((p) => matchesAll(`${p.title} ${p.description}`))
    .map((p) => ({
      type: "project" as const,
      id: p.id,
      title: p.title,
      subtitle:
        parseJsonArray<string>(p.techTags).slice(0, 3).join(" · ") ||
        p.description.slice(0, 60) ||
        null,
      href: "/admin/projects",
    }));

  const skillResults: SearchResult[] = skills
    .filter((s) => matchesAll(s.name))
    .map((s) => ({
      type: "skill" as const,
      id: s.id,
      title: s.name,
      subtitle: `${s.category} · ${s.proficiency}%`,
      href: "/admin/skills",
    }));

  const experienceResults: SearchResult[] = experience
    .filter((e) => matchesAll(`${e.role} ${e.company}`))
    .map((e) => ({
      type: "experience" as const,
      id: e.id,
      title: `${e.role} @ ${e.company}`,
      subtitle: e.current
        ? `${e.startDate} — present`
        : `${e.startDate} — ${e.endDate || "—"}`,
      href: "/admin/experience",
    }));

  const educationResults: SearchResult[] = education
    .filter((e) => matchesAll(`${e.degree} ${e.institution} ${e.field || ""}`))
    .map((e) => ({
      type: "education" as const,
      id: e.id,
      title: e.degree,
      subtitle: `${e.institution}${e.field ? ` · ${e.field}` : ""}`,
      href: "/admin/education",
    }));

  const testimonialResults: SearchResult[] = testimonials
    .filter((t) => matchesAll(`${t.name} ${t.message}`))
    .map((t) => ({
      type: "testimonial" as const,
      id: t.id,
      title: t.name,
      subtitle: `${t.role} @ ${t.company}`,
      href: "/admin/testimonials",
    }));

  const messageResults: SearchResult[] = messages
    .filter((m) => matchesAll(`${m.name} ${m.email} ${m.message}`))
    .map((m) => ({
      type: "message" as const,
      id: m.id,
      title: m.name,
      subtitle: m.email,
      href: "/admin/messages",
    }));

  const groups = [
    { type: "project" as const, label: "Projects", results: projectResults },
    { type: "skill" as const, label: "Skills", results: skillResults },
    { type: "experience" as const, label: "Experience", results: experienceResults },
    { type: "education" as const, label: "Education", results: educationResults },
    { type: "testimonial" as const, label: "Testimonials", results: testimonialResults },
    { type: "message" as const, label: "Messages", results: messageResults },
  ].filter((g) => g.results.length > 0);

  return ok({ groups });
}
