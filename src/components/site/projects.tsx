"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Star, Search } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { Tilt } from "@/components/site/magnetic";
import type { ProjectData } from "@/lib/data";
import { cn } from "@/lib/utils";

const PROJECT_THEMES: Record<
  string,
  {
    glow: string;
    badgeBorder: string;
    badgeBg: string;
    badgeText: string;
    tagLabel: string;
    domain: string;
  }
> = {
  "bright-horizon-public-school": {
    glow: "rgba(59, 130, 246, 0.2)",
    badgeBorder: "border-blue-400/30",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-300",
    tagLabel: "Education & AI",
    domain: "brighthorizon.edu",
  },
  "al-shifa-medical-complex": {
    glow: "rgba(16, 185, 129, 0.2)",
    badgeBorder: "border-emerald-400/30",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-300",
    tagLabel: "Healthcare & HMS",
    domain: "alshifa-hospital.org",
  },
  "qanoon-pk-pakistan-legal-directory": {
    glow: "rgba(245, 158, 11, 0.2)",
    badgeBorder: "border-amber-400/30",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-300",
    tagLabel: "Legal Directory",
    domain: "qanoonpk.org",
  },
  "tool-grove-two": {
    glow: "rgba(139, 92, 246, 0.2)",
    badgeBorder: "border-violet-400/30",
    badgeBg: "bg-violet-500/10",
    badgeText: "text-violet-300",
    tagLabel: "Utility Suite",
    domain: "toolsgrove.dev",
  },
  "blood-link-tau-lyart": {
    glow: "rgba(244, 63, 94, 0.2)",
    badgeBorder: "border-rose-400/30",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-300",
    tagLabel: "Real-Time SOS",
    domain: "bloodlink.app",
  },
  "zynore": {
    glow: "rgba(236, 72, 153, 0.2)",
    badgeBorder: "border-pink-400/30",
    badgeBg: "bg-pink-500/10",
    badgeText: "text-pink-300",
    tagLabel: "E-Commerce",
    domain: "zynora.shop",
  },
};

export function Projects({ projects }: { projects: ProjectData[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      const cat = PROJECT_THEMES[p.slug]?.tagLabel;
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [projects]);

  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    let result = projects;
    if (filter !== "All") {
      result = result.filter((p) => {
        const cat = PROJECT_THEMES[p.slug]?.tagLabel;
        return cat?.toLowerCase() === filter.toLowerCase();
      });
    }
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          PROJECT_THEMES[p.slug]?.tagLabel.toLowerCase().includes(q) ||
          p.techTags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [projects, filter, search]);

  const filters = ["All", ...categories];

  return (
    <section id="work" className="relative scroll-mt-24 py-12 sm:py-16 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-1/4 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px]" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
              <span className="h-px w-8 bg-blue-400/60" />
              Selected work
              <span className="h-px w-8 bg-blue-400/60" />
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              Projects that <span className="gradient-text">shipped</span>.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              A snapshot of products I&apos;ve designed, built, and maintained end-to-end.
            </p>
          </div>
        </Reveal>

        {/* filters + search toolbar */}
        <Reveal delay={0.1}>
          <div className="mt-6 sm:mt-8 space-y-4">
            {/* Row 1: Search bar and result count / clear button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative w-full sm:w-72 md:w-80">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects by title, tech..."
                  className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] py-2 pl-10 pr-9 text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/[0.08] focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Status / count / reset */}
              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span>Showing</span>
                  <span className="font-mono font-medium text-foreground bg-slate-200/60 dark:bg-white/5 px-2 py-0.5 rounded-full border border-slate-300/60 dark:border-white/5">
                    {visible.length}
                  </span>
                  <span>of {projects.length}</span>
                  {filter !== "All" && (
                    <span className="hidden xs:inline text-blue-500 dark:text-blue-400 font-medium">({filter})</span>
                  )}
                </div>

                {(search || filter !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilter("All");
                    }}
                    className="text-xs text-blue-500 dark:text-blue-400 hover:underline font-medium transition-colors underline-offset-4"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: Filter tags */}
            <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 sm:pb-0 sm:flex-wrap scrollbar-none [mask-image:linear-gradient(to_right,black_90%,transparent_100%)] sm:[mask-image:none]">
                {filters.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilter(tag)}
                    className={cn(
                      "flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer",
                      filter === tag
                        ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-md shadow-violet-600/30 scale-[1.02]"
                        : "glass text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-white/[0.08]"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* clean symmetric responsive 3-column grid */}
        <motion.div
          layout
          className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="flex flex-col h-full min-h-0"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* empty state */}
        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-col items-center justify-center rounded-2xl glass py-16 text-center"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
              No projects found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different search term or clear the filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setFilter("All");
              }}
              className="mt-4 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-1.5 text-xs font-medium text-white shadow-lg shadow-violet-600/20 transition-opacity hover:opacity-90"
            >
              Reset filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectData }) {
  const router = useRouter();
  const theme = PROJECT_THEMES[project.slug] || {
    glow: "rgba(59, 130, 246, 0.2)",
    badgeBorder: "border-blue-400/30",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-300",
    tagLabel: "Web App",
    domain: project.slug + ".vercel.app",
  };

  const handleCardClick = () => {
    router.push(`/projects/${project.slug}`);
  };

  return (
    <Tilt max={5} className="h-full w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0c1322]/90 backdrop-blur-xl text-left transition-all duration-300 hover:border-white/20 hover:bg-[#101930]/95 hover:shadow-2xl cursor-pointer"
        style={{
          boxShadow: `0 10px 30px -10px rgba(0, 0, 0, 0.5)`,
        }}
      >
        {/* Ambient colored backdrop glow on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 -z-10 blur-xl"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${theme.glow} 0%, transparent 70%)`,
          }}
        />

        {/* Hero preview screenshot */}
        <div
          suppressHydrationWarning
          className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950/60 border-b border-white/[0.06] select-none"
        >
          {project.coverImage ? (
            <div
              role="img"
              aria-label={project.title}
              className="h-full w-full bg-cover bg-top transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none select-none"
              style={{
                backgroundImage: `url("${project.coverImage}")`,
              }}
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-600/30 to-violet-600/30" />
          )}

          {/* Gentle vignette gradient overlay & event barrier */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-transparent to-transparent opacity-40 z-10 pointer-events-auto" />
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-5">
          {/* Top metadata tags */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border",
                theme.badgeBorder,
                theme.badgeBg,
                theme.badgeText
              )}
            >
              {theme.tagLabel}
            </span>

            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                Featured
              </span>
            )}
          </div>

          {/* Project Title and External Vercel Link Icon */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base sm:text-lg font-bold leading-snug text-foreground group-hover:text-blue-300 transition-colors">
              {project.title}
            </h3>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Open live site on Vercel"
                aria-label={`Open ${project.title} on Vercel`}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-all hover:scale-110 hover:border-blue-400/40 hover:bg-blue-500/20 hover:text-blue-300 active:scale-95"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Project Description */}
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tech stack tags */}
          <div className="mt-4 flex flex-wrap gap-1.5 mt-auto pt-2">
            {project.techTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-foreground/80"
              >
                {tag}
              </span>
            ))}
            {project.techTags.length > 3 && (
              <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-1.5 py-0.5 text-[11px] text-muted-foreground">
                +{project.techTags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Tilt>
  );
}
