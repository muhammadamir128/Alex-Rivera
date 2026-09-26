"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Server,
  Layers,
  Sparkles,
  Search,
  CheckSquare,
  Square,
  Zap,
  X,
} from "lucide-react";
import type { SkillData } from "@/lib/data";
import { cn } from "@/lib/utils";

interface NodeData {
  id: string;
  label: string;
  category: "frontend" | "backend" | "hub" | "bridge";
  x: number;
  y: number;
  r?: number;
  tags: string[];
  techCount?: string;
  proficiency: string;
  applications: string[];
}

const NODES: NodeData[] = [
  // Hubs (Generously spaced)
  {
    id: "frontend-hub",
    label: "Frontend",
    category: "hub",
    x: 310,
    y: 340,
    r: 42,
    tags: ["React", "TypeScript", "Next.js", "SaaS", "Blog", "Real-time Chat"],
    techCount: "6 technologies",
    proficiency: "95% Expert (Core use in production)",
    applications: [
      "PWA Development & Fluid UX",
      "Server-Side Rendering (Next.js 15)",
      "State Management (Zustand, React Query)",
      "Complex Fluid Animations (GSAP, Framer Motion)",
    ],
  },
  {
    id: "backend-hub",
    label: "Backend",
    category: "hub",
    x: 690,
    y: 340,
    r: 42,
    tags: ["Node.js", "TypeScript", "Real-time Chat", "SaaS", "REST API"],
    techCount: "7 technologies",
    proficiency: "90% Advanced (Scalable architectures)",
    applications: [
      "Distributed Microservices & RESTful APIs",
      "Real-time WebSockets & Event Pub/Sub",
      "Relational ORM Modeling (PostgreSQL, Prisma)",
      "In-Memory Caching & Rate Limiting (Redis)",
    ],
  },

  // Frontend Satellites
  {
    id: "react",
    label: "React",
    category: "frontend",
    x: 310,
    y: 195,
    tags: ["Real-time Chat", "SaaS", "Blog"],
    proficiency: "95% Expert",
    applications: [
      "Concurrent rendering & server components",
      "Custom hook architectures",
      "Strict accessibility standards (WCAG)",
    ],
  },
  {
    id: "nextjs-fe",
    label: "Next.js",
    category: "frontend",
    x: 180,
    y: 245,
    tags: ["SaaS", "Blog", "TypeScript"],
    proficiency: "93% Expert",
    applications: [
      "App Router & Server Actions",
      "Optimized Edge middleware",
      "Dynamic OpenGraph & SEO engines",
    ],
  },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    category: "frontend",
    x: 115,
    y: 340,
    tags: ["SaaS", "Blog"],
    proficiency: "92% Advanced",
    applications: [
      "Custom design systems & tokens",
      "Dark / Light theme transitions",
      "Zero-runtime responsive layouts",
    ],
  },
  {
    id: "typescript-fe",
    label: "TypeScript",
    category: "frontend",
    x: 180,
    y: 435,
    tags: ["TypeScript", "SaaS", "Real-time Chat"],
    proficiency: "94% Expert",
    applications: [
      "Strict type guarantees & generics",
      "Zod schema validation",
      "End-to-end fullstack type inference",
    ],
  },
  {
    id: "framer",
    label: "Framer Motion",
    category: "frontend",
    x: 270,
    y: 500,
    tags: ["SaaS", "Blog"],
    proficiency: "88% Advanced",
    applications: [
      "Spring physics & gesture controls",
      "Shared layout transformations",
      "Scroll-driven choreography",
    ],
  },

  // Backend Satellites
  {
    id: "rest-api",
    label: "REST API",
    category: "backend",
    x: 690,
    y: 195,
    tags: ["SaaS", "Real-time Chat", "Blog"],
    proficiency: "92% Expert",
    applications: [
      "OpenAPI / Swagger specifications",
      "JWT & Session auth patterns",
      "Idempotent endpoint design",
    ],
  },
  {
    id: "nodejs",
    label: "Node.js",
    category: "backend",
    x: 820,
    y: 245,
    tags: ["Real-time Chat", "SaaS", "TypeScript"],
    proficiency: "90% Advanced",
    applications: [
      "Asynchronous I/O & streaming pipelines",
      "Worker threads for compute tasks",
      "Cluster scaling & process management",
    ],
  },
  {
    id: "postgres",
    label: "PostgreSQL",
    category: "backend",
    x: 885,
    y: 340,
    tags: ["SaaS", "Blog"],
    proficiency: "88% Advanced",
    applications: [
      "Relational schema indexing & migrations",
      "JSONB query optimization",
      "ACID transactions & foreign keys",
    ],
  },
  {
    id: "express",
    label: "Express",
    category: "backend",
    x: 820,
    y: 435,
    tags: ["Real-time Chat", "Blog"],
    proficiency: "88% Advanced",
    applications: [
      "Composed routing middleware",
      "CORS & security hardening (Helmet)",
      "Global error interception",
    ],
  },
  {
    id: "nestjs",
    label: "NestJS",
    category: "backend",
    x: 730,
    y: 500,
    tags: ["SaaS", "TypeScript"],
    proficiency: "80% Proficient",
    applications: [
      "Modular dependency injection architecture",
      "DTO pipes and validation guards",
      "Microservice messaging adapters",
    ],
  },

  // Middle Bridge Nodes (Centered between Frontend and Backend with generous clearance)
  {
    id: "saas-bridge",
    label: "SaaS",
    category: "bridge",
    x: 500,
    y: 205,
    tags: ["SaaS"],
    proficiency: "Production Specialty",
    applications: [
      "Multi-tenant data isolation",
      "Stripe recurring billing & webhooks",
      "Role-based access control (RBAC)",
    ],
  },
  {
    id: "event-bridge",
    label: "Event Streams",
    category: "bridge",
    x: 470,
    y: 285,
    tags: ["Real-time Chat", "SaaS"],
    proficiency: "Production Specialty",
    applications: [
      "Bidirectional event signaling",
      "Real-time presence tracking",
      "Optimistic UI state sync",
    ],
  },
  {
    id: "west-bridge",
    label: "Prisma & Redis",
    category: "bridge",
    x: 530,
    y: 395,
    tags: ["SaaS", "TypeScript"],
    proficiency: "Production Specialty",
    applications: [
      "Type-safe schema modeling",
      "Sub-millisecond query caching",
      "Automated database migrations",
    ],
  },
  {
    id: "graphql",
    label: "GraphQL",
    category: "backend",
    x: 575,
    y: 500,
    tags: ["SaaS", "TypeScript"],
    proficiency: "82% Advanced",
    applications: [
      "Declarative client data queries",
      "Typed schema stitching & resolvers",
      "Reduced network over-fetching",
    ],
  },
  {
    id: "fullstack-rsc",
    label: "Full-Stack RSC",
    category: "bridge",
    x: 420,
    y: 500,
    tags: ["SaaS", "TypeScript"],
    proficiency: "Production Specialty",
    applications: [
      "React Server Components streaming",
      "Zero-bundle size server rendering",
      "Edge-side data prefetching",
    ],
  },
];

