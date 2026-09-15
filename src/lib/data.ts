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

// Fallback datasets ensure the portfolio works 100% reliably in any environment
// (e.g. Vercel serverless deployment without a configured or reachable database).

export const FALLBACK_PROFILE: ProfileData = {
  id: "singleton",
  name: "Muhammad Amir",
  title: "Full-Stack Developer",
  tagline: "I design and build fast, accessible web products — from the database schema to the last pixel of micro-interaction.",
  bio: "I'm a full-stack developer with 3 years of professional experience building production web applications with React, Next.js, Node.js and PostgreSQL. I care deeply about performance, accessibility, and the small details that make a product feel crafted. When I'm not shipping, I'm exploring design systems, WebGL experiments, and the occasional weekend side project.",
  avatarUrl: "/uploads/avatar.jpg",
  socialLinks: {
    github: "https://github.com/muhammadamir",
    linkedin: "https://linkedin.com/in/muhammadamir",
    twitter: "https://twitter.com/muhammadamir",
    email: "hello@muhammadamir.dev",
    website: "https://muhammadamir.dev",
  },
  seo: {
    title: "Muhammad Amir — Full-Stack Developer",
    description: "Full-stack developer crafting fast, accessible web experiences with React, Next.js and Node.js.",
    ogImage: "/uploads/og-cover.svg",
  },
  stats: {
    yearsExperience: 3,
    projectsDelivered: 24,
    technologies: 18,
    clients: 9,
    coffeeCups: 1840,
    avatarPosY: 15,
    avatarPosX: 50,
    avatarZoom: 100,
  },
  updatedAt: new Date("2026-01-01"),
};

export const FALLBACK_SKILLS: SkillData[] = [
  { id: "s-1", name: "TypeScript", category: "Frontend", proficiency: 92, order: 0, icon: "SiTypescript" },
  { id: "s-2", name: "React", category: "Frontend", proficiency: 95, order: 1, icon: "SiReact" },
  { id: "s-3", name: "Next.js", category: "Frontend", proficiency: 93, order: 2, icon: "SiNextdotjs" },
  { id: "s-4", name: "Tailwind CSS", category: "Frontend", proficiency: 90, order: 3, icon: "SiTailwindcss" },
  { id: "s-5", name: "Framer Motion", category: "Frontend", proficiency: 82, order: 4, icon: "SiFramer" },
  { id: "s-6", name: "Node.js", category: "Backend", proficiency: 88, order: 5, icon: "SiNodedotjs" },
  { id: "s-7", name: "Express", category: "Backend", proficiency: 85, order: 6, icon: "SiExpress" },
  { id: "s-8", name: "NestJS", category: "Backend", proficiency: 75, order: 7, icon: "SiNestjs" },
  { id: "s-9", name: "GraphQL", category: "Backend", proficiency: 72, order: 8, icon: "SiGraphql" },
  { id: "s-10", name: "REST APIs", category: "Backend", proficiency: 90, order: 9, icon: "SiOpenapiinitiative" },
  { id: "s-11", name: "PostgreSQL", category: "Database", proficiency: 84, order: 10, icon: "SiPostgresql" },
  { id: "s-12", name: "Prisma", category: "Database", proficiency: 88, order: 11, icon: "SiPrisma" },
  { id: "s-13", name: "MongoDB", category: "Database", proficiency: 78, order: 12, icon: "SiMongodb" },
  { id: "s-14", name: "Redis", category: "Database", proficiency: 70, order: 13, icon: "SiRedis" },
  { id: "s-15", name: "Docker", category: "Tools", proficiency: 80, order: 14, icon: "SiDocker" },
  { id: "s-16", name: "Git", category: "Tools", proficiency: 92, order: 15, icon: "SiGit" },
  { id: "s-17", name: "AWS", category: "Tools", proficiency: 68, order: 16, icon: "SiAmazonaws" },
  { id: "s-18", name: "Vercel", category: "Tools", proficiency: 86, order: 17, icon: "SiVercel" },
];

