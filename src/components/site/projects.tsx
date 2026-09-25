"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, X, ArrowRight, Star, Search, Lock, Eye, Sparkles } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/components/site/reveal";
import { Tilt } from "@/components/site/magnetic";
import type { ProjectData } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.techTags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProjectData | null>(null);

  const visible = useMemo(() => {
    let result = projects;
    if (filter === "Featured") result = result.filter((p) => p.isFeatured);
    else if (filter !== "All") result = result.filter((p) => p.techTags.includes(filter));
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.techTags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [projects, filter, search]);

  const filters = ["All", "Featured", ...allTags];

  return (
    <section id="work" className="relative scroll-mt-24 py-16 sm:py-24 lg:py-28 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-1/4 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px]" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
                <span className="h-px w-8 bg-blue-400/60" />
                Selected work
              </p>
              <h2 className="mt-3 sm:mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
                Projects that <span className="gradient-text">shipped</span>.
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
              A snapshot of products I&apos;ve designed, built, and maintained end-to-end. Tap any
              card for the full case study.
            </p>
          </div>
        </Reveal>

        {/* filters + search toolbar */}
        <Reveal delay={0.1}>
          <div className="mt-8 sm:mt-10 space-y-4">
            {/* Row 1: Search bar and result count / clear button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative w-full sm:w-72 md:w-80">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects by title, tech..."
                  className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2 pl-10 pr-9 text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-blue-400/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-blue-500/20"
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
                  <span className="font-mono font-medium text-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    {visible.length}
                  </span>
                  <span>of {projects.length}</span>
                  {filter !== "All" && (
                    <span className="hidden xs:inline text-blue-400 font-medium">({filter})</span>
                  )}
                </div>

                {(search || filter !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilter("All");
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors underline underline-offset-4"
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
                      "flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                      filter === tag
                        ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-md shadow-violet-600/30 scale-[1.02]"
                        : "glass text-muted-foreground hover:text-foreground hover:bg-white/[0.08]"
                    )}
                  >
                    {tag}
                    {tag === "Featured" && <Star className="ml-1 inline h-3 w-3 fill-amber-300 text-amber-300" />}
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
                <ProjectCard project={project} onOpen={() => setSelected(project)} />
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

      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function ProjectCard({ project, onOpen }: { project: ProjectData; onOpen: () => void }) {
  const theme = PROJECT_THEMES[project.slug] || {
    glow: "rgba(59, 130, 246, 0.2)",
    badgeBorder: "border-blue-400/30",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-300",
    tagLabel: "Web App",
    domain: project.slug + ".vercel.app",
  };

  return (
    <Tilt max={5} className="h-full w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
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

        {/* Browser window mockup toolbar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-black/50 px-3.5 py-2.5 backdrop-blur-md">
          {/* Traffic light control dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] opacity-80 group-hover:opacity-100 transition-opacity shadow-sm" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] opacity-80 group-hover:opacity-100 transition-opacity shadow-sm" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f] opacity-80 group-hover:opacity-100 transition-opacity shadow-sm" />
          </div>

          {/* Centered URL / Domain bar */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-muted-foreground/80 max-w-[55%] truncate">
            <Lock className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
            <span className="truncate font-mono">{theme.domain}</span>
          </div>

          {/* Live pulsing status badge */}
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="hidden xs:inline tracking-wider font-mono text-[9px]">LIVE</span>
          </div>
        </div>

        {/* Hero preview screenshot */}
        <div className="relative aspect-[16/9.5] w-full overflow-hidden bg-slate-950/60">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-600/30 to-violet-600/30" />
          )}

          {/* Gentle vignette gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-transparent to-transparent opacity-50" />

          {/* Hover backdrop with Quick View badge */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/30 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="h-3.5 w-3.5" />
              View Case Study
            </span>
          </div>
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

          {/* Project Title */}
          <h3 className="font-display text-base sm:text-lg font-bold leading-snug text-foreground group-hover:text-blue-300 transition-colors flex items-start justify-between gap-2">
            <span>{project.title}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-0.5" />
          </h3>

          {/* Project Description */}
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tech stack tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
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

          {/* Action Footer */}
          <div className="mt-5 border-t border-white/[0.08] pt-4 flex items-center justify-between gap-2 mt-auto">
            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-[1.03] active:scale-95 transition-all"
                  aria-label={`Open live preview of ${project.title}`}
                >
                  <ExternalLink className="h-3 w-3" />
                  Live Preview
                </a>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-md hover:bg-white/5"
              >
                Details
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:bg-white/10 hover:text-foreground transition-all"
                  title="View Source Code"
                  aria-label="View source code on GitHub"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: ProjectData | null;
  onClose: () => void;
}) {
  if (!project) return null;

  const theme = PROJECT_THEMES[project.slug] || {
    glow: "rgba(59, 130, 246, 0.2)",
    badgeBorder: "border-blue-400/30",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-300",
    tagLabel: "Web App",
    domain: project.slug + ".vercel.app",
  };

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden w-[calc(100vw-1.25rem)] max-w-[calc(100vw-1.25rem)] sm:max-w-4xl border border-white/10 bg-[#0b1120]/95 p-0 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl text-foreground"
      >
        {/* Sticky modal header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0b1120]/95 px-3.5 sm:px-7 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                "text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0",
                theme.badgeBorder,
                theme.badgeBg,
                theme.badgeText
              )}
            >
              {theme.tagLabel}
            </span>
            <div className="hidden xs:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground font-mono truncate">
              <Lock className="h-3 w-3 text-emerald-400 shrink-0" />
              <span className="truncate">{theme.domain}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/15 hover:text-white transition-all active:scale-95"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3.5 sm:p-7 space-y-5 sm:space-y-6">
          {/* Screenshot in clean browser frame */}
          <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 shadow-xl">
            {/* Browser header */}
            <div className="flex items-center justify-between gap-1.5 border-b border-white/[0.08] bg-black/60 px-3 py-2">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground truncate max-w-[130px] xs:max-w-[200px] sm:max-w-sm text-center">
                https://{theme.domain}/
              </span>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="hidden sm:inline">LIVE</span>
              </div>
            </div>

            {/* Image without dark fading gradient */}
            <div className="relative aspect-[16/9.5] w-full max-h-[380px] bg-slate-950">
              {project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="object-cover object-top"
                  priority
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-600/30 to-violet-600/30" />
              )}
            </div>
          </div>

          {/* Title & Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 pt-1">
            <div className="space-y-1.5 flex-1 min-w-0">
              <DialogTitle className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white break-words">
                {project.title}
              </DialogTitle>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1 w-full sm:w-auto">
              {project.liveUrl && (
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] transition-all flex-1 sm:flex-initial justify-center"
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                    Visit Live Site
                  </a>
                </Button>
              )}
              {project.repoUrl && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground hover:bg-white/10 flex-1 sm:flex-initial justify-center"
                >
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                    Code
                  </a>
                </Button>
              )}
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground justify-center"
              >
                <Link href={`/projects/${project.slug}`}>
                  <ArrowUpRight className="mr-1 h-3.5 w-3.5 shrink-0" />
                  Details
                </Link>
              </Button>
            </div>
          </div>

          {/* Tech Tags */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-white/[0.08]">
            <span className="text-xs font-medium text-muted-foreground mr-1">Technologies:</span>
            {project.techTags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-medium text-foreground/90"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Case study structured section */}
          {project.caseStudy && (
            <div className="pt-2 border-t border-white/[0.08]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                Case Study Breakdown
              </h4>
              <CaseStudyMarkdown source={project.caseStudy} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CaseStudyMarkdown({ source }: { source: string }) {
  // Split by ## headers
  const rawSections = source.split(/\n(?=##\s+)/);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rawSections.map((sec, i) => {
        const trimmed = sec.trim();
        if (!trimmed) return null;
        const lines = trimmed.split("\n");
        const header = lines[0].replace(/^##\s*/, "").trim();
        const bodyLines = lines.slice(1);
        const bodyText = bodyLines.join("\n").trim();

        const isProblem = /problem|challenge/i.test(header);
        const isSolution = /solution|approach|result/i.test(header);
        const isStack = /stack|technolog/i.test(header);

        return (
          <div
            key={i}
            className={cn(
              "rounded-xl sm:rounded-2xl border p-3.5 sm:p-5 backdrop-blur-md space-y-2 transition-all min-w-0 overflow-hidden",
              isProblem && "border-amber-500/20 bg-amber-500/[0.04]",
              isSolution && "border-blue-500/20 bg-blue-500/[0.04] md:col-span-2",
              isStack && "border-violet-500/20 bg-violet-500/[0.04]",
              !isProblem && !isSolution && !isStack && "border-white/10 bg-white/[0.03]"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  isProblem && "bg-amber-400 shadow-sm shadow-amber-400/50",
                  isSolution && "bg-blue-400 shadow-sm shadow-blue-400/50",
                  isStack && "bg-violet-400 shadow-sm shadow-violet-400/50",
                  !isProblem && !isSolution && !isStack && "bg-white/40"
                )}
              />
              <h5 className="font-display font-semibold text-sm sm:text-base text-foreground truncate">
                {header}
              </h5>
            </div>

            <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line break-words">
              {bodyText}
            </div>
          </div>
        );
      })}
    </div>
  );
}
