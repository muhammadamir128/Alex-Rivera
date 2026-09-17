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

// =========================================================================
// Default / Fallback Data (Guarantees Vercel live never renders empty pages)
// =========================================================================

export const DEFAULT_PROFILE: ProfileData = {
  id: "singleton",
  name: "Muhammad Amir",
  title: "Full-Stack Developer",
  tagline: "I design and build fast, accessible web products — from the database schema to the last pixel of micro-interaction.",
  bio: "I'm a full-stack developer with 2+ years of professional experience building production web applications with React, Next.js, Node.js and PostgreSQL. I care deeply about performance, accessibility, and the small details that make a product feel crafted. When I'm not shipping, I'm exploring design systems, WebGL experiments, and modern developer tools.",
  avatarUrl: "/uploads/avatar-cropped-1789590640132-1789590640173.jpg",
  socialLinks: {
    github: "https://github.com/muhammadamir128",
    linkedin: "https://www.linkedin.com/feed/",
    twitter: "https://twitter.com/muhammadamir",
    email: "muhammadamircs47@gmail.com",
    website: "https://muhammadamir.dev",
    cv: "/cv.pdf",
    whatsapp: "923069609884",
  },
  seo: {
    title: "Muhammad Amir — Full-Stack Developer",
    description: "Full-stack developer crafting fast, accessible web experiences with React, Next.js, TypeScript and Node.js.",
    ogImage: "/uploads/og-cover.svg",
  },
  stats: {
    yearsExperience: 2,
    projectsDelivered: 4,
    technologies: 14,
    clients: 2,
    coffeeCups: 1840,
    avatarPosY: 50,
    avatarPosX: 50,
    avatarZoom: 100,
  },
  updatedAt: new Date(),
};

export const DEFAULT_SKILLS: SkillData[] = [
  { id: "s1", name: "TypeScript", category: "Frontend", proficiency: 92, order: 0, icon: "SiTypescript" },
  { id: "s2", name: "React", category: "Frontend", proficiency: 95, order: 1, icon: "SiReact" },
  { id: "s3", name: "Next.js", category: "Frontend", proficiency: 93, order: 2, icon: "SiNextdotjs" },
  { id: "s4", name: "Tailwind CSS", category: "Frontend", proficiency: 90, order: 3, icon: "SiTailwindcss" },
  { id: "s5", name: "Framer Motion", category: "Frontend", proficiency: 82, order: 4, icon: "SiFramer" },
  { id: "s6", name: "Node.js", category: "Backend", proficiency: 88, order: 5, icon: "SiNodedotjs" },
  { id: "s7", name: "Express", category: "Backend", proficiency: 85, order: 6, icon: "SiExpress" },
  { id: "s8", name: "NestJS", category: "Backend", proficiency: 75, order: 7, icon: "SiNestjs" },
  { id: "s9", name: "GraphQL", category: "Backend", proficiency: 72, order: 8, icon: "SiGraphql" },
  { id: "s10", name: "REST APIs", category: "Backend", proficiency: 90, order: 9, icon: "SiOpenapiinitiative" },
  { id: "s11", name: "PostgreSQL", category: "Database", proficiency: 84, order: 10, icon: "SiPostgresql" },
  { id: "s12", name: "Prisma", category: "Database", proficiency: 88, order: 11, icon: "SiPrisma" },
  { id: "s13", name: "MongoDB", category: "Database", proficiency: 78, order: 12, icon: "SiMongodb" },
  { id: "s14", name: "Redis", category: "Database", proficiency: 70, order: 13, icon: "SiRedis" },
  { id: "s15", name: "Docker", category: "Tools", proficiency: 80, order: 14, icon: "SiDocker" },
  { id: "s16", name: "Git", category: "Tools", proficiency: 92, order: 15, icon: "SiGit" },
  { id: "s17", name: "AWS", category: "Tools", proficiency: 68, order: 16, icon: "SiAmazonaws" },
  { id: "s18", name: "Vercel", category: "Tools", proficiency: 86, order: 17, icon: "SiVercel" },
];