export const FALLBACK_EXPERIENCE: ExperienceData[] = [
  {
    id: "exp-1",
    role: "Senior Full-Stack Developer",
    company: "Nimbus Labs",
    location: "Remote",
    startDate: "2024-02",
    endDate: null,
    current: true,
    description:
      "Lead developer on a multi-tenant SaaS analytics platform serving 12k+ monthly active users. Architected the migration from a monolith to a modular Next.js + tRPC stack, cutting p95 page loads from 3.2s to 0.8s. Mentored two junior engineers and owned the design system rollout.",
    techUsed: ["Next.js", "TypeScript", "tRPC", "PostgreSQL", "Prisma", "Redis", "Vercel"],
    order: 0,
  },
  {
    id: "exp-2",
    role: "Full-Stack Developer",
    company: "Atlas Studio",
    location: "Berlin, DE",
    startDate: "2023-01",
    endDate: "2024-01",
    current: false,
    description:
      "Built client products across fintech and healthcare. Shipped a KYC onboarding flow that processed 4,200+ verifications in its first quarter. Introduced end-to-end testing with Playwright and cut production regressions by 60%.",
    techUsed: ["React", "Node.js", "NestJS", "GraphQL", "PostgreSQL", "Docker"],
    order: 1,
  },
  {
    id: "exp-3",
    role: "Junior Web Developer",
    company: "Pixel & Co.",
    location: "Remote",
    startDate: "2022-03",
    endDate: "2022-12",
    current: false,
    description:
      "Joined as the first engineering hire. Delivered marketing sites, a headless CMS integration, and an internal invoicing tool. Established the CI/CD pipeline that reduced deploy time from 25 minutes to under 4.",
    techUsed: ["Next.js", "Tailwind CSS", "Strapi", "Vercel", "Git"],
    order: 2,
  },
];

export const FALLBACK_PROJECTS: ProjectData[] = [
  {
    id: "proj-1",
    title: "Aurora Analytics",
    slug: "aurora-analytics",
    description:
      "A real-time product analytics dashboard with custom event tracking, funnel analysis, and beautiful, fast charts.",
    caseStudy:
      "## Problem\nTeams needed a self-serve way to understand user journeys without engineering tickets.\n\n## Solution\nBuilt a Snowflake-ingested event pipeline with a Next.js dashboard rendering sub-100ms queries. Introduced a custom charting layer on top of D3.\n\n## Stack\nNext.js, tRPC, PostgreSQL, Prisma, Redis, D3.js",
    coverImage: "/uploads/project-aurora.svg",
    images: ["/uploads/project-aurora.svg"],
    techTags: ["Next.js", "TypeScript", "tRPC", "PostgreSQL", "D3.js"],
    liveUrl: "https://example.com/aurora",
    repoUrl: "https://github.com/alexrivera/aurora-analytics",
    isFeatured: true,
    isPublished: true,
    order: 0,
  },
  {
    id: "proj-2",
    title: "Lumen Commerce",
    slug: "lumen-commerce",
    description:
      "Headless e-commerce storefront with Stripe checkout, instant search, and a 98 Lighthouse score.",
    caseStudy:
      "## Problem\nA boutique brand's Shopify theme was slow and rigid.\n\n## Solution\nReplatformed to a headless Next.js storefront with Shopify's Storefront API. Achieved 98+ Lighthouse scores and a 40% lift in conversion.\n\n## Stack\nNext.js, Shopify Storefront API, Stripe, Tailwind CSS",
    coverImage: "/uploads/project-lumen.svg",
    images: ["/uploads/project-lumen.svg"],
    techTags: ["Next.js", "Shopify", "Stripe", "Tailwind CSS"],
    liveUrl: "https://example.com/lumen",
    repoUrl: "https://github.com/alexrivera/lumen-commerce",
    isFeatured: true,
    isPublished: true,
    order: 1,
  },
  {
    id: "proj-3",
    title: "Pulse Chat",
    slug: "pulse-chat",
    description:
      "Real-time chat app with typing indicators, presence, and end-to-end message search.",
    caseStudy:
      "## Problem\nA community needed a lightweight, fast chat without the bloat of Discord.\n\n## Solution\nBuilt a Socket.io + Redis pub/sub backend with a Next.js client. Search via Meilisearch returns results in under 50ms across 2M messages.\n\n## Stack\nNext.js, Socket.io, Redis, Meilisearch, Node.js",
    coverImage: "/uploads/project-pulse.svg",
    images: ["/uploads/project-pulse.svg"],
    techTags: ["Next.js", "Socket.io", "Redis", "Node.js"],
    liveUrl: "https://example.com/pulse",
    repoUrl: "https://github.com/alexrivera/pulse-chat",
    isFeatured: false,
    isPublished: true,
    order: 2,
  },
  {
    id: "proj-4",
    title: "Trailhead CMS",
    slug: "trailhead-cms",
    description:
      "A developer-first headless CMS with a block-based editor, role-based access, and a typed SDK.",
    caseStudy:
      "## Problem\nMarketing teams were blocked waiting on engineering for content edits.\n\n## Solution\nBuilt a block-based visual editor with a typed SDK auto-generated from the schema. Publishing went from days to minutes.\n\n## Stack\nNext.js, NestJS, Prisma, PostgreSQL, TipTap",
    coverImage: "/uploads/project-trailhead.svg",
    images: ["/uploads/project-trailhead.svg"],
    techTags: ["Next.js", "NestJS", "Prisma", "TipTap"],
    liveUrl: "https://example.com/trailhead",
    repoUrl: "https://github.com/alexrivera/trailhead-cms",
    isFeatured: false,
    isPublished: true,
    order: 3,
  },
  {
    id: "proj-5",
    title: "Fern Finance",
    slug: "fern-finance",
    description:
      "A personal finance tracker with bank syncing, budget envelopes, and weekly digest emails.",
    caseStudy:
      "## Problem\nExisting budgeting tools felt bloated and ignored privacy.\n\n## Solution\nBuilt a privacy-first tracker with Plaid bank syncing and envelope budgeting. Weekly digest emails keep users engaged without push notifications.\n\n## Stack\nNext.js, Node.js, Plaid, PostgreSQL, Resend",
    coverImage: "/uploads/project-fern.svg",
    images: ["/uploads/project-fern.svg"],
    techTags: ["Next.js", "Node.js", "Plaid", "PostgreSQL"],
    liveUrl: "https://example.com/fern",
    repoUrl: "https://github.com/alexrivera/fern-finance",
    isFeatured: true,
    isPublished: true,
    order: 4,
  },
  {
    id: "proj-6",
    title: "Atlas Docs",
    slug: "atlas-docs",
    description:
      "A documentation site generator with MDX, live code blocks, and instant search.",
    caseStudy:
      "## Problem\nOpen-source projects needed beautiful docs without the maintenance burden.\n\n## Solution\nBuilt an MDX-based docs generator with live editable code blocks and Algolia-style instant search. Deploys are git-push.\n\n## Stack\nNext.js, MDX, TipTap, Algolia",
    coverImage: "/uploads/project-atlas.svg",
    images: ["/uploads/project-atlas.svg"],
    techTags: ["Next.js", "MDX", "Algolia"],
    liveUrl: "https://example.com/atlas",
    repoUrl: "https://github.com/alexrivera/atlas-docs",
    isFeatured: false,
    isPublished: true,
    order: 5,
  },
];

