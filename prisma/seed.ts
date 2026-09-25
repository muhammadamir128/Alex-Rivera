import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "alexrivera@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@alex*2428#";

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
      name: "Muhammad Amir",
    },
  });
  console.log(`✓ Admin seeded: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

  // --- Profile (singleton) ---
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Muhammad Amir",
      title: "Full-Stack Developer",
      tagline:
        "I design and build fast, accessible web products — from the database schema to the last pixel of micro-interaction.",
      bio: "I'm a full-stack developer with 3 years of professional experience building production web applications with React, Next.js, Node.js and PostgreSQL. I care deeply about performance, accessibility, and the small details that make a product feel crafted. When I'm not shipping, I'm exploring design systems, WebGL experiments, and the occasional weekend side project.",
      avatarUrl: "/uploads/avatar.svg",
      socialLinks: JSON.stringify({
        github: "https://github.com/muhammadamir128",
        linkedin: "https://www.linkedin.com/feed/",
        twitter: "https://twitter.com/muhammadamir",
        email: "muhammadamircs47@gmail.com",
        website: "https://muhammadamir.dev",
        cv: "/cv.pdf",
      }),
      seo: JSON.stringify({
        title: "Muhammad Amir — Full-Stack Developer",
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
      title: "Bright Horizon Public School",
      slug: "bright-horizon-public-school",
      description:
        "Premier educational institution portal featuring digital admissions, interactive curriculum guides, fee structures, and an AI-powered school assistant.",
      caseStudy:
        "## Problem\nThe school required a modern, centralized digital presence to streamline admissions, provide parents with transparent academic insights, and automate frequent queries.\n\n## Solution\nEngineered a comprehensive institutional web portal featuring online registration forms, automated fee breakdown calculators, interactive academic syllabi, and an embedded 24/7 AI School Assistant to answer parent inquiries instantly.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, Framer Motion, AI Assistant, PostgreSQL",
      coverImage: "/uploads/project-bright-horizon.webp",
      images: JSON.stringify(["/uploads/project-bright-horizon.webp"]),
      techTags: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS", "AI Assistant", "PostgreSQL"]),
      liveUrl: "https://bright-horizon-public-school.vercel.app/",
      repoUrl: "https://github.com/muhammadamir128/--Bright-Horizon-Public-School",
      isFeatured: true,
      isPublished: true,
      order: 0,
    },
    {
      title: "Al-Shifa Medical Complex",
      slug: "al-shifa-medical-complex",
      description:
        "Modern Hospital Management System (HMS) enabling patient registration, specialist appointment booking, department navigation, and 24/7 emergency response.",
      caseStudy:
        "## Problem\nHealthcare facilities often struggle with fragmented appointment scheduling, congested emergency workflows, and decentralized doctor registries.\n\n## Solution\nDeveloped a full-featured hospital management application featuring multi-department directories (Cardiology, Neurology, Pediatrics, etc.), real-time doctor appointment booking, digital lab report access, and rapid emergency dispatch alerts.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, Lucide Icons, Prisma, PostgreSQL",
      coverImage: "/uploads/project-al-shifa.webp",
      images: JSON.stringify(["/uploads/project-al-shifa.webp"]),
      techTags: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS", "Healthcare HMS", "Prisma"]),
      liveUrl: "https://al-shifa-medical-complex-hopital.vercel.app/",
      repoUrl: "https://github.com/muhammadamir128/al-shifa-medical-complex-hopital",
      isFeatured: true,
      isPublished: true,
      order: 1,
    },
    {
      title: "QanoonPK — Pakistan Legal Directory",
      slug: "qanoon-pk-pakistan-legal-directory",
      description:
        "Bilingual (Urdu & English) legal directory offering searchable federal and provincial statutes, guided law finders, lawyer directories, and legal document templates.",
      caseStudy:
        "## Problem\nAccess to Pakistani legal codes, acts, and verified practitioners was fragmented, archaic, and difficult for citizens and legal scholars to search in both English and Urdu.\n\n## Solution\nBuilt Pakistan's leading open legal database featuring full-text search across federal and provincial laws, an interactive 'Which Law Applies?' finder, court jurisdiction hierarchy visualizations, verified lawyer profiles, and customizable legal document generators.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, Urdu Naskh Typography, Search Engine, Bilingual i18n",
      coverImage: "/uploads/project-qanoon-pk.webp",
      images: JSON.stringify(["/uploads/project-qanoon-pk.webp"]),
      techTags: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS", "Legal Tech", "Bilingual i18n"]),
      liveUrl: "https://qanoon-pk-pakistan-legal-directory.vercel.app/",
      repoUrl: "https://github.com/muhammadamir128/QanoonPK-Pakistan-Legal-Directory",
      isFeatured: true,
      isPublished: true,
      order: 2,
    },
    {
      title: "ToolsGrove — Multi-Tool Utility Suite",
      slug: "tool-grove-two",
      description:
        "High-performance online utility suite featuring 1,000+ client-side tools across PDF conversion, financial calculators, SEO analyzers, text utilities, and developer tools.",
      caseStudy:
        "## Problem\nUsers and developers constantly bounce between bloated, ad-ridden single-purpose tool sites with strict upload limits and slow cloud queues.\n\n## Solution\nArchitected a lightning-fast, zero-signup web toolkit with 15+ tool categories. All computations, PDF manipulations, and format conversions execute client-side using Web Workers and optimized WASM for maximum user privacy and zero server latency.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, Web Workers, Client-Side Processing, SEO Utilities",
      coverImage: "/uploads/project-toolsgrove.webp",
      images: JSON.stringify(["/uploads/project-toolsgrove.webp"]),
      techTags: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS", "Web Workers", "Client-Side Processing"]),
      liveUrl: "https://tool-grove-two.vercel.app/",
      repoUrl: "https://github.com/muhammadamir128/tool-grove-two",
      isFeatured: true,
      isPublished: true,
      order: 3,
    },
    {
      title: "BloodLink — Real-Time Blood Network",
      slug: "blood-link-tau-lyart",
      description:
        "Life-saving emergency blood platform connecting 312+ blood banks, hospitals, and donors with instant SOS broadcasts, live inventory maps, and rapid donor matching.",
      caseStudy:
        "## Problem\nDuring medical emergencies, finding rare blood units in hospitals and independent banks takes hours of manual calling, causing fatal delays.\n\n## Solution\nEngineered a real-time blood availability platform with 1-tap SOS distress beacons, live inventory tracking across blood banks, automated donor notifications, and verified compatibility matching, reducing emergency response time from hours to minutes.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, Geolocation API, Real-Time SOS, Framer Motion",
      coverImage: "/uploads/project-bloodlink.webp",
      images: JSON.stringify(["/uploads/project-bloodlink.webp"]),
      techTags: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS", "Real-Time SOS", "Geolocation"]),
      liveUrl: "https://blood-link-tau-lyart.vercel.app/",
      repoUrl: "https://github.com/muhammadamir128/blood-link-tau-lyart",
      isFeatured: true,
      isPublished: true,
      order: 4,
    },
    {
      title: "Zynora — Fashion & Apparel Boutique",
      slug: "zynore",
      description:
        "Modern e-commerce fashion boutique featuring curated seasonal collections, instant lookbook browsing, size filtering, and a sleek checkout experience.",
      caseStudy:
        "## Problem\nFashion retailers need high-converting, visually immersive storefronts that load instantly and provide frictionless browsing on mobile devices.\n\n## Solution\nCreated an elegant e-commerce experience showcasing dresses, apparel, and fashion accessories with interactive category carousels, responsive lookbook galleries, real-time cart state management, and optimized checkout workflows.\n\n## Stack\nNext.js, TypeScript, Tailwind CSS, E-Commerce, Stripe, Framer Motion",
      coverImage: "/uploads/project-zynora.webp",
      images: JSON.stringify(["/uploads/project-zynora.webp"]),
      techTags: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS", "E-Commerce", "Stripe"]),
      liveUrl: "https://zynore.vercel.app/",
      repoUrl: "https://github.com/muhammadamir128/zynore",
      isFeatured: true,
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

  // --- Sample messages with distributed recent dates ---
  await prisma.message.deleteMany({});
  const now = new Date();
  const sampleMessages = [
    {
      name: "Dana Foster",
      email: "dana@northwind.io",
      message:
        "Hi Alex — we're putting together a small team for a 6-month build and your portfolio stood out. Could we set up a 30-min intro call next week?",
      isRead: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
    {
      name: "Chris Mehta",
      email: "chris@studio-nine.com",
      message:
        "Loved the Aurora Analytics writeup. Curious whether the event pipeline approach would fit a smaller dataset (~50M rows/month).",
      isRead: true,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      name: "Lena Park",
      email: "lena@designhouse.co",
      message:
        "Your design system work is exactly what our team needs help with right now. Are you available for a contract engagement in Q2?",
      isRead: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    },
    {
      name: "Marcus Vance",
      email: "marcus@finscale.tech",
      message:
        "Incredible portfolio! We are scaling our Next.js frontend architecture and would love your consulting guidance.",
      isRead: true,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
    },
    {
      name: "Elena Rostova",
      email: "elena@craftdigital.com",
      message:
        "Hey! Are you currently taking on freelance projects for Q4? Let's connect.",
      isRead: true,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 11), // 11 days ago
    },
  ];

  for (const m of sampleMessages) {
    await prisma.message.create({ data: m });
  }
  console.log(`✓ ${sampleMessages.length} messages seeded with distributed dates`);

  // --- Page Views ---
  await prisma.pageView.deleteMany({});
  const pageViewsData: { path: string; slug: string | null; day: string; createdAt: Date }[] = [];
  const projectSlugs = ["aurora-analytics", "lumen-commerce", "pulse-chat", "trailhead-cms", "fern-finance", "atlas-docs"];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dailyCount = Math.round(8 + Math.sin(i * 0.7) * 5 + (i % 3 === 0 ? 3 : 0));

    for (let c = 0; c < dailyCount; c++) {
      const isProject = Math.random() > 0.4;
      const slug = isProject ? projectSlugs[Math.floor(Math.random() * projectSlugs.length)] : null;
      const path = slug ? `/projects/${slug}` : (Math.random() > 0.5 ? "/" : "/about");
      pageViewsData.push({
        path,
        slug,
        day: ymd,
        createdAt: new Date(d.getTime() + c * 1000 * 60 * 45),
      });
    }
  }
  await prisma.pageView.createMany({ data: pageViewsData });
  console.log(`✓ ${pageViewsData.length} page views seeded across 30 days`);

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