const CONNECTIONS: [string, string][] = [
  // Frontend internal links
  ["frontend-hub", "react"],
  ["frontend-hub", "nextjs-fe"],
  ["frontend-hub", "tailwind"],
  ["frontend-hub", "typescript-fe"],
  ["frontend-hub", "framer"],
  ["frontend-hub", "fullstack-rsc"],
  ["frontend-hub", "event-bridge"],

  // Backend internal links
  ["backend-hub", "rest-api"],
  ["backend-hub", "nodejs"],
  ["backend-hub", "postgres"],
  ["backend-hub", "express"],
  ["backend-hub", "nestjs"],
  ["backend-hub", "graphql"],
  ["backend-hub", "west-bridge"],
  ["backend-hub", "saas-bridge"],

  // Cross-cutting bridge links
  ["frontend-hub", "backend-hub"],
  ["react", "saas-bridge"],
  ["saas-bridge", "rest-api"],
  ["event-bridge", "backend-hub"],
  ["event-bridge", "react"],
  ["west-bridge", "frontend-hub"],
  ["fullstack-rsc", "west-bridge"],
  ["fullstack-rsc", "framer"],
  ["graphql", "west-bridge"],
  ["graphql", "nestjs"],
  ["typescript-fe", "nextjs-fe"],
  ["react", "nextjs-fe"],
  ["nodejs", "rest-api"],
  ["postgres", "express"],
  ["express", "nestjs"],
];

