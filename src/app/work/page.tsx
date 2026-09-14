import type { Metadata } from "next";
import Link from "next/link";
import { getProfile, getProjects } from "@/lib/data";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { Projects } from "@/components/site/projects";
import { ArrowRight, Code2, Sparkles, Star } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: `Work & Projects | ${profile.name} — ${profile.title}`,
    description: "Explore selected production web applications, open-source tools, and deep-dive case studies.",
  };
}

export default async function WorkPage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);

  const featuredCount = projects.filter((p) => p.isFeatured).length;
  const allTags = Array.from(new Set(projects.flatMap((p) => p.techTags)));

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader name={profile.name} socials={profile.socialLinks} />

      <main className="flex-1 pt-28 pb-20 sm:pt-36 sm:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Work</span>
          </div>

          {/* Page Intro Banner */}
          <div className="mt-8 max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
              <span className="h-px w-8 bg-blue-400/60" />
              Selected Portfolio
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Crafted with purpose, <span className="gradient-text">built for scale</span>.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Explore real-world software applications I&apos;ve engineered end-to-end. Click any project card to inspect the interactive modal, or view the dedicated case study for architecture decisions, performance benchmarks, and live demo links.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Code2 className="h-4 w-4 text-blue-400" />
                Shipped Projects
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums">
                {projects.length}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Production web applications</p>
            </div>

            <div className="rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                Featured Builds
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums">
                {featuredCount}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Highlighted key deliverables</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-4 w-4 text-violet-400" />
                Stack Diversity
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums">
                {allTags.length}+
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Specialized libraries & tools</p>
            </div>
          </div>
        </div>

        {/* Projects Component with search & filters */}
        <div className="-mt-12">
          <Projects projects={projects} />
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-16">
          <div className="overflow-hidden rounded-3xl glass p-8 sm:p-12 text-center relative">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-violet-500/15 blur-3xl" />
            
            <div className="relative max-w-xl mx-auto">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Have an ambitious idea in mind?
              </h2>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                I help startups and businesses build bespoke digital products that are fast, intuitive, and future-proof.
              </p>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-violet-600/50 hover:scale-[1.02]"
                >
                  Discuss Your Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/experience"
                  className="rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
                >
                  View Career Path
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
      <BackToTop />
    </div>
  );
}
