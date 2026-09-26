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
  Filter,
  Activity,
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
  // Hubs (Generously spaced and vertically centered)
  {
    id: "frontend-hub",
    label: "Frontend",
    category: "hub",
    x: 310,
    y: 330,
    r: 40,
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
    y: 330,
    r: 40,
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
    x: 185,
    y: 250,
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
    x: 120,
    y: 330,
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
    x: 185,
    y: 410,
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
    y: 465,
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
    x: 815,
    y: 250,
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
    x: 880,
    y: 330,
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
    x: 815,
    y: 410,
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
    y: 465,
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
    y: 280,
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
    y: 380,
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
    x: 580,
    y: 465,
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
    y: 465,
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

const RADAR_AXES = [
  { label: "React", score: "95%", x: 50, y: 18, textX: 50, textY: 8, align: "middle" },
  { label: "Next.js", score: "93%", x: 78, y: 34, textX: 84, textY: 34, align: "start" },
  { label: "Node.js", score: "90%", x: 76, y: 64, textX: 82, textY: 66, align: "start" },
  { label: "NestJS", score: "85%", x: 50, y: 80, textX: 50, textY: 92, align: "middle" },
  { label: "GraphQL", score: "88%", x: 23, y: 65, textX: 16, textY: 67, align: "end" },
  { label: "TypeScript", score: "94%", x: 24, y: 35, textX: 16, textY: 34, align: "end" },
];

export function Skills({ skills }: { skills?: SkillData[] }) {
  const [viewMode, setViewMode] = useState<"constellation" | "grid">("constellation");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredRadarAxis, setHoveredRadarAxis] = useState<{
    label: string;
    score: string;
  } | null>(null);
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
      if (centerY > h * 0.55) {
        placement = "top";
        left = Math.max(16, Math.min(centerX - boxWidth / 2, w - boxWidth - 16));
        top = Math.max(12, centerY - boxHeight - 20);
      } else if (centerY < h * 0.35) {
        // If near top, place below
        placement = "bottom";
        left = Math.max(16, Math.min(centerX - boxWidth / 2, w - boxWidth - 16));
        top = Math.min(centerY + 20, Math.max(12, h - boxHeight - 16));
      } else if (centerX > w * 0.5) {
        // If on right side, place to left
        placement = "left";
        left = Math.max(16, centerX - boxWidth - 20);
        top = Math.max(12, Math.min(centerY - boxHeight / 2, h - boxHeight - 16));
      } else {
        // If on left side, place to right
        placement = "right";
        left = Math.min(centerX + 20, w - boxWidth - 16);
        top = Math.max(12, Math.min(centerY - boxHeight / 2, h - boxHeight - 16));
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
    <section id="skills" className="relative scroll-mt-20 py-10 sm:py-16 lg:py-20 overflow-hidden">
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
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            THE TOOLS I MASTER
          </p>
          <h2 className="gsap-heading-split mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            SKILLS WITH CONTEXT, <br className="hidden sm:inline" />
            <span className="gradient-text">BUZZWORDS.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300/80 leading-relaxed text-balance">
            A focused, opinionated stack refined across production work — measured by
            how often I&apos;d choose them again, not by how many buzzwords fit on a page.
          </p>
        </div>

        {/* Top row: Left Filter Card + Right Radar Chart */}
        <div className="relative mb-6 grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between gap-4 sm:gap-6 pointer-events-auto">
          {/* Project Filter Card with Framer Motion entry and hover dynamics */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 15 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, transition: { duration: 0.25 } }}
            className="w-full lg:w-72 rounded-2xl glass p-4 sm:p-5 border border-white/10 hover:border-cyan-500/40 shadow-xl bg-slate-950/60 backdrop-blur-xl transition-colors duration-300 relative group"
          >
            {/* Ambient background glow on card hover */}
            <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-cyan-400 animate-pulse" />
                <h3 className="font-display text-sm font-semibold text-white tracking-wide">
                  Project Filter
                </h3>
              </div>
              {(selectedFilter || searchQuery) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    setSelectedFilter(null);
                    setSearchQuery("");
                  }}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Reset
                </motion.button>
              )}
            </div>

            <div className="relative mt-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setSelectedFilter(null);
                }}
                placeholder="e.g., Real-time Chat, SaaS, Blog"
                className="w-full rounded-xl border border-white/15 bg-white/5 pl-3.5 pr-8 py-2 text-xs text-white placeholder:text-slate-400 focus:border-cyan-400/60 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Search className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              )}
            </div>

            <div className="mt-4 space-y-2">
              {FILTER_PRESETS.map((filter) => {
                const checked = selectedFilter === filter.id;
                const matchCount = NODES.filter((n) => n.tags.includes(filter.id)).length;

                return (
                  <motion.button
                    key={filter.id}
                    type="button"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => {
                      setSelectedFilter(checked ? null : filter.id);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all text-left cursor-pointer",
                      checked
                        ? "text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <motion.div
                        animate={{ scale: checked ? [1, 1.25, 1] : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {checked ? (
                          <CheckSquare className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-500 flex-shrink-0" />
                        )}
                      </motion.div>
                      <span>{filter.label}</span>
                    </div>

                    <span
                      className={cn(
                        "text-[10px] font-mono rounded-full px-1.5 py-0.5",
                        checked
                          ? "bg-cyan-400/20 text-cyan-300 font-bold"
                          : "text-slate-500 bg-white/5"
                      )}
                    >
                      {matchCount}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Radar Chart (Spider Graph) with breathing polygon, rotating scanner beam & interactive data points */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 15 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, transition: { duration: 0.25 } }}
            className="w-full lg:w-72 rounded-2xl glass p-4 sm:p-5 border border-white/10 hover:border-violet-500/40 shadow-xl bg-slate-950/60 backdrop-blur-xl flex flex-col items-center transition-colors duration-300 relative group"
          >
            {/* Ambient background glow on card hover */}
            <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-violet-500/0 via-fuchsia-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />

            <div className="w-full flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs font-semibold text-slate-200 font-display">
                  Mastery Profile
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[9px] font-mono font-medium text-emerald-400 tracking-wider uppercase">
                  Live Telemetry
                </span>
              </div>
            </div>

            <div className="relative h-44 w-44 my-1">
              {/* Floating hover readout in center of chart */}
              <AnimatePresence>
                {hoveredRadarAxis && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
                  >
                    <div className="rounded-lg bg-slate-950/90 border border-cyan-400/60 px-2 py-1 shadow-lg shadow-cyan-500/20 backdrop-blur-md text-center">
                      <p className="text-[10px] font-display font-bold text-white">{hoveredRadarAxis.label}</p>
                      <p className="text-[11px] font-mono font-extrabold text-cyan-300">{hoveredRadarAxis.score}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible select-none">
                <defs>
                  {/* Dynamic gradient for radar polygon */}
                  <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.75" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#d946ef" stopOpacity="0.75" />
                  </linearGradient>

                  {/* Rotating radar scanner beam gradient */}
                  <linearGradient id="radarScanBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Rotating Radar Scanner Sweep Effect */}
                <g className="origin-[50px_50px] animate-[spin_6s_linear_infinite] pointer-events-none">
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="15"
                    stroke="url(#radarScanBeam)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="15" r="1.5" fill="#00f0ff" opacity="0.8" />
                </g>

                {/* Concentric background polygon rings */}
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
                  strokeDasharray="2 3"
                />
                <polygon
                  points="50,35 60,41 60,59 50,65 40,59 40,41"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />

                {/* Radial Axis Lines */}
                {RADAR_AXES.map((axis, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={axis.x}
                    y2={axis.y}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="0.8"
                  />
                ))}

                {/* Data Polygon with Animated Breathing Motion */}
                <motion.polygon
                  points="50,18 78,34 76,64 50,80 23,65 24,35"
                  fill="url(#radarGrad)"
                  stroke="#00f0ff"
                  strokeWidth="1.6"
                  className="filter drop-shadow-[0_0_10px_rgba(0,240,255,0.5)] cursor-pointer"
                  animate={{
                    scale: [1, 1.025, 1],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ originX: "50px", originY: "50px" }}
                />

                {/* Interactive Vertex Data Points */}
                {RADAR_AXES.map((axis, i) => {
                  const isHovered = hoveredRadarAxis?.label === axis.label;
                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredRadarAxis({ label: axis.label, score: axis.score })}
                      onMouseLeave={() => setHoveredRadarAxis(null)}
                    >
                      {/* Outer hover ping ring */}
                      {isHovered && (
                        <circle
                          cx={axis.x}
                          cy={axis.y}
                          r="6"
                          fill="none"
                          stroke="#00f0ff"
                          strokeWidth="1"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={axis.x}
                        cy={axis.y}
                        r={isHovered ? "4" : "2.5"}
                        fill={isHovered ? "#00f0ff" : "#ffffff"}
                        stroke={isHovered ? "#ffffff" : "transparent"}
                        strokeWidth="1"
                        className="transition-all duration-200"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Interactive Axis Labels around radar */}
              {RADAR_AXES.map((axis, i) => {
                const isHovered = hoveredRadarAxis?.label === axis.label;
                return (
                  <span
                    key={i}
                    onMouseEnter={() => setHoveredRadarAxis({ label: axis.label, score: axis.score })}
                    onMouseLeave={() => setHoveredRadarAxis(null)}
                    style={{
                      left: `${axis.textX}%`,
                      top: `${axis.textY}%`,
                      transform:
                        axis.align === "middle"
                          ? "translate(-50%, -50%)"
                          : axis.align === "start"
                            ? "translate(0, -50%)"
                            : "translate(-100%, -50%)",
                    }}
                    className={cn(
                      "absolute text-[9px] font-mono font-medium transition-all duration-200 cursor-pointer pointer-events-auto",
                      isHovered
                        ? "text-cyan-300 font-bold scale-110 drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]"
                        : "text-slate-300 hover:text-white"
                    )}
                  >
                    {axis.label}
                  </span>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Centerpiece: Responsive Constellation & Grid Container */}
        <div
          ref={constellationContainerRef}
          className="relative w-full rounded-3xl border border-white/10 bg-slate-950/40 p-3 sm:p-5 lg:p-6 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-center transition-all overflow-hidden"
        >
          {/* Subtle star particles / background grid lines */}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none rounded-3xl" />

          {/* Top Controls: Mode Switcher + Mobile Navigation Hint */}
          <div className="w-full flex items-center justify-between mb-2 px-1 z-20">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400/90">
              <span className="hidden md:inline">Click or hover any node for architectural details</span>
              <span className="md:hidden flex items-center gap-1">
                <span>↔</span> Swipe constellation • Tap for info
              </span>
            </div>
            <div className="flex items-center rounded-xl bg-white/5 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode("constellation")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                  viewMode === "constellation"
                    ? "bg-cyan-500/20 text-cyan-300 shadow-sm"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Constellation</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                  viewMode === "grid"
                    ? "bg-cyan-500/20 text-cyan-300 shadow-sm"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Grid View</span>
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            /* Responsive Grid View (Perfect on mobile, tablet, and compact views) */
            <div className="w-full py-2 z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Frontend Ecosystem Column */}
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-4 sm:p-5 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b border-cyan-500/20">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300 font-bold">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">Frontend Ecosystem</h3>
                    <p className="text-[11px] text-slate-400">Client, Rendering & UI Architecture</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {NODES.filter((n) => n.category === "frontend" || (n.category === "hub" && n.id === "frontend-hub") || n.id === "fullstack-rsc").map((node) => {
                    const isSelected = activeNode?.id === node.id;
                    const highlighted = isNodeHighlighted(node);
                    return (
                      <div
                        key={node.id}
                        onClick={(e) => showTooltipFor3s(node.id, e)}
                        className={cn(
                          "rounded-xl border p-3 transition-all cursor-pointer",
                          isSelected
                            ? "border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/10"
                            : "border-white/5 bg-white/[0.03] hover:border-cyan-500/40 hover:bg-white/[0.06]",
                          !highlighted && "opacity-30"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-xs font-bold text-white">{node.label}</span>
                          <span className="text-[10px] font-mono text-cyan-300">{node.proficiency}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-300/80 line-clamp-1">{node.applications[0]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Backend & Infrastructure Column */}
              <div className="rounded-2xl border border-violet-500/20 bg-violet-950/10 p-4 sm:p-5 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b border-violet-500/20">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/20 text-violet-300 font-bold">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">Backend & Infrastructure</h3>
                    <p className="text-[11px] text-slate-400">APIs, Microservices, Databases & Cache</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {NODES.filter((n) => n.category === "backend" || (n.category === "hub" && n.id === "backend-hub") || (n.category === "bridge" && n.id !== "fullstack-rsc")).map((node) => {
                    const isSelected = activeNode?.id === node.id;
                    const highlighted = isNodeHighlighted(node);
                    return (
                      <div
                        key={node.id}
                        onClick={(e) => showTooltipFor3s(node.id, e)}
                        className={cn(
                          "rounded-xl border p-3 transition-all cursor-pointer",
                          isSelected
                            ? "border-violet-400 bg-violet-500/15 shadow-lg shadow-violet-500/10"
                            : "border-white/5 bg-white/[0.03] hover:border-violet-500/40 hover:bg-white/[0.06]",
                          !highlighted && "opacity-30"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-xs font-bold text-white">{node.label}</span>
                          <span className="text-[10px] font-mono text-violet-300">{node.proficiency}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-300/80 line-clamp-1">{node.applications[0]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Constellation View */
            <div className="relative w-full z-10 flex flex-col items-center">
              {/* Floating Detail Tooltip Card (Desktop: md and up) */}
              <div
                style={{
                  left: `${tooltipPos.left}px`,
                  top: `${tooltipPos.top}px`,
                }}
                className="hidden md:block absolute z-30 w-full max-w-[280px] xs:max-w-[300px] pointer-events-none transition-[left,top] duration-200"
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

              {/* Responsive SVG Constellation Canvas Wrapper */}
              <div className="w-full overflow-x-auto scrollbar-none flex justify-center py-1">
                <svg
                  viewBox="30 165 920 330"
                  className="w-full min-w-[620px] md:min-w-0 max-w-[960px] h-auto select-none"
                  style={{ aspectRatio: "920 / 330" }}
                >
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

                    {/* CSS Keyframe Animations for 3 parallel bridge lines */}
                    <style>{`
                      @keyframes bridgeFlowRight {
                        from { stroke-dashoffset: 0; }
                        to   { stroke-dashoffset: -204; }
                      }
                      @keyframes bridgeFlowRightSlow {
                        from { stroke-dashoffset: 0; }
                        to   { stroke-dashoffset: -256; }
                      }
                      @keyframes bridgeFlowRightFlash {
                        from { stroke-dashoffset: 0; }
                        to   { stroke-dashoffset: -380; }
                      }
                      @keyframes bridgeFlowLeft {
                        from { stroke-dashoffset: 0; }
                        to   { stroke-dashoffset: 204; }
                      }
                      @keyframes bridgeTrackRight {
                        from { stroke-dashoffset: 0; }
                        to   { stroke-dashoffset: -28; }
                      }
                      @keyframes bridgeTrackLeft {
                        from { stroke-dashoffset: 0; }
                        to   { stroke-dashoffset: 28; }
                      }
                      .bridge-track-right {
                        animation: bridgeTrackRight 2s linear infinite;
                      }
                      .bridge-track-right-fast {
                        animation: bridgeTrackRight 1.6s linear infinite;
                      }
                      .bridge-pulse-cyan {
                        animation: bridgeFlowRight 1.6s linear infinite;
                      }
                      .bridge-pulse-gradient {
                        animation: bridgeFlowRightSlow 2s linear infinite;
                      }
                      .bridge-pulse-white {
                        animation: bridgeFlowRightFlash 1.2s linear infinite;
                      }
                      .bridge-track-left {
                        animation: bridgeTrackLeft 2.4s linear infinite;
                      }
                      .bridge-pulse-purple {
                        animation: bridgeFlowLeft 1.8s linear infinite;
                      }
                    `}</style>
                  </defs>


                  {/* Connecting Laser Lines with Moving Flowing Energy Pulses */}
                  <g className="transition-opacity duration-300">
                    {CONNECTIONS.map(([srcId, dstId], idx) => {
                      const src = NODES.find((n) => n.id === srcId);
                      const dst = NODES.find((n) => n.id === dstId);
                      if (!src || !dst) return null;
                      // Skip hub-to-hub: handled by 3 animated parallel lines below
                      if (
                        (src.id === "frontend-hub" && dst.id === "backend-hub") ||
                        (src.id === "backend-hub" && dst.id === "frontend-hub")
                      ) return null;

                      const srcActive = isNodeHighlighted(src);
                      const dstActive = isNodeHighlighted(dst);
                      const active = srcActive && dstActive;

                      const isBridge =
                        (src.category === "hub" && dst.category === "hub") ||
                        src.category === "bridge" ||
                        dst.category === "bridge";

                      const isBackend =
                        src.category === "backend" || dst.category === "backend";

                      const cycleDuration = (2.0 + (idx % 5) * 0.35).toFixed(2);

                      return (
                        <g key={idx}>
                          {/* Background soft guide line */}
                          <line
                            x1={src.x}
                            y1={src.y}
                            x2={dst.x}
                            y2={dst.y}
                            stroke={
                              isBridge
                                ? "url(#cyanPurple)"
                                : isBackend
                                  ? "#8b5cf6"
                                  : "#00f0ff"
                            }
                            strokeWidth={active ? (isBridge ? 1.8 : 1.2) : 0.6}
                            strokeOpacity={active ? (isBridge ? 0.7 : 0.45) : 0.12}
                            className="transition-all duration-300"
                          />

                          {/* Continuous Flowing Moving Energy Beam along the line */}
                          <line
                            x1={src.x}
                            y1={src.y}
                            x2={dst.x}
                            y2={dst.y}
                            stroke={
                              isBridge
                                ? "#ffffff"
                                : isBackend
                                  ? "#c084fc"
                                  : "#38bdf8"
                            }
                            strokeWidth={isBridge ? 2.4 : 1.8}
                            strokeDasharray="18 54"
                            strokeLinecap="round"
                            strokeOpacity={active ? 0.95 : 0.35}
                            filter={
                              isBackend
                                ? "url(#purpleGlow)"
                                : "url(#cyanGlow)"
                            }
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              from="0"
                              to="-144"
                              dur={`${cycleDuration}s`}
                              repeatCount="indefinite"
                            />
                          </line>

                          {/* High-speed white packet when line is active */}
                          {active && (
                            <line
                              x1={src.x}
                              y1={src.y}
                              x2={dst.x}
                              y2={dst.y}
                              stroke="#ffffff"
                              strokeWidth={2.5}
                              strokeDasharray="8 64"
                              strokeLinecap="round"
                              strokeOpacity={0.95}
                              filter="url(#cyanGlow)"
                            >
                              <animate
                                attributeName="stroke-dashoffset"
                                from="0"
                                to="-144"
                                dur={`${(1.2 + (idx % 3) * 0.3).toFixed(2)}s`}
                                repeatCount="indefinite"
                              />
                            </line>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* === 3 Animated Parallel Bridge Lines: Frontend ↔ Backend (CSS animated) === */}

                  {/* LINE 1 (TOP): Cyan track + pulse flowing RIGHT */}
                  <line
                    x1={310 + 40 + 8} y1={318}
                    x2={690 - 40 - 8} y2={318}
                    stroke="rgba(0,240,255,0.55)"
                    strokeWidth="1.2"
                    strokeDasharray="6 8"
                    className="bridge-track-right"
                  />
                  <line
                    x1={310 + 40 + 8} y1={318}
                    x2={690 - 40 - 8} y2={318}
                    stroke="#00f0ff"
                    strokeWidth="3"
                    strokeDasharray="22 80"
                    strokeLinecap="round"
                    filter="url(#cyanGlow)"
                    strokeOpacity="1"
                    className="bridge-pulse-cyan"
                  />

                  {/* LINE 2 (MIDDLE): White track + gradient pulse + white flash */}
                  <line
                    x1={310 + 40 + 8} y1={330}
                    x2={690 - 40 - 8} y2={330}
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="1.5"
                    strokeDasharray="6 8"
                    className="bridge-track-right-fast"
                  />
                  <line
                    x1={310 + 40 + 8} y1={330}
                    x2={690 - 40 - 8} y2={330}
                    stroke="url(#cyanPurple)"
                    strokeWidth="3.5"
                    strokeDasharray="28 100"
                    strokeLinecap="round"
                    filter="url(#cyanGlow)"
                    strokeOpacity="1"
                    className="bridge-pulse-gradient"
                  />
                  <line
                    x1={310 + 40 + 8} y1={330}
                    x2={690 - 40 - 8} y2={330}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeDasharray="10 180"
                    strokeLinecap="round"
                    strokeOpacity="1"
                    filter="url(#cyanGlow)"
                    className="bridge-pulse-white"
                  />

                  {/* LINE 3 (BOTTOM): Purple track + pulse flowing LEFT */}
                  <line
                    x1={310 + 40 + 8} y1={342}
                    x2={690 - 40 - 8} y2={342}
                    stroke="rgba(192,132,252,0.55)"
                    strokeWidth="1.2"
                    strokeDasharray="6 8"
                    className="bridge-track-left"
                  />
                  <line
                    x1={310 + 40 + 8} y1={342}
                    x2={690 - 40 - 8} y2={342}
                    stroke="#c084fc"
                    strokeWidth="3"
                    strokeDasharray="22 80"
                    strokeLinecap="round"
                    filter="url(#purpleGlow)"
                    strokeOpacity="1"
                    className="bridge-pulse-purple"
                  />

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

              {/* Mobile Docked Inspector Card (Screens < md) */}
              <AnimatePresence>
                {isBoxVisible && activeNode && (
                  <motion.div
                    key={`mobile-panel-${activeNode.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "md:hidden mt-3 w-full rounded-2xl glass p-4 border shadow-xl backdrop-blur-2xl relative",
                      activeNode.category === "backend"
                        ? "border-violet-500/50 bg-slate-950/90"
                        : "border-cyan-400/50 bg-slate-950/90"
                    )}
                  >
                    {/* Auto-hide countdown bar */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden rounded-t-2xl bg-white/10">
                      <motion.div
                        key={`m-timer-${activeNode.id}`}
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 3, ease: "linear" }}
                        className={cn(
                          "h-full",
                          activeNode.category === "backend" ? "bg-violet-400" : "bg-cyan-400"
                        )}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "grid h-8 w-8 place-items-center rounded-lg text-white font-mono text-xs font-bold",
                            activeNode.category === "backend" ? "bg-violet-600" : "bg-cyan-500"
                          )}
                        >
                          {activeNode.category === "backend" ? (
                            <Server className="h-4 w-4" />
                          ) : (
                            <Code2 className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-display text-sm font-bold text-white">
                            {activeNode.label}
                          </h4>
                          <span className="text-[11px] font-mono text-cyan-300">
                            {activeNode.proficiency}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsBoxVisible(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/10">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Applications:
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
                        {activeNode.applications.map((app, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-cyan-400">•</span>
                            <span className="line-clamp-1">{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
