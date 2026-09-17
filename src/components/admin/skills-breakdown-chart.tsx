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
import { Boxes, Award, CheckCircle2 } from "lucide-react";

export type SkillItem = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  order?: number;
};

interface SkillsBreakdownChartProps {
  skills: SkillItem[];
}

const CATEGORY_COLORS: Record<string, { bar: string; fill: string; border: string; glow: string }> = {
  Frontend: {
    bar: "#3b82f6",
    fill: "rgba(59, 130, 246, 0.85)",
    border: "#60a5fa",
    glow: "rgba(59, 130, 246, 0.3)",
  },
  Backend: {
    bar: "#8b5cf6",
    fill: "rgba(139, 92, 246, 0.85)",
    border: "#a78bfa",
    glow: "rgba(139, 92, 246, 0.3)",
  },
  Database: {
    bar: "#10b981",
    fill: "rgba(16, 185, 129, 0.85)",
    border: "#34d399",
    glow: "rgba(16, 185, 129, 0.3)",
  },
  Tools: {
    bar: "#f59e0b",
    fill: "rgba(245, 158, 11, 0.85)",
    border: "#fbbf24",
    glow: "rgba(245, 158, 11, 0.3)",
  },
};

export function SkillsBreakdownChart({ skills = [] }: SkillsBreakdownChartProps) {
  const [viewMode, setViewMode] = useState<"proficiency" | "count">("proficiency");

  const categoriesData = useMemo(() => {
    const map = new Map<
      string,
      { count: number; totalProficiency: number; items: SkillItem[] }
    >();

    for (const s of skills) {
      const cat = s.category || "General";
      if (!map.has(cat)) {
        map.set(cat, { count: 0, totalProficiency: 0, items: [] });
      }
      const entry = map.get(cat)!;
      entry.count++;
      entry.totalProficiency += s.proficiency || 80;
      entry.items.push(s);
    }

    return Array.from(map.entries()).map(([category, info]) => {
      const avgProficiency = Math.round(info.totalProficiency / Math.max(info.count, 1));
      const sortedSkills = [...info.items].sort((a, b) => b.proficiency - a.proficiency);
      const topSkill = sortedSkills[0]?.name || "";

      return {
        category,
        count: info.count,
        avgProficiency,
        topSkill,
        skillsList: sortedSkills.map((s) => `${s.name} (${s.proficiency}%)`).join(", "),
      };
    });
  }, [skills]);

  const overallAvg = useMemo(() => {
    if (skills.length === 0) return 0;
    const total = skills.reduce((sum, s) => sum + (s.proficiency || 80), 0);
    return Math.round(total / skills.length);
  }, [skills]);

  return (
    <div className="rounded-2xl glass p-5 relative overflow-hidden border border-white/10 shadow-xl shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm">
            <Boxes className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
              Skills Domain & Proficiency Matrix
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-2.5 w-2.5" /> {skills.length} Tracked
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Categorized proficiency and competency across engineering disciplines.
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setViewMode("proficiency")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === "proficiency"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Avg Proficiency (%)
          </button>
          <button
            onClick={() => setViewMode("count")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === "count"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Skill Count
          </button>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        {categoriesData.map((cat) => {
          const colors = CATEGORY_COLORS[cat.category] || { bar: "#3b82f6", border: "#60a5fa" };
          return (
            <div
              key={cat.category}
              className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">{cat.category}</span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors.bar }}
                />
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-lg font-display font-bold tabular-nums text-foreground">
                  {cat.avgProficiency}%
                </span>
                <span className="text-[10px] text-muted-foreground">{cat.count} skills</span>
              </div>
              <div className="mt-1 text-[9px] text-muted-foreground/80 truncate">
                Top: {cat.topSkill}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      <div className="h-52 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoriesData}
            margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="category"
              tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={viewMode === "proficiency" ? [0, 100] : [0, "dataMax + 2"]}
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
              formatter={(val: number) => [
                viewMode === "proficiency" ? `${val}% Proficiency` : `${val} Skills`,
                "Level",
              ]}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload;
                return (
                  <div>
                    <div className="font-semibold text-foreground">{label} Category</div>
                    {item?.skillsList && (
                      <div className="text-[11px] text-muted-foreground mt-1 max-w-[220px] whitespace-normal">
                        {item.skillsList}
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Bar
              dataKey={viewMode === "proficiency" ? "avgProficiency" : "count"}
              radius={[6, 6, 0, 0]}
              maxBarSize={55}
            >
              {categoriesData.map((entry) => {
                const c = CATEGORY_COLORS[entry.category]?.fill || "rgba(59, 130, 246, 0.85)";
                return <Cell key={`cell-${entry.category}`} fill={c} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-white/5 pt-3">
        <span className="flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          Overall Portfolio Proficiency: <strong className="text-foreground">{overallAvg}%</strong>
        </span>
        <span className="text-[11px]">Hover over bars to inspect skills</span>
      </div>
    </div>
  );
}
