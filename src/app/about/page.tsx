import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProfile } from "@/lib/data";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { CountUp } from "@/components/site/count-up";
import { Reveal, RevealStagger, RevealItem } from "@/components/site/reveal";
import {
  Code2,
  Sparkles,
  Zap,
  ShieldCheck,
  Coffee,
  HeartHandshake,
  ArrowRight,
  Download,
  MapPin,
  Clock,
  Laptop,
} from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: `About | ${profile.name} — ${profile.title}`,
    description: profile.bio || "Learn more about my journey, values, and engineering philosophy.",
  };
}

export default async function AboutPage() {
  const profile = await getProfile();

  const stats = [
    { label: "Years Experience", value: profile.stats.yearsExperience ?? 3, suffix: "+" },
    { label: "Projects Shipped", value: profile.stats.projectsDelivered ?? 12, suffix: "" },
    { label: "Technologies Mastered", value: profile.stats.technologies ?? 16, suffix: "+" },
    { label: "Happy Clients & Teams", value: profile.stats.clients ?? 8, suffix: "" },
  ];

  const principles = [
    {
      icon: Zap,
      title: "Performance First",
      desc: "Sub-second load times, optimized server components, lean bundle sizes, and fluid 60fps animations.",
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: Code2,
      title: "Clean, Scalable Architecture",
      desc: "Type-safe end-to-end codebases built with modern patterns, clear boundaries, and maintainable data models.",
      color: "from-blue-400 to-indigo-500",
    },
    {
      icon: Sparkles,
      title: "Pixel-Perfect Delight",
      desc: "Attention to micro-interactions, dark mode harmony, typography hierarchy, and effortless accessibility.",
      color: "from-violet-400 to-fuchsia-500",
    },
    {
      icon: ShieldCheck,
      title: "Reliability & Rigor",
      desc: "Defensive programming with strict validation (Zod), reliable session management, and robust error recovery.",
      color: "from-emerald-400 to-teal-500",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader name={profile.name} socials={profile.socialLinks} />

      <main className="flex-1 pt-28 pb-20 sm:pt-36 sm:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Breadcrumb & Top Label */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">About</span>
          </div>

          {/* Hero section */}
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-blue-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for freelance & full-time roles
              </div>

              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Crafting digital experiences with <span className="gradient-text">intent & passion</span>.
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {profile.bio}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-violet-600/50 hover:scale-[1.02]"
                >
                  Let&apos;s work together
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
                >
                  Explore my projects
                </Link>
              </div>
            </div>

            {/* Avatar & Card */}
            <div className="relative mx-auto w-full max-w-md lg:mx-0">
              <div className="relative aspect-square overflow-hidden rounded-3xl glass p-3 ring-1 ring-white/15 shadow-2xl shadow-blue-500/10">
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.name}
                      fill
                      priority
                      className="object-cover transition-transform duration-300"
                      style={{
                        objectPosition: `${profile.stats?.avatarPosX ?? 50}% ${profile.stats?.avatarPosY ?? 15}%`,
                        transform:
                          profile.stats?.avatarZoom && Number(profile.stats.avatarZoom) !== 100
                            ? `scale(${Number(profile.stats.avatarZoom) / 100})`
                            : undefined,
                      }}
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-600/40 via-violet-600/30 to-background text-6xl font-bold text-white">
                      {profile.name[0]}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-between rounded-xl glass-strong p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-blue-400" />
                      <span>Remote · UTC+1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-violet-400" />
                      <span>Fast turnaround</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-2xl glass p-6 transition-all duration-300 hover:bg-white/[0.06] hover:-translate-y-0.5"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all" />
                <div className="font-display text-4xl font-bold tracking-tight text-foreground tabular-nums sm:text-5xl">
                  <CountUp value={Number(s.value) || 0} />
                  <span className="gradient-text">{s.suffix}</span>
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Story & Background Section */}
          <div className="mt-28 grid gap-12 lg:grid-cols-2">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
                <span className="h-px w-8 bg-blue-400/60" />
                Background
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Turning ideas into tangible, <span className="gradient-text">high-impact</span> software.
              </h2>
              <p>
                My journey into software development started with a deep curiosity for how digital products could feel both effortless to use and impeccably engineered under the hood. Over the years, that curiosity evolved into a dedicated career building full-stack applications.
              </p>
              <p>
                Whether it&apos;s architecting real-time collaboration tools, tuning database queries for SQLite and PostgreSQL, or designing micro-interactions that make a design system sing, I treat every project with meticulous care.
              </p>
              <p>
                I thrive in environments where engineering standards meet creative product thinking. I believe great software isn&apos;t just about writing code; it&apos;s about clear communication, user empathy, and relentless focus on problem solving.
              </p>
            </div>

            {/* Quick facts & setup */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl glass p-6">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl mb-5 shadow-lg border border-white/5">
                  <img
                    src="/uploads/workspace.jpg"
                    alt="Developer Workspace"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-3 rounded-full glass-strong px-2.5 py-0.5 text-[10px] font-mono text-blue-300">
                    Daily Dev Environment
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Laptop className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Current Setup</h3>
                    <p className="text-xs text-muted-foreground">Modern web tools & daily drivers</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span>Primary Stack</span>
                    <span className="font-medium text-foreground">Next.js 16, TypeScript, TailwindCSS</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span>Backend & Database</span>
                    <span className="font-medium text-foreground">Node.js, Prisma, PostgreSQL / SQLite</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span>State & Realtime</span>
                    <span className="font-medium text-foreground">Zustand, React Query, WebSockets</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Deployments</span>
                    <span className="font-medium text-foreground">Vercel, Docker, Cloudflare</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl glass p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Coffee className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Beyond the Terminal</h3>
                    <p className="text-xs text-muted-foreground">When I&apos;m not writing code</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  You can find me researching developer ergonomics, testing typography pairings, contributing to open-source discussions, or enjoying a slow cup of pour-over coffee while reading about distributed systems.
                </p>
              </div>
            </div>
          </div>

          {/* Engineering Principles */}
          <div className="mt-28">
            <div className="text-center max-w-2xl mx-auto">
              <p className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-violet-400">
                <span className="h-px w-8 bg-violet-400/60" />
                Guiding Values
                <span className="h-px w-8 bg-violet-400/60" />
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                The standards that shape my work
              </h2>
              <p className="mt-3 text-muted-foreground text-sm">
                Four bedrock principles applied to every line of code, component interface, and project milestone.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="group relative overflow-hidden rounded-3xl glass p-6 transition-all duration-300 hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-foreground shadow-inner">
                      <Icon className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-28 overflow-hidden rounded-3xl glass p-8 sm:p-12 text-center relative">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-violet-500/15 blur-3xl" />
            
            <div className="relative max-w-xl mx-auto">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to bring your next product to life?
              </h2>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                Whether you need a complete web application built from zero, an existing frontend elevated, or advice on scalable architecture, let&apos;s talk.
              </p>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-violet-600/50"
                >
                  Start a Conversation
                </Link>
                <Link
                  href="/skills"
                  className="rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
                >
                  Review Tech Stack
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
      <WhatsAppButton phone={profile.socialLinks?.whatsapp || "923069609884"} />
      <BackToTop />
    </div>
  );
}