export const FALLBACK_TESTIMONIALS: TestimonialData[] = [
  {
    id: "test-1",
    name: "Sara Lin",
    role: "CTO",
    company: "Nimbus Labs",
    message:
      "Alex shipped our analytics rewrite two weeks ahead of schedule and the performance gains were beyond what we scoped. A rare engineer who thinks in systems and sweats the details.",
    avatarUrl: "/uploads/testimonial-sara.svg",
    rating: 5,
    approved: true,
    order: 0,
  },
  {
    id: "test-2",
    name: "Marko Vidal",
    role: "Product Lead",
    company: "Atlas Studio",
    message:
      "The KYC flow Alex built became the foundation of our onboarding. Clean code, great docs, and he mentored the whole team on testing without making anyone feel small.",
    avatarUrl: "/uploads/testimonial-marko.svg",
    rating: 5,
    approved: true,
    order: 1,
  },
  {
    id: "test-3",
    name: "Priya Anand",
    role: "Founder",
    company: "Fern",
    message:
      "Working with Alex felt like having a co-founder who happened to be a senior engineer. He pushed back on bad ideas kindly and the product was better for it.",
    avatarUrl: "/uploads/testimonial-priya.svg",
    rating: 5,
    approved: true,
    order: 2,
  },
  {
    id: "test-4",
    name: "Jonas Weber",
    role: "Engineering Manager",
    company: "Pixel & Co.",
    message:
      "Alex set up our entire deploy pipeline in his first month. The man writes tests like he enjoys it. Would rehire in a heartbeat.",
    avatarUrl: "/uploads/testimonial-jonas.svg",
    rating: 5,
    approved: true,
    order: 3,
  },
];

