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
  stats: Record<string, number>;
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

export async function getProfile(): Promise<ProfileData> {
  let p = await db.profile.findUnique({ where: { id: "singleton" } });
  if (!p) p = await db.profile.create({ data: { id: "singleton" } });
  return {
    id: p.id,
    name: p.name,
    title: p.title,
    tagline: p.tagline,
    bio: p.bio,
    avatarUrl: p.avatarUrl,
    socialLinks: parseJsonObject(p.socialLinks, {}),
    seo: parseJsonObject(p.seo, {}),
    stats: parseJsonObject(p.stats, {}),
    updatedAt: p.updatedAt,
  };
}

export async function getSkills(): Promise<SkillData[]> {
  const skills = await db.skill.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  return skills;
}

export async function getExperience(): Promise<ExperienceData[]> {
  const items = await db.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
  return items.map((e) => ({ ...e, techUsed: parseJsonArray(e.techUsed) }));
}

export async function getProjects(opts: { featuredOnly?: boolean } = {}): Promise<ProjectData[]> {
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
    coverImage: p.coverImage,
    images: parseJsonArray(p.images),
    techTags: parseJsonArray(p.techTags),
    liveUrl: p.liveUrl,
    repoUrl: p.repoUrl,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    order: p.order,
  }));
}

export async function getProjectBySlug(slug: string): Promise<ProjectData | null> {
  const p = await db.project.findUnique({ where: { slug } });
  if (!p || !p.isPublished) return null;
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    caseStudy: p.caseStudy,
    coverImage: p.coverImage,
    images: parseJsonArray(p.images),
    techTags: parseJsonArray(p.techTags),
    liveUrl: p.liveUrl,
    repoUrl: p.repoUrl,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    order: p.order,
  };
}

export async function getRelatedProjects(
  current: ProjectData,
  limit = 3
): Promise<ProjectData[]> {
  const others = await db.project.findMany({
    where: { isPublished: true, slug: { not: current.slug } },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
    take: 20,
  });
  // prefer projects sharing at least one tech tag, then featured, then by order
  const scored = others
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
      coverImage: p.coverImage,
      images: parseJsonArray(p.images),
      techTags: parseJsonArray(p.techTags),
      liveUrl: p.liveUrl,
      repoUrl: p.repoUrl,
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
      order: p.order,
    }));
  return scored;
}

export async function getProjectNav(
  current: ProjectData
): Promise<{ prev: ProjectData | null; next: ProjectData | null }> {
  const all = await db.project.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      caseStudy: true,
      coverImage: true,
      images: true,
      techTags: true,
      liveUrl: true,
      repoUrl: true,
      isFeatured: true,
      isPublished: true,
      order: true,
    },
  });
  const idx = all.findIndex((p) => p.slug === current.slug);
  if (idx === -1) return { prev: null, next: null };
  const normalize = (p: typeof all[number]): ProjectData => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    caseStudy: p.caseStudy,
    coverImage: p.coverImage,
    images: parseJsonArray(p.images),
    techTags: parseJsonArray(p.techTags),
    liveUrl: p.liveUrl,
    repoUrl: p.repoUrl,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    order: p.order,
  });
  return {
    prev: idx > 0 ? normalize(all[idx - 1]) : null,
    next: idx < all.length - 1 ? normalize(all[idx + 1]) : null,
  };
}

export async function getTestimonials(approvedOnly = true): Promise<TestimonialData[]> {
  const where = approvedOnly ? { approved: true } : {};
  const items = await db.testimonial.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return items;
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
