"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, X, ArrowRight, Star, Search } from "lucide-react";
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

            {/* Row 2: Filter tags - scrollable on mobile with snap, clean flex-wrap on tablet/desktop */}
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

        {/* grid — asymmetric with dense auto-flow */}
        <motion.div
          layout
          className="mt-8 sm:mt-10 grid auto-rows-[1fr] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 [grid-auto-flow:dense]"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={cn(
                  "min-h-0",
                  // featured projects take 2 columns on lg, creating a masonry rhythm
                  project.isFeatured && "lg:col-span-2"
                )}
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
  return (
    <Tilt max={6} className="h-full">
      <button
        onClick={onOpen}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl glass text-left transition-all hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-violet-500/10"
      >
        {/* animated gradient border on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.4), rgba(139,92,246,0.4), rgba(34,211,238,0.2))",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />
        <div className="relative aspect-[16/10] overflow-hidden">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-600/30 to-violet-600/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {project.isFeatured && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full glass-strong px-2 py-0.5 text-[10px] font-semibold text-amber-300">
              <Star className="h-3 w-3 fill-amber-300" />
              Featured
            </span>
          )}

          <div className="absolute right-3 top-3 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="grid h-8 w-8 place-items-center rounded-full glass-strong text-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-base font-semibold leading-snug">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techTags.slice(0, 3).map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="rounded-md bg-white/5 font-normal text-foreground/70"
              >
                {t}
              </Badge>
            ))}
            {project.techTags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{project.techTags.length - 3}
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3 pt-1">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 transition-colors group-hover:text-blue-300">
              View case study
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
            <a
              href={`/projects/${project.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`Open full case study for ${project.title}`}
            >
              <ExternalLink className="h-3 w-3" />
              Detail
            </a>
            <div className="ml-auto flex items-center gap-1">
              {project.liveUrl && (
                <span
                  onClick={(e) => e.stopPropagation()}
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Live site">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </span>
              )}
              {project.repoUrl && (
                <span
                  onClick={(e) => e.stopPropagation()}
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                >
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label="Source code">
                    <Github className="h-3.5 w-3.5" />
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
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
  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto w-[94vw] sm:max-w-3xl gap-0 border-white/10 bg-[#0f1729]/95 p-0 backdrop-blur-2xl rounded-2xl sm:rounded-3xl">
        {project && (
          <>
            {/* cover */}
            <div className="relative aspect-[16/9] sm:aspect-[16/8] w-full overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
              {project.coverImage && (
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <button
                onClick={onClose}
                className="absolute right-3 top-3 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full glass-strong text-foreground hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <DialogHeader className="px-4 sm:px-6 pt-5 sm:pt-6 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <DialogTitle className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                    {project.title}
                  </DialogTitle>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{project.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {project.liveUrl && (
                    <Button asChild size="sm" className="bg-gradient-to-r from-blue-500 to-violet-600 text-xs">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-3.5 w-3.5" />
                        Live
                      </a>
                    </Button>
                  )}
                  {project.repoUrl && (
                    <Button asChild size="sm" variant="outline" className="border-white/10 bg-white/5 text-xs">
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-1 h-3.5 w-3.5" />
                        Code
                      </a>
                    </Button>
                  )}
                  <Button asChild size="sm" variant="ghost" className="text-xs text-muted-foreground hover:text-foreground">
                    <Link href={`/projects/${project.slug}`}>
                      <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                      Full page
                    </Link>
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="px-4 sm:px-6 pb-6 sm:pb-8 pt-3 sm:pt-4">
              <div className="flex flex-wrap gap-1.5">
                {project.techTags.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="rounded-md bg-white/5 font-normal text-foreground/70"
                  >
                    {t}
                  </Badge>
                ))}
              </div>

              {project.caseStudy ? (
                <CaseStudyMarkdown source={project.caseStudy} />
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">
                  A full case study is coming soon.
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CaseStudyMarkdown({ source }: { source: string }) {
  // Lightweight markdown-ish renderer: ## headings, plain paragraphs, lists with "- "
  const blocks = source.split(/\n{2,}/);
  return (
    <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/80">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines[0]?.startsWith("## ")) {
          return (
            <h4 key={i} className="font-display text-lg font-semibold text-foreground">
              {lines[0].slice(3)}
            </h4>
          );
        }
        const isList = lines.every((l) => l.trim().startsWith("- "));
        if (isList) {
          return (
            <ul key={i} className="ml-4 list-disc space-y-1">
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^-\s/, "").trim()}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}