export const DEFAULT_EXPERIENCE: ExperienceData[] = [
  {
    id: "e1",
    role: "Senior Full-Stack Developer",
    company: "Nimbus Labs",
    location: "Remote",
    startDate: "2024-02",
    endDate: null,
    current: true,
    description: "Lead developer on a multi-tenant SaaS analytics platform serving 12k+ monthly active users. Architected the migration from a monolith to a modular Next.js + tRPC stack, cutting p95 page loads from 3.2s to 0.8s. Mentored two junior engineers and owned the design system rollout.",
    techUsed: ["Next.js", "TypeScript", "tRPC", "PostgreSQL", "Prisma", "Redis", "Vercel"],
    order: 0,
  },
  {
    id: "e2",
    role: "Full-Stack Developer",
    company: "Atlas Studio",
    location: "Berlin, DE",
    startDate: "2023-01",
    endDate: "2024-01",
    current: false,
    description: "Built client products across fintech and healthcare. Shipped a KYC onboarding flow that processed 4,200+ verifications in its first quarter. Introduced end-to-end testing with Playwright and cut production regressions by 60%.",
    techUsed: ["React", "Node.js", "NestJS", "GraphQL", "PostgreSQL", "Docker"],
    order: 1,
  },
  {
    id: "e3",
    role: "Junior Web Developer",
    company: "Pixel & Co.",
    location: "Remote",
    startDate: "2022-03",
    endDate: "2022-12",
    current: false,
    description: "Joined as the first engineering hire. Delivered marketing sites, a headless CMS integration, and an internal invoicing tool. Established the CI/CD pipeline that reduced deploy time from 25 minutes to under 4.",
    techUsed: ["Next.js", "Tailwind CSS", "Strapi", "Vercel", "Git"],
    order: 2,
  },
];

