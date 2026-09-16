import { db } from "@/lib/db";
import { parseJsonArray, parseJsonObject } from "@/lib/api";

export type ProfileData = {
  id: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatarUrl: string | null;
  socialLinks: Record<string, string>;
  seo: Record<string, string>;
  stats: Record<string, number | string>;
  updatedAt: Date;
};

export type SkillData = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  order: number;
  icon: string | null;
};

export type ExperienceData = {
  id: string;
  role: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  techUsed: string[];
  order: number;
};

export type EducationData = {
  id: string;
  degree: string;
  institution: string;
  field: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  grade: string | null;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  caseStudy: string;
  coverImage: string | null;
  images: string[];
  techTags: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
};

export type TestimonialData = {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  avatarUrl: string | null;
  rating: number;
  approved: boolean;
  order: number;
};

// Empty profile returned when DB row is completely missing
const EMPTY_PROFILE: ProfileData = {
  id: "singleton",
  name: "",
  title: "",
  tagline: "",
  bio: "",
  avatarUrl: null,
  socialLinks: {},
  seo: {},
  stats: {},
  updatedAt: new Date(),
};

export async function getProfile(): Promise<ProfileData> {
  try {
    let p = await db.profile.findUnique({ where: { id: "singleton" } });
    if (!p) {
      p = await db.profile.create({ data: { id: "singleton" } });
    }
    return {
      id: p.id,
      name: p.name,
      title: p.title,
      tagline: p.tagline,
      bio: p.bio,
      avatarUrl: p.avatarUrl ?? null,
      socialLinks: parseJsonObject(p.socialLinks, {}),
      seo: parseJsonObject(p.seo, {}),
      stats: parseJsonObject(p.stats, {}),
      updatedAt: p.updatedAt,
    };
  } catch (err) {
    console.error("db.profile query failed:", (err as Error).message);
    return EMPTY_PROFILE;
  }
}

export async function getSkills(): Promise<SkillData[]> {
  try {
    return await db.skill.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  } catch (err) {
    console.error("db.skill query failed:", (err as Error).message);
    return [];
  }
}

export async function getExperience(): Promise<ExperienceData[]> {
  try {
    const items = await db.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
    return items.map((e) => ({ ...e, techUsed: parseJsonArray(e.techUsed) }));
  } catch (err) {
    console.error("db.experience query failed:", (err as Error).message);
    return [];
  }
}

export async function getEducation(): Promise<EducationData[]> {
  try {
    return await db.education.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
  } catch (err) {
    console.error("db.education query failed:", (err as Error).message);
    return [];
  }
}

export async function getProjects(opts: { featuredOnly?: boolean } = {}): Promise<ProjectData[]> {
  try {
    const where = {
      isPublished: true,
      ...(opts.featuredOnly ? { isFeatured: true } : {}),
    };
    const projects = await db.project.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      caseStudy: p.caseStudy,
      coverImage: p.coverImage ?? null,
      images: parseJsonArray(p.images),
      techTags: parseJsonArray(p.techTags),
      liveUrl: p.liveUrl ?? null,
      repoUrl: p.repoUrl ?? null,
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
      order: p.order,
    }));
  } catch (err) {
    console.error("db.project query failed:", (err as Error).message);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectData | null> {
  try {
    const p = await db.project.findUnique({ where: { slug } });
    if (p && p.isPublished) {
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        caseStudy: p.caseStudy,
        coverImage: p.coverImage ?? null,
        images: parseJsonArray(p.images),
        techTags: parseJsonArray(p.techTags),
        liveUrl: p.liveUrl ?? null,
        repoUrl: p.repoUrl ?? null,
        isFeatured: p.isFeatured,
        isPublished: p.isPublished,
        order: p.order,
      };
    }
    return null;
  } catch (err) {
    console.error(`db.project.findUnique(${slug}) failed:`, (err as Error).message);
    return null;
  }
}

export async function getRelatedProjects(
  current: ProjectData,
  limit = 3
): Promise<ProjectData[]> {
  try {
    const others = await db.project.findMany({
      where: { isPublished: true, slug: { not: current.slug } },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      take: 20,
    });
    return others
      .map((p) => {
        const tags = parseJsonArray<string>(p.techTags);
        const shared = tags.filter((t) => current.techTags.includes(t)).length;
        return { p, shared, featured: p.isFeatured ? 1 : 0 };
      })
      .sort((a, b) => b.shared - a.shared || b.featured - a.featured)
      .slice(0, limit)
      .map(({ p }) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        caseStudy: p.caseStudy,
        coverImage: p.coverImage ?? null,
        images: parseJsonArray(p.images),
        techTags: parseJsonArray(p.techTags),
        liveUrl: p.liveUrl ?? null,
        repoUrl: p.repoUrl ?? null,
        isFeatured: p.isFeatured,
        isPublished: p.isPublished,
        order: p.order,
      }));
  } catch (err) {
    console.error("getRelatedProjects DB query failed:", (err as Error).message);
    return [];
  }
}

export async function getProjectNav(
  current: ProjectData
): Promise<{ prev: ProjectData | null; next: ProjectData | null }> {
  try {
    const dbAll = await db.project.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    const all = dbAll.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      caseStudy: p.caseStudy,
      coverImage: p.coverImage ?? null,
      images: parseJsonArray(p.images),
      techTags: parseJsonArray(p.techTags),
      liveUrl: p.liveUrl ?? null,
      repoUrl: p.repoUrl ?? null,
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
      order: p.order,
    }));
    const idx = all.findIndex((p) => p.slug === current.slug);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? all[idx - 1] : null,
      next: idx < all.length - 1 ? all[idx + 1] : null,
    };
  } catch (err) {
    console.error("getProjectNav DB query failed:", (err as Error).message);
    return { prev: null, next: null };
  }
}

export async function getTestimonials(approvedOnly = true): Promise<TestimonialData[]> {
  try {
    const where = approvedOnly ? { approved: true } : {};
    return await db.testimonial.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.error("db.testimonial query failed:", (err as Error).message);
    return [];
  }
}

export async function getAllPortfolioData() {
  const [profile, skills, experience, projects, testimonials] = await Promise.all([
    getProfile(),
    getSkills(),
    getExperience(),
    getProjects(),
    getTestimonials(),
  ]);
  return { profile, skills, experience, projects, testimonials };
}
