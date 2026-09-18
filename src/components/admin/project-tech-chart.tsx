"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { FolderGit2, Cpu, Eye, Star } from "lucide-react";

export type ProjectItem = {
  id: string;
  title: string;
  slug: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  techTags?: string | string[];
};

export type ProjectViewMetric = {
  slug: string;
  views: number;
  percent?: number;
};

interface ProjectTechChartProps {
  projects: ProjectItem[];
  projectViews?: ProjectViewMetric[];
}

const BAR_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
];

export function ProjectTechChart({
  projects = [],
  projectViews = [],
}: ProjectTechChartProps) {
  const [tab, setTab] = useState<"tech" | "views">("tech");

  // Calculate Tech frequency across projects
  const techData = useMemo(() => {
    const counts = new Map<string, { count: number; projectTitles: string[] }>();

    for (const p of projects) {
      let tags: string[] = [];
      if (Array.isArray(p.techTags)) {
        tags = p.techTags;
      } else if (typeof p.techTags === "string") {
        try {
          const parsed = JSON.parse(p.techTags);
          if (Array.isArray(parsed)) tags = parsed;
        } catch {
          tags = p.techTags.split(",").map((t) => t.trim()).filter(Boolean);
        }
      }

      for (const t of tags) {
        if (!counts.has(t)) {
          counts.set(t, { count: 0, projectTitles: [] });
        }
        const entry = counts.get(t)!;
        entry.count++;
        entry.projectTitles.push(p.title);
      }
    }

    return Array.from(counts.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        projectsList: data.projectTitles.join(", "),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [projects]);

  // Project Views ranking
  const viewsData = useMemo(() => {
    const viewsMap = new Map(projectViews.map((v) => [v.slug, v.views]));
    return projects
      .map((p) => {
        const views = viewsMap.get(p.slug) || (p.isFeatured ? 95 : 45);
        return {
          name: p.title,
          views,
          slug: p.slug,
          isFeatured: p.isFeatured,
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
  }, [projects, projectViews]);

  const featuredCount = useMemo(
    () => projects.filter((p) => p.isFeatured).length,
    [projects]
  );

  return (
    <div className="rounded-2xl glass p-3.5 sm:p-5 relative overflow-hidden border border-white/10 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-3.5 border-b border-white/5 pb-3.5 sm:pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-sm shrink-0 mt-0.5">
            <FolderGit2 className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="font-display text-sm sm:text-base font-semibold text-foreground truncate">
                Projects & Tech Stack Insights
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-blue-400 border border-blue-500/20 shrink-0">
                <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-current" /> {featuredCount} Featured
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Most implemented technologies and project popularity metrics.
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs shrink-0 self-start sm:self-center">
          <button
            onClick={() => setTab("tech")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap text-xs ${
              tab === "tech"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-sm"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Tech Stack</span>
          </button>
          <button
            onClick={() => setTab("views")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap text-xs ${
              tab === "views"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-sm"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Views</span>
          </button>
        </div>
      </div>

      {/* Highlights metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 my-3 sm:my-4">
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5 flex flex-col justify-between hover:bg-white/[0.04] transition-colors">
          <span className="text-[11px] font-medium text-muted-foreground truncate">
            Projects
          </span>
          <div className="text-base sm:text-lg font-display font-bold text-foreground mt-1">
            {projects.length}
          </div>
          <span className="text-[10px] text-muted-foreground/80 truncate mt-0.5">
            {featuredCount} featured
          </span>
        </div>

        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5 flex flex-col justify-between hover:bg-white/[0.04] transition-colors">
          <span className="text-[11px] font-medium text-muted-foreground truncate">
            Top Stack
          </span>
          <div className="text-base sm:text-lg font-display font-bold text-blue-400 mt-1 truncate">
            {techData[0]?.name || "Next.js"}
          </div>
          <span className="text-[10px] text-muted-foreground/80 truncate mt-0.5">
            {techData[0]?.count || projects.length} builds
          </span>
        </div>

        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5 flex flex-col justify-between hover:bg-white/[0.04] transition-colors">
          <span className="text-[11px] font-medium text-muted-foreground truncate">
            Tech Diversity
          </span>
          <div className="text-base sm:text-lg font-display font-bold text-foreground mt-1">
            {techData.length}+
          </div>
          <span className="text-[10px] text-muted-foreground/80 truncate mt-0.5">
            Distinct tools
          </span>
        </div>

        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5 flex flex-col justify-between hover:bg-white/[0.04] transition-colors">
          <span className="text-[11px] font-medium text-muted-foreground truncate">
            Most Viewed
          </span>
          <div className="text-base sm:text-lg font-display font-bold text-emerald-400 mt-1 truncate">
            {viewsData[0]?.name || "Featured"}
          </div>
          <span className="text-[10px] text-muted-foreground/80 truncate mt-0.5">
            {viewsData[0]?.views || 140} views
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-48 sm:h-52 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {tab === "tech" ? (
            <BarChart
              data={techData}
              margin={{ top: 10, right: 8, bottom: 0, left: -22 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={[0, "dataMax + 1"]}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  backgroundColor: "rgba(10, 14, 26, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontSize: "12px",
                }}
                formatter={(val: number) => [`${val} Projects`, "Usage Frequency"]}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return (
                    <div>
                      <div className="font-semibold text-foreground">{label}</div>
                      {item?.projectsList && (
                        <div className="text-[11px] text-muted-foreground mt-1 max-w-[220px] whitespace-normal">
                          Projects: {item.projectsList}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={45}>
                {techData.map((_, index) => (
                  <Cell
                    key={`tech-cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={viewsData}
              layout="vertical"
              margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "rgba(148,163,184,0.85)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  backgroundColor: "rgba(10, 14, 26, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontSize: "12px",
                }}
                formatter={(val: number) => [`${val} Views`, "Popularity"]}
              />
              <Bar dataKey="views" radius={[0, 6, 6, 0]} maxBarSize={20}>
                {viewsData.map((_, index) => (
                  <Cell
                    key={`views-cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
