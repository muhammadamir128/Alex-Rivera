"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Server, Database, Wrench, Search, X, CheckCircle2, Sparkles, Filter } from "lucide-react";
import type { SkillData } from "@/lib/data";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "All", label: "All Skills", icon: Filter, color: "from-blue-500 to-violet-600" },
  { key: "Frontend", label: "Frontend", icon: Code2, color: "from-blue-500 to-cyan-400" },
  { key: "Backend", label: "Backend", icon: Server, color: "from-violet-500 to-fuchsia-500" },
  { key: "Database", label: "Database", icon: Database, color: "from-emerald-500 to-teal-400" },
  { key: "Tools", label: "Tools & DevOps", icon: Wrench, color: "from-amber-500 to-orange-400" },
];

export function SkillsExplorer({ skills }: { skills: SkillData[] }) {
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"proficiency" | "name">("proficiency");

  const filtered = useMemo(() => {
    let list = skills;
    if (selectedCat !== "All") {
      list = list.filter((s) => s.category.toLowerCase() === selectedCat.toLowerCase());
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      if (sortBy === "proficiency") return b.proficiency - a.proficiency;
      return a.name.localeCompare(b.name);
    });
  }, [skills, selectedCat, search, sortBy]);

  const stats = useMemo(() => {
    const total = skills.length;
    const expertCount = skills.filter((s) => s.proficiency >= 85).length;
    const avgProf = total > 0 ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / total) : 0;
    return { total, expertCount, avgProf };
  }, [skills]);

  return (
    <div className="space-y-10">
      {/* Top statistics cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl glass p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Total Technologies</div>
          <div className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums sm:text-4xl">
            {stats.total}
          </div>
          <p className="mt-1 text-xs text-blue-400">Across full lifecycle</p>
        </div>
        <div className="rounded-2xl glass p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Expert / Production Level</div>
          <div className="mt-2 font-display text-3xl font-bold text-emerald-400 tabular-nums sm:text-4xl">
            {stats.expertCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">85%+ proficiency score</p>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-2xl glass p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Average Stack Mastery</div>
          <div className="mt-2 font-display text-3xl font-bold text-violet-400 tabular-nums sm:text-4xl">
            {stats.avgProf}%
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Calculated across all tools</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = selectedCat === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedCat(c.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all",
                  active
                    ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-600/25 scale-[1.02]"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-white/[0.08]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Search and Sort controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skill (e.g. React, Docker)..."
              className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2 pl-9 pr-8 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-blue-400/50 focus:bg-white/[0.05]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 grid h-4 w-4 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1 glass rounded-full p-1 text-xs">
            <button
              onClick={() => setSortBy("proficiency")}
              className={cn(
                "rounded-full px-3 py-1 text-xs transition-colors",
                sortBy === "proficiency" ? "bg-white/10 text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Proficiency
            </button>
            <button
              onClick={() => setSortBy("name")}
              className={cn(
                "rounded-full px-3 py-1 text-xs transition-colors",
                sortBy === "name" ? "bg-white/10 text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              A-Z
            </button>
          </div>
        </div>
      </div>

      {/* Active filters count */}
      {(search || selectedCat !== "All") && (
        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> technologies
          {selectedCat !== "All" && <span> in <span className="text-blue-400">{selectedCat}</span></span>}
          {search && <span> matching &ldquo;<span className="text-foreground">{search}</span>&rdquo;</span>}
        </div>
      )}

      {/* Skills Grid */}
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((skill) => {
            const level =
              skill.proficiency >= 90
                ? "Expert"
                : skill.proficiency >= 75
                ? "Advanced"
                : skill.proficiency >= 60
                ? "Proficient"
                : "Familiar";

            const catColor =
              skill.category.toLowerCase() === "frontend"
                ? "from-blue-500 to-cyan-400"
                : skill.category.toLowerCase() === "backend"
                ? "from-violet-500 to-fuchsia-500"
                : skill.category.toLowerCase() === "database"
                ? "from-emerald-500 to-teal-400"
                : "from-amber-500 to-orange-400";

            return (
              <motion.div
                layout
                key={skill.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative overflow-hidden rounded-2xl glass p-5 transition-all hover:bg-white/[0.06] hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground group-hover:text-blue-300 transition-colors">
                      {skill.name}
                    </h3>
                    <span className="inline-block mt-0.5 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {skill.category}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-foreground tabular-nums">
                      {skill.proficiency}%
                    </span>
                    <span className="block text-[10px] font-medium text-blue-400 uppercase tracking-wider">
                      {level}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className={cn("h-full rounded-full bg-gradient-to-r", catColor)}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="rounded-2xl glass p-12 text-center">
          <div className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-white/5 text-muted-foreground">
            <Search className="h-6 w-6" />
          </div>
          <p className="mt-4 font-semibold text-foreground">No technologies found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search query or reset category filter.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCat("All");
            }}
            className="mt-4 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
