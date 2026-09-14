import type { Metadata } from "next";
import Link from "next/link";
import { getProfile, getExperience } from "@/lib/data";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { Experience } from "@/components/site/experience";
import { Briefcase, Calendar, Award, Rocket, CheckCircle2, ArrowRight } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: `Experience & Career | ${profile.name} — ${profile.title}`,
    description: "Detailed timeline of professional software engineering roles, team contributions, and technical leadership.",
  };
}

export default async function ExperiencePage() {
  const [profile, experience] = await Promise.all([getProfile(), getExperience()]);

  const milestones = [
    {
      title: "End-to-End Ownership",
      desc: "Spearheaded products from initial schema design and wireframes to production deployment and monitoring.",
      icon: Rocket,
    },
    {
      title: "Architecture & Scaling",
      desc: "Designed resilient relational and document schemas, API micro-services, and edge caching pipelines.",
      icon: Award,
    },
    {
      title: "Cross-Functional Collaboration",
      desc: "Partnered closely with product designers, stakeholders, and QA teams to ship features on predictable cycles.",
      icon: CheckCircle2,
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
            <span className="text-foreground font-medium">Experience</span>
          </div>

          {/* Header section */}
          <div className="mt-8 max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
              <span className="h-px w-8 bg-cyan-400/60" />
              Career Journey
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Proven impact, <span className="gradient-text">step by step</span>.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              A comprehensive record of my engineering positions, leadership milestones, and the technologies I leveraged to solve real business challenges.
            </p>
          </div>

          {/* Top highlight stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Briefcase className="h-4 w-4 text-cyan-400" />
                Positions Held
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums">
                {experience.length}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Engineering roles & contracts</p>
            </div>

            <div className="rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-4 w-4 text-blue-400" />
                Experience
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums">
                {profile.stats.yearsExperience ?? 3}+ Years
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Continuous commercial delivery</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Rocket className="h-4 w-4 text-emerald-400" />
                Status
              </div>
              <div className="mt-2 font-display text-2xl font-bold text-emerald-400">
                Available
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Open to remote engagements</p>
            </div>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="-mt-8">
          <Experience items={experience} />
        </div>

        {/* Milestones / Impact Highlights */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-16">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-violet-400">
              <span className="h-px w-8 bg-violet-400/60" />
              Key Strengths
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              What I bring to every engineering team
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Core leadership qualities demonstrated throughout every chapter of my career.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {milestones.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="rounded-2xl glass p-6 transition-all hover:bg-white/[0.06]">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA Card */}
          <div className="mt-20 overflow-hidden rounded-3xl glass p-8 sm:p-12 text-center relative">
            <div className="relative max-w-xl mx-auto">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Interested in working together?
              </h2>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                I am currently open to consulting engagements, contract projects, and full-time senior engineering opportunities.
              </p>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-violet-600/50 hover:scale-[1.02]"
                >
                  Reach Out
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/testimonials"
                  className="rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
                >
                  Read Recommendations
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