export const DEFAULT_EDUCATION: EducationData[] = [
  {
    id: "ed1",
    degree: "Bachelor of Science in Computer Science (BSCS)",
    institution: "University of Engineering & Technology",
    field: "Computer Science & Software Systems",
    location: "Lahore, Pakistan",
    startDate: "2019-09",
    endDate: "2023-07",
    current: false,
    grade: "3.7 / 4.0 CGPA",
    description: "Specialized in distributed systems, full-stack web architecture, database design, and algorithmic problem solving. Developed an end-to-end cloud collaboration portal for final year capstone.",
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: "p1",
    title: "Aurora Analytics",
    slug: "aurora-analytics",
    description: "A real-time product analytics dashboard with custom event tracking, funnel analysis, and beautiful, fast charts.",
    caseStudy: "## Problem\nTeams needed a self-serve way to understand user journeys without engineering tickets.\n\n## Solution\nBuilt a Snowflake-ingested event pipeline with a Next.js dashboard rendering sub-100ms queries. Introduced a custom charting layer on top of D3.\n\n## Stack\nNext.js, tRPC, PostgreSQL, Prisma, Redis, D3.js",
    coverImage: "/uploads/project-aurora.svg",
    images: ["/uploads/project-aurora.svg"],
    techTags: ["Next.js", "TypeScript", "tRPC", "PostgreSQL", "D3.js"],
    liveUrl: "https://example.com/aurora",
    repoUrl: "https://github.com/muhammadamir128/aurora-analytics",
    isFeatured: true,
    isPublished: true,
    order: 0,
  },
  {
    id: "p2",
    title: "Lumen Commerce",
    slug: "lumen-commerce",
    description: "Headless e-commerce storefront with Stripe checkout, instant search, and a 98 Lighthouse score.",
    caseStudy: "## Problem\nA boutique brand's Shopify theme was slow and rigid.\n\n## Solution\nReplatformed to a headless Next.js storefront with Shopify's Storefront API. Achieved 98+ Lighthouse scores and a 40% lift in conversion.\n\n## Stack\nNext.js, Shopify Storefront API, Stripe, Tailwind CSS",
    coverImage: "/uploads/project-lumen.svg",
    images: ["/uploads/project-lumen.svg"],
    techTags: ["Next.js", "Shopify", "Stripe", "Tailwind CSS"],
    liveUrl: "https://example.com/lumen",
    repoUrl: "https://github.com/muhammadamir128/lumen-commerce",
    isFeatured: true,
    isPublished: true,
    order: 1,
  },
  {
    id: "p3",
    title: "Pulse Chat",
    slug: "pulse-chat",
    description: "Real-time chat app with typing indicators, presence, and end-to-end message search.",
    caseStudy: "## Problem\nA community needed a lightweight, fast chat without the bloat of Discord.\n\n## Solution\nBuilt a Socket.io + Redis pub/sub backend with a Next.js client. Search via Meilisearch returns results in under 50ms across 2M messages.\n\n## Stack\nNext.js, Socket.io, Redis, Meilisearch, Node.js",
    coverImage: "/uploads/project-pulse.svg",
    images: ["/uploads/project-pulse.svg"],
    techTags: ["Next.js", "Socket.io", "Redis", "Node.js"],
    liveUrl: "https://example.com/pulse",
    repoUrl: "https://github.com/muhammadamir128/pulse-chat",
    isFeatured: false,
    isPublished: true,
    order: 2,
  },
  {
    id: "p4",
    title: "Trailhead CMS",
    slug: "trailhead-cms",
    description: "A developer-first headless CMS with a block-based editor, role-based access, and a typed SDK.",
    caseStudy: "## Problem\nMarketing teams were blocked waiting on engineering for content edits.\n\n## Solution\nBuilt a block-based visual editor with a typed SDK auto-generated from the schema. Publishing went from days to minutes.\n\n## Stack\nNext.js, NestJS, Prisma, PostgreSQL, TipTap",
    coverImage: "/uploads/project-trailhead.svg",
    images: ["/uploads/project-trailhead.svg"],
    techTags: ["Next.js", "NestJS", "Prisma", "TipTap"],
    liveUrl: "https://example.com/trailhead",
    repoUrl: "https://github.com/muhammadamir128/trailhead-cms",
    isFeatured: false,
    isPublished: true,
    order: 3,
  },
  {
    id: "p5",
    title: "Fern Finance",
    slug: "fern-finance",
    description: "A personal finance tracker with bank syncing, budget envelopes, and weekly digest emails.",
    caseStudy: "## Problem\nExisting budgeting tools felt bloated and ignored privacy.\n\n## Solution\nBuilt a privacy-first tracker with Plaid bank syncing and envelope budgeting. Weekly digest emails keep users engaged without push notifications.\n\n## Stack\nNext.js, Node.js, Plaid, PostgreSQL, Resend",
    coverImage: "/uploads/project-fern.svg",
    images: ["/uploads/project-fern.svg"],
    techTags: ["Next.js", "Node.js", "Plaid", "PostgreSQL"],
    liveUrl: "https://example.com/fern",
    repoUrl: "https://github.com/muhammadamir128/fern-finance",
    isFeatured: true,
    isPublished: true,
    order: 4,
  },
  {
    id: "p6",
    title: "Atlas Docs",
    slug: "atlas-docs",
    description: "A documentation site generator with MDX, live code blocks, and instant search.",
    caseStudy: "## Problem\nOpen-source projects needed beautiful docs without the maintenance burden.\n\n## Solution\nBuilt an MDX-based docs generator with live editable code blocks and Algolia-style instant search. Deploys are git-push.\n\n## Stack\nNext.js, MDX, TipTap, Algolia",
    coverImage: "/uploads/project-atlas.svg",
    images: ["/uploads/project-atlas.svg"],
    techTags: ["Next.js", "MDX", "Algolia"],
    liveUrl: "https://example.com/atlas",
    repoUrl: "https://github.com/muhammadamir128/atlas-docs",
    isFeatured: false,
    isPublished: true,
    order: 5,
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialData[] = [
  {
    id: "t1",
    name: "Sara Lin",
    role: "CTO",
    company: "Nimbus Labs",
    message: "Muhammad shipped our analytics rewrite ahead of schedule and the performance gains were beyond what we scoped. A rare engineer who thinks in systems and sweats the details.",
    avatarUrl: "/uploads/testimonial-sara.svg",
    rating: 5,
    approved: true,
    order: 0,
  },
  {
    id: "t2",
    name: "Marko Vidal",
    role: "Product Lead",
    company: "Atlas Studio",
    message: "The architecture Muhammad built became the foundation of our onboarding flow. Clean code, great docs, and he mentored the whole team on testing without making anyone feel small.",
    avatarUrl: "/uploads/testimonial-marko.svg",
    rating: 5,
    approved: true,
    order: 1,
  },
  {
    id: "t3",
    name: "Priya Anand",
    role: "Founder",
    company: "Fern",
    message: "Working with Muhammad felt like having a co-founder who happened to be a senior engineer. He pushed back on bad ideas kindly and the product was significantly better for it.",
    avatarUrl: "/uploads/testimonial-priya.svg",
    rating: 5,
    approved: true,
    order: 2,
  },
  {
    id: "t4",
    name: "Jonas Weber",
    role: "Engineering Manager",
    company: "Pixel & Co.",
    message: "Muhammad set up our entire deploy pipeline in his first month. The man writes tests like he enjoys it. Would rehire in a heartbeat.",
    avatarUrl: "/uploads/testimonial-jonas.svg",
    rating: 5,
    approved: true,
    order: 3,
  },
];

// =========================================================================
// Data Fetching Functions with Seamless Fallbacks
// =========================================================================

export async function getProfile(): Promise<ProfileData> {
  try {
    let p = await db.profile.findUnique({ where: { id: "singleton" } });
    if (!p || !p.name) {
      try {
        p = await db.profile.upsert({
          where: { id: "singleton" },
          update: {
            name: DEFAULT_PROFILE.name,
            title: DEFAULT_PROFILE.title,
            tagline: DEFAULT_PROFILE.tagline,
            bio: DEFAULT_PROFILE.bio,
            avatarUrl: DEFAULT_PROFILE.avatarUrl,
            socialLinks: JSON.stringify(DEFAULT_PROFILE.socialLinks),
            seo: JSON.stringify(DEFAULT_PROFILE.seo),
            stats: JSON.stringify(DEFAULT_PROFILE.stats),
          },
          create: {
            id: "singleton",
            name: DEFAULT_PROFILE.name,
            title: DEFAULT_PROFILE.title,
            tagline: DEFAULT_PROFILE.tagline,
            bio: DEFAULT_PROFILE.bio,
            avatarUrl: DEFAULT_PROFILE.avatarUrl,
            socialLinks: JSON.stringify(DEFAULT_PROFILE.socialLinks),
            seo: JSON.stringify(DEFAULT_PROFILE.seo),
            stats: JSON.stringify(DEFAULT_PROFILE.stats),
          },
        });
      } catch {
        return DEFAULT_PROFILE;
      }
    }

    const parsedSocials = parseJsonObject(p.socialLinks, DEFAULT_PROFILE.socialLinks);
    const parsedSeo = parseJsonObject(p.seo, DEFAULT_PROFILE.seo);
    const parsedStats = parseJsonObject(p.stats, DEFAULT_PROFILE.stats);

    return {
      id: p.id,
      name: p.name || DEFAULT_PROFILE.name,
      title: p.title || DEFAULT_PROFILE.title,
      tagline: p.tagline || DEFAULT_PROFILE.tagline,
      bio: p.bio || DEFAULT_PROFILE.bio,
      avatarUrl: p.avatarUrl || DEFAULT_PROFILE.avatarUrl,
      socialLinks: Object.keys(parsedSocials).length > 0 ? parsedSocials : DEFAULT_PROFILE.socialLinks,
      seo: Object.keys(parsedSeo).length > 0 ? parsedSeo : DEFAULT_PROFILE.seo,
      stats: Object.keys(parsedStats).length > 0 ? parsedStats : DEFAULT_PROFILE.stats,
      updatedAt: p.updatedAt,
    };
  } catch (err) {
    console.warn("db.profile fallback to DEFAULT_PROFILE:", (err as Error).message);
    return DEFAULT_PROFILE;
  }
}

export async function getSkills(): Promise<SkillData[]> {
  try {
    const items = await db.skill.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
    if (items && items.length > 0) return items;
  } catch (err) {
    console.warn("db.skill fallback to DEFAULT_SKILLS:", (err as Error).message);
  }
  return DEFAULT_SKILLS;
}

export async function getExperience(): Promise<ExperienceData[]> {
  try {
    const items = await db.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
    if (items && items.length > 0) {
      return items.map((e) => ({ ...e, techUsed: parseJsonArray(e.techUsed) }));
    }
  } catch (err) {
    console.warn("db.experience fallback to DEFAULT_EXPERIENCE:", (err as Error).message);
  }
  return DEFAULT_EXPERIENCE;
}

export async function getEducation(): Promise<EducationData[]> {
  try {
    const items = await db.education.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
    if (items && items.length > 0) return items;
  } catch (err) {
    console.warn("db.education fallback to DEFAULT_EDUCATION:", (err as Error).message);
  }
  return DEFAULT_EDUCATION;
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
        coverImage: p.coverImage ?? null,
        images: parseJsonArray(p.images),
        techTags: parseJsonArray(p.techTags),
        liveUrl: p.liveUrl ?? null,
        repoUrl: p.repoUrl ?? null,
        isFeatured: p.isFeatured,
        isPublished: p.isPublished,
        order: p.order,
      }));
    }
  } catch (err) {
    console.warn("db.project fallback to DEFAULT_PROJECTS:", (err as Error).message);
  }
  return opts.featuredOnly
    ? DEFAULT_PROJECTS.filter((p) => p.isFeatured)
    : DEFAULT_PROJECTS;
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
  } catch (err) {
    console.warn(`db.project.findUnique(${slug}) fallback:`, (err as Error).message);
  }
  return DEFAULT_PROJECTS.find((p) => p.slug === slug) ?? null;
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
    }
  } catch (err) {
    console.warn("getRelatedProjects fallback:", (err as Error).message);
  }

  return DEFAULT_PROJECTS
    .filter((p) => p.slug !== current.slug)
    .slice(0, limit);
}

