"use client";

import { Reveal, RevealStagger, RevealItem } from "@/components/site/reveal";
import { CountUp } from "@/components/site/count-up";
import type { ProfileData } from "@/lib/data";

export function About({ profile }: { profile: ProfileData }) {
  const stats = [
    { label: "Years experience", value: profile.stats.yearsExperience ?? 3, suffix: "" },
    { label: "Projects delivered", value: profile.stats.projectsDelivered ?? 0, suffix: "" },
    { label: "Technologies", value: profile.stats.technologies ?? 0, suffix: "+" },
    { label: "Happy clients", value: profile.stats.clients ?? 0, suffix: "" },
  ];

  return (
    <section id="about" className="relative scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Centered Section Header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
              <span className="h-px w-8 bg-blue-400/60" />
              About
              <span className="h-px w-8 bg-blue-400/60" />
            </p>
            <h2 className="gsap-heading-split mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              A developer who sweats the <span className="gradient-text">small details</span>.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          {/* Left: bio + stats */}
          <div>
            <Reveal delay={0.1}>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {profile.bio}
              </p>
            </Reveal>

            <RevealStagger className="mt-8 sm:mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4" stagger={0.08}>
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

          {/* Right: portrait visual */}
          <div className="space-y-4">
            <Reveal delay={0.15}>
              <div
                suppressHydrationWarning
                className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl glass neon-border shadow-2xl bg-gradient-to-b from-blue-500/10 via-violet-500/5 to-transparent select-none"
              >
                {/* Ambient aura glow behind transparent cutout */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(59,130,246,0.3),rgba(139,92,246,0.2),transparent_70%)] opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Transparent cutout portrait */}
                <div
                  role="img"
                  aria-label={profile.name}
                  className="h-full w-full bg-contain bg-bottom bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none select-none relative z-10"
                  style={{
                    backgroundImage: `url("/uploads/about-portrait-transparent.png")`,
                  }}
                />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-20">
                  <div className="rounded-xl glass-strong px-3 py-1.5 border border-white/10 shadow-lg">
                    <p className="font-display text-sm font-semibold text-foreground drop-shadow-sm">{profile.name}</p>
                    <p className="text-[11px] text-muted-foreground">{profile.title || "Full-Stack Developer"}</p>
                  </div>
                  <span className="rounded-full bg-blue-500/10 dark:bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-blue-500 dark:text-blue-300 border border-blue-500/20 dark:border-white/15 shadow-sm">
                    About Me
                  </span>
                </div>
              </div>

              {/* Quick highlight bar */}
              <div className="mt-4 rounded-2xl glass p-3.5 sm:p-4 border border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  Building with precision & craft
                </span>
                <span className="font-mono text-[11px] text-blue-400">Next.js · TypeScript · Node</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
