import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@portfolio.dev";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin12345";

async function main() {
  console.log("Seeding database...");

  // --- Admin ---
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: "Alex Rivera",
    },
  });
  console.log(`✓ Admin seeded: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

  // --- Profile (singleton) ---
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Alex Rivera",
      title: "Full-Stack Developer",
      tagline:
        "I design and build fast, accessible web products — from the database schema to the last pixel of micro-interaction.",
      bio: "I'm a full-stack developer with 3 years of professional experience building production web applications with React, Next.js, Node.js and PostgreSQL. I care deeply about performance, accessibility, and the small details that make a product feel crafted. When I'm not shipping, I'm exploring design systems, WebGL experiments, and the occasional weekend side project.",
      avatarUrl: "/uploads/avatar.svg",
      socialLinks: JSON.stringify({
        github: "https://github.com/alexrivera",
        linkedin: "https://linkedin.com/in/alexrivera",
        twitter: "https://twitter.com/alexrivera",
        dribbble: "https://dribbble.com/alexrivera",
        email: "hello@alexrivera.dev",
        website: "https://alexrivera.dev",
      }),
      seo: JSON.stringify({
        title: "Alex Rivera — Full-Stack Developer",
        description:
          "Full-stack developer crafting fast, accessible web experiences with React, Next.js and Node.js.",
        ogImage: "/uploads/og-cover.svg",
      }),
      stats: JSON.stringify({
        yearsExperience: 3,
        projectsDelivered: 24,
        technologies: 18,
        clients: 9,
        coffeeCups: 1840,
      }),
    },
  });
  console.log("✓ Profile seeded");

  // --- Skills ---
  const skills = [
    { name: "TypeScript", category: "Frontend", proficiency: 92, icon: "SiTypescript" },
    { name: "React", category: "Frontend", proficiency: 95, icon: "SiReact" },
    { name: "Next.js", category: "Frontend", proficiency: 93, icon: "SiNextdotjs" },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 90, icon: "SiTailwindcss" },
    { name: "Framer Motion", category: "Frontend", proficiency: 82, icon: "SiFramer" },
    { name: "Node.js", category: "Backend", proficiency: 88, icon: "SiNodedotjs" },
    { name: "Express", category: "Backend", proficiency: 85, icon: "SiExpress" },
    { name: "NestJS", category: "Backend", proficiency: 75, icon: "SiNestjs" },
    { name: "GraphQL", category: "Backend", proficiency: 72, icon: "SiGraphql" },
    { name: "REST APIs", category: "Backend", proficiency: 90, icon: "SiOpenapiinitiative" },
    { name: "PostgreSQL", category: "Database", proficiency: 84, icon: "SiPostgresql" },
    { name: "Prisma", category: "Database", proficiency: 88, icon: "SiPrisma" },
    { name: "MongoDB", category: "Database", proficiency: 78, icon: "SiMongodb" },
    { name: "Redis", category: "Database", proficiency: 70, icon: "SiRedis" },
    { name: "Docker", category: "Tools", proficiency: 80, icon: "SiDocker" },
    { name: "Git", category: "Tools", proficiency: 92, icon: "SiGit" },
    { name: "AWS", category: "Tools", proficiency: 68, icon: "SiAmazonaws" },
    { name: "Vercel", category: "Tools", proficiency: 86, icon: "SiVercel" },
  ];
  await prisma.skill.deleteMany({});
  for (let i = 0; i < skills.length; i++) {
    await prisma.skill.create({
      data: { ...skills[i], order: i },
    });
  }
  console.log(`✓ ${skills.length} skills seeded`);

  // --- Experience ---
  const experience = [
    {
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
  await prisma.experience.deleteMany({});
  for (const exp of experience) {
    await prisma.experience.create({
      data: { ...exp, techUsed: JSON.stringify(exp.techUsed) },
    });
  }
  console.log(`✓ ${experience.length} experience entries seeded`);

  // --- Projects ---
  const projects = [
    {
      title: "Aurora Analytics",
      slug: "aurora-analytics",
      description:
        "A real-time product analytics dashboard with custom event tracking, funnel analysis, and beautiful, fast charts.",
      caseStudy:
        "## Problem\nTeams needed a self-serve way to understand user journeys without engineering tickets.\n\n## Solution\nBuilt a Snowflake-ingested event pipeline with a Next.js dashboard rendering sub-100ms queries. Introduced a custom charting layer on top of D3.\n\n## Stack\nNext.js, tRPC, PostgreSQL, Prisma, Redis, D3.js",
      coverImage: "/uploads/project-aurora.svg",
      images: JSON.stringify(["/uploads/project-aurora.svg"]),
      techTags: JSON.stringify(["Next.js", "TypeScript", "tRPC", "PostgreSQL", "D3.js"]),
      liveUrl: "https://example.com/aurora",
      repoUrl: "https://github.com/alexrivera/aurora-analytics",
      isFeatured: true,
      isPublished: true,
      order: 0,
    },
    {
      title: "Lumen Commerce",
      slug: "lumen-commerce",
      description:
        "Headless e-commerce storefront with Stripe checkout, instant search, and a 98 Lighthouse score.",
      caseStudy:
        "## Problem\nA boutique brand's Shopify theme was slow and rigid.\n\n## Solution\nReplatformed to a headless Next.js storefront with Shopify's Storefront API. Achieved 98+ Lighthouse scores and a 40% lift in conversion.\n\n## Stack\nNext.js, Shopify Storefront API, Stripe, Tailwind CSS",
      coverImage: "/uploads/project-lumen.svg",
      images: JSON.stringify(["/uploads/project-lumen.svg"]),
      techTags: JSON.stringify(["Next.js", "Shopify", "Stripe", "Tailwind CSS"]),
      liveUrl: "https://example.com/lumen",
      repoUrl: "https://github.com/alexrivera/lumen-commerce",
      isFeatured: true,
      isPublished: true,
      order: 1,
    },
    {
      title: "Pulse Chat",
      slug: "pulse-chat",
      description:
        "Real-time chat app with typing indicators, presence, and end-to-end message search.",
      caseStudy:
        "## Problem\nA community needed a lightweight, fast chat without the bloat of Discord.\n\n## Solution\nBuilt a Socket.io + Redis pub/sub backend with a Next.js client. Search via Meilisearch returns results in under 50ms across 2M messages.\n\n## Stack\nNext.js, Socket.io, Redis, Meilisearch, Node.js",
      coverImage: "/uploads/project-pulse.svg",
      images: JSON.stringify(["/uploads/project-pulse.svg"]),
      techTags: JSON.stringify(["Next.js", "Socket.io", "Redis", "Node.js"]),
      liveUrl: "https://example.com/pulse",
      repoUrl: "https://github.com/alexrivera/pulse-chat",
      isFeatured: false,
      isPublished: true,
      order: 2,
    },
    {
      title: "Trailhead CMS",
      slug: "trailhead-cms",
      description:
        "A developer-first headless CMS with a block-based editor, role-based access, and a typed SDK.",
      caseStudy:
        "## Problem\nMarketing teams were blocked waiting on engineering for content edits.\n\n## Solution\nBuilt a block-based visual editor with a typed SDK auto-generated from the schema. Publishing went from days to minutes.\n\n## Stack\nNext.js, NestJS, Prisma, PostgreSQL, TipTap",
      coverImage: "/uploads/project-trailhead.svg",
      images: JSON.stringify(["/uploads/project-trailhead.svg"]),
      techTags: JSON.stringify(["Next.js", "NestJS", "Prisma", "TipTap"]),
      liveUrl: "https://example.com/trailhead",
      repoUrl: "https://github.com/alexrivera/trailhead-cms",
      isFeatured: false,
      isPublished: true,
      order: 3,
    },
    {
      title: "Fern Finance",
      slug: "fern-finance",
      description:
        "A personal finance tracker with bank syncing, budget envelopes, and weekly digest emails.",
      caseStudy:
        "## Problem\nExisting budgeting tools felt bloated and ignored privacy.\n\n## Solution\nBuilt a privacy-first tracker with Plaid bank syncing and envelope budgeting. Weekly digest emails keep users engaged without push notifications.\n\n## Stack\nNext.js, Node.js, Plaid, PostgreSQL, Resend",
      coverImage: "/uploads/project-fern.svg",
      images: JSON.stringify(["/uploads/project-fern.svg"]),
      techTags: JSON.stringify(["Next.js", "Node.js", "Plaid", "PostgreSQL"]),
      liveUrl: "https://example.com/fern",
      repoUrl: "https://github.com/alexrivera/fern-finance",
      isFeatured: true,
      isPublished: true,
      order: 4,
    },
    {
      title: "Atlas Docs",
      slug: "atlas-docs",
      description:
        "A documentation site generator with MDX, live code blocks, and instant search.",
      caseStudy:
        "## Problem\nOpen-source projects needed beautiful docs without the maintenance burden.\n\n## Solution\nBuilt an MDX-based docs generator with live editable code blocks and Algolia-style instant search. Deploys are git-push.\n\n## Stack\nNext.js, MDX, TipTap, Algolia",
      coverImage: "/uploads/project-atlas.svg",
      images: JSON.stringify(["/uploads/project-atlas.svg"]),
      techTags: JSON.stringify(["Next.js", "MDX", "Algolia"]),
      liveUrl: "https://example.com/atlas",
      repoUrl: "https://github.com/alexrivera/atlas-docs",
      isFeatured: false,
      isPublished: true,
      order: 5,
    },
  ];
  await prisma.project.deleteMany({});
  for (const p of projects) {
    await prisma.project.create({ data: p });
  }
  console.log(`✓ ${projects.length} projects seeded`);

  // --- Testimonials ---
  const testimonials = [
    {
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
  await prisma.testimonial.deleteMany({});
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`✓ ${testimonials.length} testimonials seeded`);

  // --- Sample messages ---
  await prisma.message.deleteMany({});
  await prisma.message.createMany({
    data: [
      {
        name: "Dana Foster",
        email: "dana@northwind.io",
        message:
          "Hi Alex — we're putting together a small team for a 6-month build and your portfolio stood out. Could we set up a 30-min intro call next week?",
        isRead: false,
      },
      {
        name: "Chris Mehta",
        email: "chris@studio-nine.com",
        message:
          "Loved the Aurora Analytics writeup. Curious whether the event pipeline approach would fit a smaller dataset (~50M rows/month).",
        isRead: true,
      },
      {
        name: "Lena Park",
        email: "lena@designhouse.co",
        message:
          "Your design system work is exactly what our team needs help with right now. Are you available for a contract engagement in Q2?",
        isRead: false,
      },
    ],
  });
  console.log("✓ Messages seeded");

  console.log("\n--- Seed complete ---");
  console.log(`Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
