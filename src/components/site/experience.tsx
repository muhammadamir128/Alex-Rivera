"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/components/site/reveal";
import type { ExperienceData } from "@/lib/data";
import { cn } from "@/lib/utils";

function formatRange(start: string, end: string | null, current: boolean): string {
  const fmt = (s: string) => {
    if (!s) return "";
    const [y, m] = s.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mi = Math.max(0, Math.min(11, parseInt(m || "1", 10) - 1));
    return `${months[mi]} ${y}`;
  };
  return `${fmt(start)} — ${current ? "Present" : end ? fmt(end) : "Present"}`;
}

function calcDuration(start: string, end: string | null, current: boolean): string {
  if (!start) return "";
  const [sy, sm] = start.split("-").map(Number);
  let ey: number, em: number;
  if (current || !end) {
    const now = new Date();
    ey = now.getFullYear();
    em = now.getMonth() + 1;
  } else {
    [ey, em] = end.split("-").map(Number);
  }
  const totalMonths = (ey - sy) * 12 + (em - sm);
  if (totalMonths < 0) return "";
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}y`;
  return `${years}y ${months}mo`;
}

export function Experience({ items }: { items: ExperienceData[] }) {
  return (
    <section id="experience" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
            <span className="h-px w-8 bg-cyan-400/60" />
            Experience
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Three years, <span className="gradient-text">one trajectory</span>.
          </h2>
        </Reveal>

        <div className="mt-14 relative">
          {/* vertical line */}
          <div
            aria-hidden
            className="absolute left-[18px] sm:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent"
          />

          <RevealStagger className="space-y-10 sm:space-y-16" stagger={0.12}>
            {items.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <RevealItem key={exp.id}>
                  <div
                    className={cn(
                      "relative grid sm:grid-cols-2 gap-x-12 gap-y-4",
                      isLeft ? "" : "sm:[direction:rtl]"
                    )}
                  >
                    {/* node dot */}
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                      className="absolute left-[10px] sm:left-1/2 top-2 z-10 grid h-4 w-4 -translate-x-1/2 place-items-center"
                    >
                      <span className="absolute h-4 w-4 rounded-full bg-blue-500/30 animate-ping" />
                      <span className="relative h-3 w-3 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 ring-4 ring-[#0a0e1a]" />
                    </motion.span>

                    {/* card */}
                    <div className={cn("pl-10 sm:pl-0 sm:[direction:ltr]", isLeft ? "sm:pr-12" : "sm:col-start-2 sm:pl-12")}>
                      <div className="group relative overflow-hidden rounded-2xl glass p-5 transition-all hover:bg-white/[0.06] hover:shadow-xl hover:shadow-blue-500/5">
                        <div className="absolute -left-8 top-0 h-full w-px bg-gradient-to-b from-blue-500/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-blue-400" />
                              <h3 className="font-display text-lg font-semibold leading-tight">
                                {exp.role}
                              </h3>
                            </div>
                            <p className="mt-1 text-sm font-medium text-violet-300">
                              {exp.company}
                              {exp.location && (
                                <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {exp.location}
                                </span>
                              )}
                            </p>
                          </div>
                          {exp.current && (
                            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-500/20">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatRange(exp.startDate, exp.endDate, exp.current)}
                          </span>
                          {(() => {
                            const dur = calcDuration(exp.startDate, exp.endDate, exp.current);
                            return dur ? (
                              <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] font-medium text-blue-300/80">
                                {dur}
                              </span>
                            ) : null;
                          })()}
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                          {exp.description}
                        </p>

                        {exp.techUsed.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {exp.techUsed.map((t) => (
                              <span
                                key={t}
                                className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-foreground/70 ring-1 ring-white/10"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