const FILTER_PRESETS = [
  { id: "Real-time Chat", label: "Real-time Chat" },
  { id: "SaaS", label: "SaaS" },
  { id: "Blog", label: "Blog" },
  { id: "TypeScript", label: "TypeScript" },
];

export function Skills({ skills }: { skills?: SkillData[] }) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const constellationContainerRef = useRef<HTMLDivElement>(null);

  const [tooltipPos, setTooltipPos] = useState<{
    left: number;
    top: number;
    placement: "top" | "bottom" | "left" | "right";
  }>({
    left: 20,
    top: 20,
    placement: "right",
  });

  const showTooltipFor3s = (nodeId: string, e?: React.MouseEvent) => {
    setActiveNodeId(nodeId);

    if (e && constellationContainerRef.current) {
      const targetEl = e.currentTarget as SVGElement;
      const targetRect = targetEl.getBoundingClientRect();
      const containerRect = constellationContainerRef.current.getBoundingClientRect();

      const centerX = targetRect.left - containerRect.left + targetRect.width / 2;
      const centerY = targetRect.top - containerRect.top + targetRect.height / 2;

      const w = containerRect.width;
      const h = containerRect.height;
      const boxWidth = Math.min(280, w - 32);
      const boxHeight = 220;

      let left = 0;
      let top = 0;
      let placement: "top" | "bottom" | "left" | "right" = "right";

      // If near bottom, place above
      if (centerY > h * 0.6) {
        placement = "top";
        left = Math.max(16, Math.min(centerX - boxWidth / 2, w - boxWidth - 16));
        top = Math.max(16, centerY - boxHeight - 24);
      } else if (centerY < h * 0.35) {
        // If near top, place below
        placement = "bottom";
        left = Math.max(16, Math.min(centerX - boxWidth / 2, w - boxWidth - 16));
        top = Math.min(centerY + 24, h - boxHeight - 16);
      } else if (centerX > w * 0.5) {
        // If on right side, place to left
        placement = "left";
        left = Math.max(16, centerX - boxWidth - 24);
        top = Math.max(16, Math.min(centerY - boxHeight / 2, h - boxHeight - 16));
      } else {
        // If on left side, place to right
        placement = "right";
        left = Math.min(centerX + 24, w - boxWidth - 16);
        top = Math.max(16, Math.min(centerY - boxHeight / 2, h - boxHeight - 16));
      }

      setTooltipPos({ left, top, placement });
    }

    setIsBoxVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setIsBoxVisible(false);
    }, 3000);
  };

  const handleBoxMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
  };

  const handleBoxMouseLeave = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setIsBoxVisible(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  // Determine active node details
  const activeNode = useMemo(() => {
    if (!activeNodeId) return null;
    return NODES.find((n) => n.id === activeNodeId) || null;
  }, [activeNodeId]);

  // Check if a node is highlighted
  const isNodeHighlighted = (node: NodeData) => {
    if (!selectedFilter && !searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      return (
        node.label.toLowerCase().includes(q) ||
        node.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedFilter) {
      return node.tags.includes(selectedFilter);
    }
    return true;
  };

  return (
    <section id="skills" className="relative scroll-mt-20 py-16 sm:py-24 overflow-hidden">
      {/* Deep cosmic gradient background matching the screenshot */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[#060913]"
      >
        <div className="absolute top-1/3 left-1/4 h-[30rem] w-[30rem] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 h-[30rem] w-[30rem] rounded-full bg-violet-600/12 blur-[140px]" />
        <div className="absolute inset-0 grid-noise opacity-30" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            THE TOOLS I MASTER
          </p>
          <h2 className="gsap-heading-split mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            SKILLS WITH CONTEXT, <br className="hidden sm:inline" />
            <span className="gradient-text">BUZZWORDS.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300/80 leading-relaxed text-balance">
            A focused, opinionated stack refined across production work — measured by
            how often I&apos;d choose them again, not by how many buzzwords fit on a page.
          </p>
        </div>

        {/* Top row: Left Filter Card + Right Radar Chart */}
        <div className="relative mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between pointer-events-auto">
          {/* Project Filter Card */}
          <div className="w-full lg:w-72 rounded-2xl glass p-5 border border-white/10 shadow-xl bg-slate-950/60 backdrop-blur-xl">
            <h3 className="font-display text-sm font-semibold text-white tracking-wide">
              Project Filter
            </h3>
            <div className="relative mt-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setSelectedFilter(null);
                }}
                placeholder="e.g., Real-time Chat, SaaS, Blog"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-colors"
              />
              <Search className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            <div className="mt-4 space-y-2">
              {FILTER_PRESETS.map((filter) => {
                const checked = selectedFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(checked ? null : filter.id);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer",
                      checked
                        ? "text-cyan-400 bg-cyan-500/10 font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {checked ? (
                      <CheckSquare className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    )}
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Radar Chart (Spider Graph) */}
          <div className="w-full lg:w-72 rounded-2xl glass p-5 border border-white/10 shadow-xl bg-slate-950/60 backdrop-blur-xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 font-display">
                Mastery Profile
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Production</span>
            </div>

            <div className="relative h-44 w-44">
              <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
                {/* Background grid concentric polygons */}
                <polygon
                  points="50,15 80,32 80,68 50,85 20,68 20,32"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
                <polygon
                  points="50,25 70,36 70,64 50,75 30,64 30,36"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
                <polygon
                  points="50,35 60,41 60,59 50,65 40,59 40,41"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />

                {/* Axes */}
                <line x1="50" y1="50" x2="50" y2="15" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                <line x1="50" y1="50" x2="80" y2="32" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                <line x1="50" y1="50" x2="80" y2="68" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                <line x1="50" y1="50" x2="50" y2="85" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                <line x1="50" y1="50" x2="20" y2="68" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                <line x1="50" y1="50" x2="20" y2="32" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />

                {/* Data Polygon filled with glowing gradient */}
                <defs>
                  <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#d946ef" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                <polygon
                  points="50,18 78,34 76,64 50,80 23,65 24,35"
                  fill="url(#radarGrad)"
                  stroke="#00f0ff"
                  strokeWidth="1.5"
                  className="filter drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                />

                {/* Data Points */}
                <circle cx="50" cy="18" r="2" fill="#ffffff" />
                <circle cx="78" cy="34" r="2" fill="#ffffff" />
                <circle cx="76" cy="64" r="2" fill="#ffffff" />
                <circle cx="50" cy="80" r="2" fill="#ffffff" />
                <circle cx="23" cy="65" r="2" fill="#ffffff" />
                <circle cx="24" cy="35" r="2" fill="#ffffff" />
              </svg>

              {/* Axis Labels */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono font-medium text-slate-300">
                React
              </span>
              <span className="absolute top-7 -right-4 text-[9px] font-mono font-medium text-slate-300">
                Next.js
              </span>
              <span className="absolute bottom-7 -right-4 text-[9px] font-mono font-medium text-slate-300">
                Node.js
              </span>
              <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-medium text-slate-300">
                NestJS
              </span>
              <span className="absolute bottom-7 -left-5 text-[9px] font-mono font-medium text-slate-300">
                GraphQL
              </span>
              <span className="absolute top-7 -left-3 text-[9px] font-mono font-medium text-slate-300">
                React
              </span>
            </div>
          </div>
        </div>

        {/* Centerpiece: Constellation Graph with Floating Tooltip */}
        <div
          ref={constellationContainerRef}
          className="relative w-full rounded-3xl border border-white/10 bg-slate-950/40 p-4 sm:p-6 lg:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden min-h-[580px] flex items-center justify-center"
        >
          {/* Subtle star particles / background grid lines */}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Floating Detail Tooltip Card - dynamically anchored next to the hovered node */}
          <div
            style={{
              left: `${tooltipPos.left}px`,
              top: `${tooltipPos.top}px`,
            }}
            className="absolute z-30 w-full max-w-[280px] xs:max-w-[300px] pointer-events-none transition-[left,top] duration-200"
          >
            <AnimatePresence>
              {isBoxVisible && activeNode && (
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: -10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onMouseEnter={handleBoxMouseEnter}
                  onMouseLeave={handleBoxMouseLeave}
                  className={cn(
                    "pointer-events-auto relative rounded-2xl glass p-5 shadow-2xl backdrop-blur-2xl border transition-all duration-300",
                    activeNode.category === "backend"
                      ? "border-violet-500/60 shadow-violet-500/20"
                      : "border-cyan-400/60 shadow-cyan-400/20"
                  )}
                >
                  {/* Auto-hide 3-second animated countdown bar */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden rounded-t-2xl bg-white/10">
                    <motion.div
                      key={`timer-bar-${activeNode.id}`}
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 3, ease: "linear" }}
                      className={cn(
                        "h-full",
                        activeNode.category === "backend" ? "bg-violet-400" : "bg-cyan-400"
                      )}
                    />
                  </div>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setIsBoxVisible(false)}
                    aria-label="Close details"
                    className="absolute top-3.5 right-3.5 grid h-6 w-6 place-items-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Dynamic Pointer Notch */}
                  <div
                    className={cn(
                      "absolute h-3.5 w-3.5 rotate-45 bg-slate-950/95",
                      tooltipPos.placement === "left" && "-right-1.5 top-8 border-r border-t",
                      tooltipPos.placement === "right" && "-left-1.5 top-8 border-l border-b",
                      tooltipPos.placement === "top" && "-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b",
                      tooltipPos.placement === "bottom" && "-top-1.5 left-1/2 -translate-x-1/2 border-l border-t",
                      activeNode.category === "backend"
                        ? "border-violet-500/60"
                        : "border-cyan-400/60"
                    )}
                  />

                  <div className="flex items-center gap-3 pr-6">
                    <div
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-xl text-white font-mono text-sm font-bold shadow-md",
                        activeNode.category === "backend"
                          ? "bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-violet-500/25"
                          : "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-cyan-500/25"
                      )}
                    >
                      {activeNode.category === "backend" ? (
                        <Server className="h-5 w-5" />
                      ) : (
                        <Code2 className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-white tracking-tight">
                        {activeNode.label}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {activeNode.techCount || "Specialized technology"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-mono text-cyan-300 border border-white/5">
                    {activeNode.proficiency}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Applications
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-300/90">
                      {activeNode.applications.map((app, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Responsive SVG Constellation Canvas */}
          <div className="w-full max-w-[1000px] overflow-x-auto overflow-y-hidden py-4 scrollbar-none flex justify-center">
            <svg viewBox="40 160 920 375" className="w-full min-w-[700px] max-h-[520px] select-none">
              <defs>
                {/* Cyan Glow Filter */}
                <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Purple Glow Filter */}
                <filter id="purpleGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Cyan to Purple Gradient line */}
                <linearGradient id="cyanPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
                </linearGradient>

                <linearGradient id="cyanBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="purpleBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Central Hub-to-Hub Bridge Link */}
              <line
                x1={310 + 42 + 8}
                y1={340}
                x2={690 - 42 - 8}
                y2={340}
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="1.5"
                strokeDasharray="6 8"
              />

              {/* Connecting Laser Lines */}
              <g className="transition-opacity duration-300">
                {CONNECTIONS.map(([srcId, dstId], idx) => {
                  const src = NODES.find((n) => n.id === srcId);
                  const dst = NODES.find((n) => n.id === dstId);
                  if (!src || !dst) return null;

                  const srcActive = isNodeHighlighted(src);
                  const dstActive = isNodeHighlighted(dst);
                  const active = srcActive && dstActive;

                  const isBridge =
                    (src.category === "hub" && dst.category === "hub") ||
                    src.category === "bridge" ||
                    dst.category === "bridge";

                  return (
                    <g key={idx}>
                      {/* Background soft line */}
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={dst.x}
                        y2={dst.y}
                        stroke={
                          isBridge
                            ? "url(#cyanPurple)"
                            : src.category === "backend" || dst.category === "backend"
                              ? "#8b5cf6"
                              : "#00f0ff"
                        }
                        strokeWidth={active ? (isBridge ? 2 : 1.2) : 0.6}
                        strokeOpacity={active ? (isBridge ? 0.8 : 0.45) : 0.1}
                        className="transition-all duration-300"
                      />
                      {/* Animated traveling energy pulse */}
                      {active && (
                        <line
                          x1={src.x}
                          y1={src.y}
                          x2={dst.x}
                          y2={dst.y}
                          stroke={isBridge ? "#ffffff" : "#38bdf8"}
                          strokeWidth={isBridge ? 2 : 1.5}
                          strokeDasharray="4 20"
                          strokeLinecap="round"
                          className="animate-pulse"
                          strokeOpacity={0.7}
                        />
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Satellites & Bridge Nodes */}
              {NODES.filter((n) => n.category !== "hub").map((node) => {
                const isHighlighted = isNodeHighlighted(node);
                const isSelected = activeNode?.id === node.id;
                const isBackend = node.category === "backend";
                const isBridge = node.category === "bridge";

                // Dynamic capsule width calculation to guarantee ample space and zero text clipping
                const capsuleWidth = Math.max(node.label.length * 7.6 + 26, 68);
                const capsuleHeight = 26;
                const rx = capsuleHeight / 2;

                return (
                  <g
                    key={node.id}
                    onClick={(e) => showTooltipFor3s(node.id, e)}
                    onMouseEnter={(e) => showTooltipFor3s(node.id, e)}
                    className="cursor-pointer"
                    style={{
                      opacity: isHighlighted ? 1 : 0.25,
                    }}
                  >
                    {/* Hover aura - static radius, zero shifting */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={24}
                      fill={
                        isSelected
                          ? isBackend
                            ? "rgba(168,85,247,0.3)"
                            : isBridge
                              ? "rgba(192,132,252,0.25)"
                              : "rgba(0,240,255,0.3)"
                          : isBackend
                            ? "rgba(168,85,247,0.12)"
                            : isBridge
                              ? "rgba(192,132,252,0.1)"
                              : "rgba(0,240,255,0.12)"
                      }
                      className="transition-colors duration-200"
                    />

                    {/* Node Capsule - strictly stationary, NO transform scale */}
                    <rect
                      x={node.x - capsuleWidth / 2}
                      y={node.y - capsuleHeight / 2}
                      width={capsuleWidth}
                      height={capsuleHeight}
                      rx={rx}
                      fill={
                        isSelected
                          ? isBackend
                            ? "#1a0b2e"
                            : isBridge
                              ? "#111428"
                              : "#062238"
                          : "#0b1120"
                      }
                      stroke={
                        isSelected
                          ? isBackend
                            ? "#c084fc"
                            : isBridge
                              ? "#a78bfa"
                              : "#00f0ff"
                          : isBackend
                            ? "rgba(168,85,247,0.4)"
                            : isBridge
                              ? "rgba(167,139,250,0.35)"
                              : "rgba(0,240,255,0.4)"
                      }
                      strokeWidth={isSelected ? 1.8 : 1}
                      filter={isSelected ? (isBackend ? "url(#purpleGlow)" : "url(#cyanGlow)") : undefined}
                      className="transition-colors duration-200"
                    />

                    {/* Node Label Text */}
                    <text
                      x={node.x}
                      y={node.y}
                      dominantBaseline="central"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight={isSelected ? "700" : "500"}
                      className="pointer-events-none select-none font-sans tracking-wide"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}

              {/* Main Hub Nodes (Frontend & Backend) */}
              {NODES.filter((n) => n.category === "hub").map((hub) => {
                const isFrontend = hub.id === "frontend-hub";
                const isSelected = activeNode?.id === hub.id;
                const isHighlighted = isNodeHighlighted(hub);

                return (
                  <g
                    key={hub.id}
                    onClick={(e) => showTooltipFor3s(hub.id, e)}
                    onMouseEnter={(e) => showTooltipFor3s(hub.id, e)}
                    className="cursor-pointer transition-all duration-300"
                    style={{ opacity: isHighlighted ? 1 : 0.3 }}
                  >
                    {/* Deep Pulsing Aura */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={hub.r! + 18}
                      fill={isFrontend ? "rgba(0,240,255,0.18)" : "rgba(168,85,247,0.18)"}
                      className="animate-pulse"
                    />

                    {/* Outer Neon Dashed Ring */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={hub.r! + 5}
                      fill="none"
                      stroke={isFrontend ? "#00f0ff" : "#c084fc"}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeDasharray="4 3"
                      filter={isFrontend ? "url(#cyanGlow)" : "url(#purpleGlow)"}
                    />

                    {/* Inner Solid Hub Circle */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={hub.r!}
                      fill={isFrontend ? "#072b45" : "#2b104c"}
                      stroke={isFrontend ? "#00f0ff" : "#c084fc"}
                      strokeWidth={2}
                    />

                    {/* Hub Title Text */}
                    <text
                      x={hub.x}
                      y={hub.y}
                      dominantBaseline="central"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="700"
                      className="pointer-events-none select-none font-display tracking-wide drop-shadow-md"
                    >
                      {hub.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
