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
    title: "Bright Horizon Public School",
    slug: "bright-horizon-public-school",
    description: "Premier educational institution portal featuring digital admissions, interactive curriculum guides, fee structures, and an AI-powered school assistant.",
    caseStudy: "## Problem\nThe school required a modern, centralized digital presence to streamline admissions, provide parents with transparent academic insights, and automate frequent queries.\n\n## Solution\nEngineered a comprehensive institutional web portal featuring online registration forms, automated fee breakdown calculators, interactive academic syllabi, and an embedded 24/7 AI School Assistant to answer parent inquiries instantly.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, Framer Motion, AI Assistant, PostgreSQL",
    coverImage: "/uploads/project-bright-horizon.webp",
    images: ["/uploads/project-bright-horizon.webp"],
    techTags: ["Next.js", "TypeScript", "Tailwind CSS", "AI Assistant", "PostgreSQL"],
    liveUrl: "https://bright-horizon-public-school.vercel.app/",
    repoUrl: "https://github.com/muhammadamir128/--Bright-Horizon-Public-School",
    isFeatured: true,
    isPublished: true,
    order: 0,
  },
  {
    id: "p2",
    title: "Al-Shifa Medical Complex",
    slug: "al-shifa-medical-complex",
    description: "Modern Hospital Management System (HMS) enabling patient registration, specialist appointment booking, department navigation, and 24/7 emergency response.",
    caseStudy: "## Problem\nHealthcare facilities often struggle with fragmented appointment scheduling, congested emergency workflows, and decentralized doctor registries.\n\n## Solution\nDeveloped a full-featured hospital management application featuring multi-department directories (Cardiology, Neurology, Pediatrics, etc.), real-time doctor appointment booking, digital lab report access, and rapid emergency dispatch alerts.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, Lucide Icons, Prisma, PostgreSQL",
    coverImage: "/uploads/project-al-shifa.webp",
    images: ["/uploads/project-al-shifa.webp"],
    techTags: ["Next.js", "TypeScript", "Tailwind CSS", "Healthcare HMS", "Prisma"],
    liveUrl: "https://al-shifa-medical-complex-hopital.vercel.app/",
    repoUrl: "https://github.com/muhammadamir128/al-shifa-medical-complex-hopital",
    isFeatured: true,
    isPublished: true,
    order: 1,
  },
  {
    id: "p3",
    title: "QanoonPK — Pakistan Legal Directory",
    slug: "qanoon-pk-pakistan-legal-directory",
    description: "Bilingual (Urdu & English) legal directory offering searchable federal and provincial statutes, guided law finders, lawyer directories, and legal document templates.",
    caseStudy: "## Problem\nAccess to Pakistani legal codes, acts, and verified practitioners was fragmented, archaic, and difficult for citizens and legal scholars to search in both English and Urdu.\n\n## Solution\nBuilt Pakistan's leading open legal database featuring full-text search across federal and provincial laws, an interactive 'Which Law Applies?' finder, court jurisdiction hierarchy visualizations, verified lawyer profiles, and customizable legal document generators.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, Urdu Naskh Typography, Search Engine, Bilingual i18n",
    coverImage: "/uploads/project-qanoon-pk.webp",
    images: ["/uploads/project-qanoon-pk.webp"],
    techTags: ["Next.js", "TypeScript", "Tailwind CSS", "Legal Tech", "Bilingual i18n"],
    liveUrl: "https://qanoon-pk-pakistan-legal-directory.vercel.app/",
    repoUrl: "https://github.com/muhammadamir128/QanoonPK-Pakistan-Legal-Directory",
    isFeatured: true,
    isPublished: true,
    order: 2,
  },
  {
    id: "p4",
    title: "ToolsGrove — Multi-Tool Utility Suite",
    slug: "tool-grove-two",
    description: "High-performance online utility suite featuring 1,000+ client-side tools across PDF conversion, financial calculators, SEO analyzers, text utilities, and developer tools.",
    caseStudy: "## Problem\nUsers and developers constantly bounce between bloated, ad-ridden single-purpose tool sites with strict upload limits and slow cloud queues.\n\n## Solution\nArchitected a lightning-fast, zero-signup web toolkit with 15+ tool categories. All computations, PDF manipulations, and format conversions execute client-side using Web Workers and optimized WASM for maximum user privacy and zero server latency.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, Web Workers, Client-Side Processing, SEO Utilities",
    coverImage: "/uploads/project-toolsgrove.webp",
    images: ["/uploads/project-toolsgrove.webp"],
    techTags: ["Next.js", "TypeScript", "Tailwind CSS", "Web Workers", "Client-Side Processing"],
    liveUrl: "https://tool-grove-two.vercel.app/",
    repoUrl: "https://github.com/muhammadamir128/tool-grove-two",
    isFeatured: true,
    isPublished: true,
    order: 3,
  },
  {
    id: "p5",
    title: "BloodLink — Real-Time Blood Network",
    slug: "blood-link-tau-lyart",
    description: "Life-saving emergency blood platform connecting 312+ blood banks, hospitals, and donors with instant SOS broadcasts, live inventory maps, and rapid donor matching.",
    caseStudy: "## Problem\nDuring medical emergencies, finding rare blood units in hospitals and independent banks takes hours of manual calling, causing fatal delays.\n\n## Solution\nEngineered a real-time blood availability platform with 1-tap SOS distress beacons, live inventory tracking across blood banks, automated donor notifications, and verified compatibility matching, reducing emergency response time from hours to minutes.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, Geolocation API, Real-Time SOS, Framer Motion",
    coverImage: "/uploads/project-bloodlink.webp",
    images: ["/uploads/project-bloodlink.webp"],
    techTags: ["Next.js", "TypeScript", "Tailwind CSS", "Real-Time SOS", "Geolocation"],
    liveUrl: "https://blood-link-tau-lyart.vercel.app/",
    repoUrl: "https://github.com/muhammadamir128/blood-link-tau-lyart",
    isFeatured: true,
    isPublished: true,
    order: 4,
  },
  {
    id: "p6",
    title: "Zynora — Fashion & Apparel Boutique",
    slug: "zynore",
    description: "Modern e-commerce fashion boutique featuring curated seasonal collections, instant lookbook browsing, size filtering, and a sleek checkout experience.",
    caseStudy: "## Problem\nFashion retailers need high-converting, visually immersive storefronts that load instantly and provide frictionless browsing on mobile devices.\n\n## Solution\nCreated an elegant e-commerce experience showcasing dresses, apparel, and fashion accessories with interactive category carousels, responsive lookbook galleries, real-time cart state management, and optimized checkout workflows.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, E-Commerce, Stripe, Framer Motion",
    coverImage: "/uploads/project-zynora.webp",
    images: ["/uploads/project-zynora.webp"],
    techTags: ["Next.js", "TypeScript", "Tailwind CSS", "E-Commerce", "Stripe"],
    liveUrl: "https://zynore.vercel.app/",
    repoUrl: "https://github.com/muhammadamir128/zynore",
    isFeatured: true,
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
