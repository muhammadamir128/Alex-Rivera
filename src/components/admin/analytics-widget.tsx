"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";
import { Eye, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

type Summary = {
  total: number;
  last7: number;
  topProjects: { slug: string; views: number }[];
  daily: { day: string; label: string; count: number }[];
};

/**
 * Analytics widget for the admin dashboard.
 * Shows total views, 7-day views, a 14-day sparkline, and top projects.
 */
export function AnalyticsWidget() {
  const [data, setData] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/api/analytics/summary", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setData(d))
      .catch(() => {});
  }, []);

  return (
    <div className="rounded-2xl glass p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-blue-400" />
          <h2 className="font-display text-base font-semibold">
            Page views
          </h2>
        </div>
        {data && (
          <div className="text-right">
            <div className="font-display text-xl font-bold tabular-nums text-foreground">
              {data.total}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              all time
            </div>
          </div>
        )}
      </div>

      {/* 7-day stat */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300">
          <TrendingUp className="h-3 w-3" />
          {data ? `${data.last7} views` : "…"}
          <span className="text-blue-300/60">last 7 days</span>
        </div>
      </div>

      {/* sparkline */}
      <div className="mt-4 h-20">
        {data && data.daily.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.daily} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="views-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fill: "rgba(148,163,184,0.5)", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                interval={3}
              />
              <Tooltip
                cursor={{ stroke: "rgba(139,92,246,0.3)", strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: "rgba(10,14,26,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#e7ecf5",
                }}
                formatter={(value: number) => [`${value} views`, ""]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={1.5}
                fill="url(#views-gradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full animate-pulse rounded bg-white/[0.02]" />
        )}
      </div>

      {/* top projects */}
      {data && data.topProjects.length > 0 && (
        <div className="mt-4 border-t border-white/5 pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Top projects (30 days)
          </p>
          <ul className="space-y-1">
            {data.topProjects.map((p, i) => (
              <motion.li
                key={p.slug}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/projects/${p.slug}`}
                  target="_blank"
                  className="group flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
                >
                  <span className="flex items-center gap-2 truncate text-xs text-foreground/80">
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      {i + 1}.
                    </span>
                    {p.slug.replace(/-/g, " ")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold tabular-nums text-blue-300">
                      {p.views}
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {data && data.total === 0 && (
        <p className="mt-4 border-t border-white/5 pt-3 text-center text-xs text-muted-foreground">
          No views tracked yet. Visit a project page to start collecting.
        </p>
      )}
    </div>
  );
}
