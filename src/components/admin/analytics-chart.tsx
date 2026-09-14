"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

type Day = { day: string; label: string; count: number };

/**
 * 30-day traffic area chart for the dedicated analytics page.
 * Uses ResponsiveContainer + AreaChart like the dashboard widget.
 */
export function AnalyticsAreaChart({ data }: { data: Day[] }) {
  const total = useMemo(() => data.reduce((s, d) => s + d.count, 0), [data]);
  const peak = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="rounded-2xl glass p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          <h2 className="font-display text-base font-semibold">
            Views <span className="text-muted-foreground/60">·</span> last 30 days
          </h2>
        </div>
        <div className="text-right">
          <div className="font-display text-xl font-bold tabular-nums text-foreground">
            {total}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            total views
          </div>
        </div>
      </div>

      <div className="mt-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="views-gradient-30" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="views-stroke-30" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "rgba(148,163,184,0.6)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={5}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "rgba(148,163,184,0.6)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={20}
              domain={[0, peak]}
            />
            <Tooltip
              cursor={{ stroke: "rgba(139,92,246,0.3)", strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: "rgba(10,14,26,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#e7ecf5",
              }}
              labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
              formatter={(value: number) => [`${value} views`, ""]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="url(#views-stroke-30)"
              strokeWidth={2}
              fill="url(#views-gradient-30)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#8b5cf6",
                stroke: "#0a0e1a",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
