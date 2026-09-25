"use client";

import { Reveal, RevealStagger, RevealItem } from "@/components/site/reveal";
import { CountUp } from "@/components/site/count-up";
import { GraduationCap, ArrowRight } from "lucide-react";
import type { ProfileData } from "@/lib/data";

export function About({ profile }: { profile: ProfileData }) {
  const stats = [
    { label: "Years experience", value: profile.stats.yearsExperience ?? 3, suffix: "" },
    { label: "Projects delivered", value: profile.stats.projectsDelivered ?? 0, suffix: "" },
    { label: "Technologies", value: profile.stats.technologies ?? 0, suffix: "+" },
    { label: "Happy clients", value: profile.stats.clients ?? 0, suffix: "" },
  ];

  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          {/* Left: section label & visual */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <Reveal>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
                <span className="h-px w-8 bg-blue-400/60" />
                About
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                A developer who sweats the <span className="gradient-text">small details</span>.
              </h2>
            </Reveal>

            {/* Featured workspace/setup image */}
            <Reveal delay={0.15}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-3xl glass neon-border shadow-xl bg-slate-950">
                <img
                  src="/uploads/project-bright-horizon.webp"
                  alt="Bright Horizon Public School"
                  className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <span className="font-mono text-[11px] text-blue-300">Bright Horizon Public School</span>
                  <span className="rounded-full glass-strong px-2.5 py-0.5 text-[10px] text-white/80">
                    Featured Project
                  </span>
                </div>
              </div>

              {/* Project Specs Card */}
              <div className="mt-4 rounded-2xl glass p-4 sm:p-5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm text-foreground">Bright Horizon Public School</h3>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground">Academic Platform & AI Assistant</p>
                    </div>
                  </div>
                  <a
                    href="https://bright-horizon-public-school.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <span>Live</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-white/5">
                  <li className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span>Frontend & UI</span>
                    <span className="font-medium text-foreground">Next.js 15, TypeScript, TailwindCSS</span>
                  </li>
                  <li className="flex items-center justify-between py-0.5 border-b border-white/5">
                    <span>Key Innovations</span>
                    <span className="font-medium text-foreground">Online Admissions & AI Assistant</span>
                  </li>
                  <li className="flex items-center justify-between py-0.5">
                    <span>Deployment</span>
                    <span className="font-medium text-foreground">Vercel Edge Network</span>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Right: bio + stats */}
          <div>
            <Reveal delay={0.1}>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {profile.bio}
              </p>
            </Reveal>

            <RevealStagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4" stagger={0.08}>
              {stats.map((stat) => (
                <RevealItem key={stat.label}>
                  <div className="group relative overflow-hidden rounded-2xl glass p-4 transition-all duration-300 hover:bg-white/[0.06] hover:-translate-y-0.5">
                    <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-blue-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-60" />
                    <div className="font-display text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-4xl">
                      <CountUp value={Number(stat.value) || 0} />
                      <span className="gradient-text">{stat.suffix}</span>
                    </div>
                    <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealStagger>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Faisalabad, Pakistan · UTC+5
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Open to freelance
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  Replies within 24h
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