export async function getProfile(): Promise<ProfileData> {
  try {
    let p = await db.profile.findUnique({ where: { id: "singleton" } });
    if (!p) {
      p = await db.profile.create({ data: { id: "singleton" } });
    }
    return {
      id: p.id,
      name: p.name || FALLBACK_PROFILE.name,
      title: p.title || FALLBACK_PROFILE.title,
      tagline: p.tagline || FALLBACK_PROFILE.tagline,
      bio: p.bio || FALLBACK_PROFILE.bio,
      avatarUrl: p.avatarUrl || FALLBACK_PROFILE.avatarUrl,
      socialLinks: parseJsonObject(p.socialLinks, FALLBACK_PROFILE.socialLinks),
      seo: parseJsonObject(p.seo, FALLBACK_PROFILE.seo),
      stats: parseJsonObject(p.stats, FALLBACK_PROFILE.stats),
      updatedAt: p.updatedAt || FALLBACK_PROFILE.updatedAt,
    };
  } catch (err) {
    console.warn("db.profile query failed, using fallback:", (err as Error).message);
    return FALLBACK_PROFILE;
  }
}

export async function getSkills(): Promise<SkillData[]> {
  try {
    const skills = await db.skill.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
    if (skills && skills.length > 0) return skills;
    return FALLBACK_SKILLS;
  } catch (err) {
    console.warn("db.skill query failed, using fallback:", (err as Error).message);
    return FALLBACK_SKILLS;
  }
}

export async function getExperience(): Promise<ExperienceData[]> {
  try {
    const items = await db.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
    if (items && items.length > 0) {
      return items.map((e) => ({ ...e, techUsed: parseJsonArray(e.techUsed) }));
    }
    return FALLBACK_EXPERIENCE;
  } catch (err) {
    console.warn("db.experience query failed, using fallback:", (err as Error).message);
    return FALLBACK_EXPERIENCE;
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
    if (projects && projects.length > 0) {
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
    return opts.featuredOnly ? FALLBACK_PROJECTS.filter((p) => p.isFeatured) : FALLBACK_PROJECTS;
  } catch (err) {
    console.warn("db.project query failed, using fallback:", (err as Error).message);
    return opts.featuredOnly ? FALLBACK_PROJECTS.filter((p) => p.isFeatured) : FALLBACK_PROJECTS;
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
  } catch (err) {
    console.warn(`db.project.findUnique(${slug}) failed, trying fallback:`, (err as Error).message);
  }
  const fallback = FALLBACK_PROJECTS.find((p) => p.slug === slug && p.isPublished);
  return fallback || null;
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
    if (others && others.length > 0) {
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
  } catch (err) {
    console.warn("getRelatedProjects DB query failed, using fallback:", (err as Error).message);
  }

  // Fallback calculation
  const fallbackOthers = FALLBACK_PROJECTS.filter((p) => p.isPublished && p.slug !== current.slug);
  return fallbackOthers
    .map((p) => {
      const shared = p.techTags.filter((t) => current.techTags.includes(t)).length;
      return { p, shared, featured: p.isFeatured ? 1 : 0 };
    })
    .sort((a, b) => b.shared - a.shared || b.featured - a.featured)
    .slice(0, limit)
    .map(({ p }) => p);
}

export async function getProjectNav(
  current: ProjectData
): Promise<{ prev: ProjectData | null; next: ProjectData | null }> {
  let all: ProjectData[] = [];
  try {
    const dbAll = await db.project.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    if (dbAll && dbAll.length > 0) {
      all = dbAll.map((p) => ({
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
  } catch (err) {
    console.warn("getProjectNav DB query failed, using fallback:", (err as Error).message);
  }

  if (all.length === 0) {
    all = FALLBACK_PROJECTS;
  }

  const idx = all.findIndex((p) => p.slug === current.slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export async function getTestimonials(approvedOnly = true): Promise<TestimonialData[]> {
  try {
    const where = approvedOnly ? { approved: true } : {};
    const items = await db.testimonial.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    if (items && items.length > 0) return items;
    return FALLBACK_TESTIMONIALS;
  } catch (err) {
    console.warn("db.testimonial query failed, using fallback:", (err as Error).message);
    return FALLBACK_TESTIMONIALS;
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
