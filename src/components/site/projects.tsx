"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Star, Search, ExternalLink } from "lucide-react";
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
    <section id="work" className="relative scroll-mt-24 py-14 sm:py-20 overflow-hidden">

      {/* Cosmic Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[#060913]">
        <div className="absolute top-0 right-1/4 h-[30rem] w-[30rem] rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-600/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Animated corner circuit lines */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 w-full h-full" style={{ zIndex: 0, opacity: 0.18 }}>
        <style>{`
          @keyframes prjFlowR { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -100; } }
          @keyframes prjFlowL { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 100; } }
          .prj-r { animation: prjFlowR 3.5s linear infinite; }
          .prj-l { animation: prjFlowL 4.5s linear infinite; }
        `}</style>
        <line x1="0" y1="70" x2="200" y2="70" stroke="#00f0ff" strokeWidth="1" strokeDasharray="8 12" className="prj-r" />
        <line x1="70" y1="0" x2="70" y2="160" stroke="#00f0ff" strokeWidth="1" strokeDasharray="8 12" className="prj-r" />
        <line x1="100%" y1="70" x2="calc(100% - 200px)" y2="70" stroke="#c084fc" strokeWidth="1" strokeDasharray="8 12" className="prj-l" />
        <line x1="calc(100% - 70px)" y1="0" x2="calc(100% - 70px)" y2="160" stroke="#c084fc" strokeWidth="1" strokeDasharray="8 12" className="prj-l" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6" style={{ zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
        >
          <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            <span className="h-px w-8 bg-cyan-400/60" />
            Selected Work
            <span className="h-px w-8 bg-cyan-400/60" />
          </p>
          <h2 className="gsap-heading-split mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            Projects that{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              shipped
            </span>.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            A snapshot of products I&apos;ve designed, built, and maintained end-to-end.
          </p>
          <div className="mt-3 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        </motion.div>

        {/* Search + Filters toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 sm:mt-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Search bar */}
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects by title, tech..."
                className="w-full rounded-full border border-white/10 bg-slate-950/60 backdrop-blur-xl py-2.5 pl-10 pr-9 text-xs sm:text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-slate-500 hover:text-slate-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Count + clear */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span>Showing</span>
                <span className="font-mono font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  {visible.length}
                </span>
                <span>of {projects.length}</span>
              </div>
              {(search || filter !== "All") && (
                <button
                  onClick={() => { setSearch(""); setFilter("All"); }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors underline underline-offset-4"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => setFilter(tag)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-mono font-semibold tracking-wide transition-all duration-200 cursor-pointer border",
                  filter === tag
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-lg shadow-violet-500/30"
                    : "border-white/10 bg-slate-950/50 text-slate-400 hover:border-cyan-500/30 hover:text-cyan-300 backdrop-blur-xl"
                )}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Project Grid */}
        <motion.div
          layout
          className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col h-full min-h-0"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl py-16 text-center"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Search className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-white">No projects found</p>
            <p className="mt-1 text-xs text-slate-500">Try a different search term or clear the filter.</p>
            <button
              onClick={() => { setSearch(""); setFilter("All"); }}
              className="mt-4 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-1.5 text-xs font-medium text-white shadow-lg shadow-violet-600/20 transition-opacity hover:opacity-90"
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
    glow: "rgba(0,240,255,0.15)",
    badgeBorder: "border-cyan-400/30",
    badgeBg: "bg-cyan-500/10",
    badgeText: "text-cyan-300",
    tagLabel: "Web App",
    domain: project.slug + ".vercel.app",
  };

  const handleCardClick = () => {
    router.push(`/projects/${project.slug}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="h-full w-full"
    >
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
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl cursor-pointer transition-all duration-300"
        style={{
          background: "rgba(6,9,19,0.85)",
          border: `1px solid ${theme.glow.replace("0.2", "0.45")}`,
          boxShadow: `0 0 20px 2px ${theme.glow}, inset 0 0 12px ${theme.glow.replace("0.2", "0.04")}`,
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Corner brackets */}
        <span className="absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2 rounded-tl-2xl z-10" style={{ borderColor: theme.glow.replace("0.2", "0.7") }} />
        <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 rounded-br-2xl z-10" style={{ borderColor: theme.glow.replace("0.2", "0.7") }} />

        {/* Scanning top border animation */}
        <div className="absolute top-0 left-0 right-0 h-px overflow-hidden rounded-t-2xl z-10">
          <motion.div
            className="h-full w-1/3"
            style={{ background: theme.glow.replace("0.2", "0.9") }}
            animate={{ x: ["-100%", "350%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Hover ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 -z-10 blur-xl"
          style={{ background: `radial-gradient(circle at 50% 0%, ${theme.glow} 0%, transparent 70%)` }}
        />

        {/* Hero screenshot */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b select-none" style={{ borderColor: theme.glow.replace("0.2", "0.15") }}>
          {project.coverImage ? (
            <div
              role="img"
              aria-label={project.title}
              className="h-full w-full bg-cover bg-top transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none select-none"
              style={{ backgroundImage: `url("${project.coverImage}")` }}
            />
          ) : (
            <div
              className="grid h-full w-full place-items-center"
              style={{ background: `radial-gradient(ellipse at 50% 50%, ${theme.glow}, transparent 70%)` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-transparent opacity-50 z-10 pointer-events-auto" />
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-5">
          {/* Top tags */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={cn(
              "text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border",
              theme.badgeBorder, theme.badgeBg, theme.badgeText
            )}>
              {theme.tagLabel}
            </span>
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                Featured
              </span>
            )}
          </div>

          {/* Title + link */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base sm:text-lg font-bold leading-snug text-white group-hover:text-cyan-300 transition-colors duration-300">
              {project.title}
            </h3>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Open ${project.title}`}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border bg-slate-950/50 text-slate-400 transition-all hover:scale-110 hover:text-cyan-300 active:scale-95"
                style={{ borderColor: theme.glow.replace("0.2", "0.3") }}
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Description */}
          <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md px-2 py-0.5 text-[11px] font-mono font-medium"
                style={{
                  background: theme.glow.replace("0.2", "0.08"),
                  color: theme.badgeText.replace("text-", "").includes("cyan") ? "#a5f3fc" :
                         theme.badgeText.includes("violet") ? "#e9d5ff" :
                         theme.badgeText.includes("emerald") ? "#a7f3d0" :
                         theme.badgeText.includes("amber") ? "#fde68a" :
                         theme.badgeText.includes("rose") ? "#fecdd3" : "#fbcfe8",
                  border: `1px solid ${theme.glow.replace("0.2", "0.25")}`,
                }}
              >
                {tag}
              </span>
            ))}
            {project.techTags.length > 3 && (
              <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-slate-500">
                +{project.techTags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
