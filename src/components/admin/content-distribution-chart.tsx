"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { PieChart as PieIcon, Layers } from "lucide-react";

interface ContentDistributionProps {
  stats: {
    projects: number;
    skills: number;
    experience: number;
    education: number;
    testimonials: number;
  };
}

const CONTENT_ITEMS = [
  { key: "skills", label: "Skills", color: "#10b981", border: "#34d399" },
  { key: "projects", label: "Projects", color: "#3b82f6", border: "#60a5fa" },
  { key: "testimonials", label: "Testimonials", color: "#f59e0b", border: "#fbbf24" },
  { key: "experience", label: "Experience Roles", color: "#8b5cf6", border: "#a78bfa" },
  { key: "education", label: "Education", color: "#06b6d4", border: "#22d3ee" },
] as const;

export function ContentDistributionChart({ stats }: ContentDistributionProps) {
  const data = useMemo(() => {
    return CONTENT_ITEMS.map((item) => ({
      name: item.label,
      value: stats[item.key as keyof typeof stats] || 0,
      color: item.color,
      border: item.border,
    })).filter((item) => item.value > 0);
  }, [stats]);

  const totalItems = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  return (
    <div className="rounded-2xl glass p-5 relative overflow-hidden border border-white/10 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-sm">
            <Layers className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
              Portfolio Content Breakdown
            </h2>
            <p className="text-xs text-muted-foreground">
              Total cataloged database entities across all portfolio sections.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="font-display text-xl font-bold tabular-nums text-foreground">
            {totalItems}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Total Nodes
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-3">
        {/* Donut Chart */}
        <div className="sm:col-span-6 h-52 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 14, 26, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  fontSize: "12px",
                }}
                formatter={(val: number, name: string) => [
                  `${val} entries (${totalItems > 0 ? Math.round((val / totalItems) * 100) : 0}%)`,
                  name,
                ]}
              />
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="rgba(0,0,0,0.3)"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Stat Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-display font-bold tabular-nums text-foreground">
              {totalItems}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Entries
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="sm:col-span-6 space-y-2">
          {data.map((item) => {
            const pct = totalItems > 0 ? Math.round((item.value / totalItems) * 100) : 0;
            return (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium text-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {item.value}
                  </span>
                  <span className="text-[10px] text-muted-foreground w-8 text-right">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
