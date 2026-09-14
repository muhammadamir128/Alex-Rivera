import type { Metadata } from "next";
import Link from "next/link";
import { getProfile, getSkills } from "@/lib/data";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { SkillsExplorer } from "@/components/site/skills-explorer";
import { Layers, Cpu, ShieldAlert, GitBranch, ArrowRight } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: `Skills & Stack | ${profile.name} — ${profile.title}`,
    description: "Explore the modern languages, frameworks, databases, and DevOps tools in my technical arsenal.",
  };
}

export default async function SkillsPage() {
  const [profile, skills] = await Promise.all([getProfile(), getSkills()]);

  const practices = [
    {
      title: "Design System Architecture",
      desc: "Component composition with TailwindCSS, Radix UI primitives, accessible ARIA attributes, and fluid responsive layouts.",
      icon: Layers,
    },
    {
      title: "Type Safety & Validation",
      desc: "Strict TypeScript end-to-end, Zod runtime schema parsing, Prisma ORM type generation, and airtight API contracts.",
      icon: Cpu,
    },
    {
      title: "State & Cache Strategy",
      desc: "Optimistic updates, server-state caching with TanStack React Query, lightweight client state with Zustand, and HTTP caching.",
      icon: GitBranch,
    },
    {
      title: "Security & Defensive Dev",
      desc: "JWT authentication with HTTP-only cookies, automated honeypots, rate-limiting algorithms, and OWASP-compliant headers.",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader name={profile.name} socials={profile.socialLinks} />

      <main className="flex-1 pt-28 pb-20 sm:pt-36 sm:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Skills & Stack</span>
          </div>

          {/* Header section */}
          <div className="mt-8 max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-violet-400">
              <span className="h-px w-8 bg-violet-400/60" />
              Technical Arsenal
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Languages, frameworks & <span className="gradient-text">production tools</span>.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              A comprehensive view of technologies I use daily to architect, build, and deploy production software. Filter by category, search by name, or view proficiency benchmarks.
            </p>
          </div>

          {/* Main interactive skills explorer */}
          <div className="mt-14">
            <SkillsExplorer skills={skills} />
          </div>

          {/* Architectural & Engineering Practices */}
          <div className="mt-28">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
                <span className="h-px w-8 bg-blue-400/60" />
                How I Build
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Engineering standards & best practices
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Beyond syntax and frameworks: how I guarantee speed, accessibility, and long-term code maintainability.
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {practices.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="rounded-2xl glass p-6 transition-all hover:bg-white/[0.06]">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="mt-24 rounded-3xl glass p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Want to see these tools in action?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Check out real-world case studies and production code repositories.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg"
              >
                Browse Projects
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
      <BackToTop />
    </div>
  );
}
