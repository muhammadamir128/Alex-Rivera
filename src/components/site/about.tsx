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
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          {/* Left: section label */}
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
                <span className="h-px w-8 bg-blue-400/60" />
                About
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                A developer who sweats the <span className="gradient-text">small details</span>.
              </h2>
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
                      <CountUp value={stat.value} />
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
                  Based remote · UTC+1
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
