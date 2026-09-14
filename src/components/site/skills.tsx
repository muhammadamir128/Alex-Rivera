"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Code2, Server, Database, Wrench, type LucideIcon } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/components/site/reveal";
import type { SkillData } from "@/lib/data";
import { cn } from "@/lib/utils";

const CATEGORY_META: { key: string; label: string; icon: LucideIcon; color: string }[] = [
  { key: "Frontend", label: "Frontend", icon: Code2, color: "from-blue-500 to-cyan-400" },
  { key: "Backend", label: "Backend", icon: Server, color: "from-violet-500 to-fuchsia-500" },
  { key: "Database", label: "Database", icon: Database, color: "from-emerald-500 to-teal-400" },
  { key: "Tools", label: "Tools", icon: Wrench, color: "from-amber-500 to-orange-400" },
];

export function Skills({ skills }: { skills: SkillData[] }) {
  const grouped = useMemo(() => {
    const map = new Map<string, SkillData[]>();
    for (const s of skills) {
      const arr = map.get(s.category) || [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return CATEGORY_META.map((meta) => ({
      ...meta,
      items: (map.get(meta.key) || []).sort((a, b) => b.proficiency - a.proficiency),
    })).filter((g) => g.items.length > 0);
  }, [skills]);

  return (
    <section id="skills" className="relative scroll-mt-24 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-noise opacity-50" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-violet-400">
            <span className="h-px w-8 bg-violet-400/60" />
            Skills
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            The tools I reach for <span className="gradient-text">first</span>.
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            A focused, opinionated stack refined across production work — measured by how often
            I&apos;d choose them again, not by how many buzzwords fit on a page.
          </p>
        </Reveal>

        <RevealStagger className="mt-12 grid gap-5 sm:grid-cols-2 items-stretch" stagger={0.1}>
          {grouped.map((group) => {
            const Icon = group.icon;
            return (
              <RevealItem key={group.key} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl glass p-6 transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-500/5">
                  <div
                    className={cn(
                      "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-40",
                      group.color
                    )}
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                        group.color
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{group.label}</h3>
                      <p className="text-xs text-muted-foreground">
                        {group.items.length} technologies
                      </p>
                    </div>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3.5">
                    {group.items.map((skill) => {
                      const label =
                        skill.proficiency >= 90
                          ? "Expert"
                          : skill.proficiency >= 75
                          ? "Advanced"
                          : skill.proficiency >= 60
                          ? "Proficient"
                          : "Familiar";
                      return (
                      <li key={skill.id} className="group/skill">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground/90 transition-colors group-hover/skill:text-foreground">
                            {skill.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 sm:inline">
                              {label}
                            </span>
                            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                              {skill.proficiency}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            className={cn(
                              "relative h-full rounded-full bg-gradient-to-r",
                              group.color
                            )}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{
                              duration: 1,
                              delay: 0.1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            <span className="absolute inset-0 shimmer rounded-full opacity-0 group-hover/skill:opacity-100 transition-opacity" />
                          </motion.div>
                        </div>
                      </li>
                      );
                    })}
                  </ul>
                </div>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