export async function getProjectNav(
  current: ProjectData
): Promise<{ prev: ProjectData | null; next: ProjectData | null }> {
  try {
    const dbAll = await db.project.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    const all = (dbAll && dbAll.length > 0)
      ? dbAll.map((p) => ({
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
        }))
      : DEFAULT_PROJECTS;

    const idx = all.findIndex((p) => p.slug === current.slug);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? all[idx - 1] : null,
      next: idx < all.length - 1 ? all[idx + 1] : null,
    };
  } catch (err) {
    console.warn("getProjectNav fallback:", (err as Error).message);
    const idx = DEFAULT_PROJECTS.findIndex((p) => p.slug === current.slug);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? DEFAULT_PROJECTS[idx - 1] : null,
      next: idx < DEFAULT_PROJECTS.length - 1 ? DEFAULT_PROJECTS[idx + 1] : null,
    };
  }
}

export async function getTestimonials(approvedOnly = true): Promise<TestimonialData[]> {
  try {
    const where = approvedOnly ? { approved: true } : {};
    const items = await db.testimonial.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    if (items && items.length > 0) return items;
  } catch (err) {
    console.warn("db.testimonial fallback:", (err as Error).message);
  }
  return approvedOnly ? DEFAULT_TESTIMONIALS.filter((t) => t.approved) : DEFAULT_TESTIMONIALS;
}

export async function getAllPortfolioData() {
  const [profile, skills, experience, education, projects, testimonials] = await Promise.all([
    getProfile(),
    getSkills(),
    getExperience(),
    getEducation(),
    getProjects(),
    getTestimonials(),
  ]);
  return { profile, skills, experience, education, projects, testimonials };
}
