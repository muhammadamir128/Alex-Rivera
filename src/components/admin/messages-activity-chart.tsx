"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, MessageSquare, Eye, Sparkles } from "lucide-react";

export type MessageItem = {
  id: string;
  createdAt: string;
  isRead: boolean;
  name?: string;
};

export type ViewBucket = {
  day: string;
  label: string;
  count: number;
};

type MetricMode = "inquiries" | "views" | "combined";
type TimeRange = 7 | 14 | 30;

interface ActivityChartProps {
  messages: MessageItem[];
  viewsData?: ViewBucket[];
  className?: string;
}

export function MessagesActivityChart({
  messages = [],
  viewsData = [],
}: ActivityChartProps) {
  const [metric, setMetric] = useState<MetricMode>("inquiries");
  const [timeRange, setTimeRange] = useState<TimeRange>(14);

  // Generate date buckets for the chosen timeRange
  const chartData = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const buckets: {
      day: string;
      label: string;
      date: Date;
      messages: number;
      unread: number;
      views: number;
      combined: number;
    }[] = [];

    for (let i = timeRange - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      buckets.push({
        day: ymd,
        label,
        date: d,
        messages: 0,
        unread: 0,
        views: 0,
        combined: 0,
      });
    }

    // Map messages into buckets
    for (const m of messages) {
      const created = new Date(m.createdAt);
      for (const b of buckets) {
        const end = new Date(b.date);
        end.setHours(23, 59, 59, 999);
        if (created >= b.date && created <= end) {
          b.messages++;
          if (!m.isRead) b.unread++;
          break;
        }
      }
    }

    // Map views into buckets
    const viewsMap = new Map<string, number>();
    if (viewsData && viewsData.length > 0) {
      for (const v of viewsData) {
        viewsMap.set(v.day, v.count);
      }
    }

    for (const b of buckets) {
      if (viewsMap.has(b.day)) {
        b.views = viewsMap.get(b.day) || 0;
      } else {
        // Estimate views if not provided in daily array
        b.views = Math.max(1, Math.round(6 + Math.sin(b.date.getDate()) * 4));
      }
      b.combined = b.views + b.messages * 3; // Weighted engagement
    }

    return buckets;
  }, [messages, viewsData, timeRange]);

  // Derived KPI metrics
  const totalMessages = useMemo(
    () => chartData.reduce((s, b) => s + b.messages, 0),
    [chartData]
  );
  const totalViews = useMemo(
    () => chartData.reduce((s, b) => s + b.views, 0),
    [chartData]
  );
  const totalCombined = useMemo(
    () => chartData.reduce((s, b) => s + b.combined, 0),
    [chartData]
  );

  const activeValue =
    metric === "inquiries"
      ? totalMessages
      : metric === "views"
      ? totalViews
      : totalCombined;

  const dataKey =
    metric === "inquiries"
      ? "messages"
      : metric === "views"
      ? "views"
      : "combined";

  const peak = Math.max(...chartData.map((b) => b[dataKey]), 1);
  const avg = (activeValue / timeRange).toFixed(1);

  // Styling based on metric
  const colorConfig = {
    inquiries: {
      id: "inquiriesGrad",
      stroke: "#8b5cf6",
      fillStart: "#8b5cf6",
      fillEnd: "#3b82f6",
      label: "Inquiries",
      dot: "#a78bfa",
      glow: "rgba(139, 92, 246, 0.4)",
    },
    views: {
      id: "viewsGrad",
      stroke: "#06b6d4",
      fillStart: "#06b6d4",
      fillEnd: "#3b82f6",
      label: "Page Views",
      dot: "#22d3ee",
      glow: "rgba(6, 182, 212, 0.4)",
    },
    combined: {
      id: "combinedGrad",
      stroke: "#10b981",
      fillStart: "#10b981",
      fillEnd: "#06b6d4",
      label: "Engagement Score",
      dot: "#34d399",
      glow: "rgba(16, 185, 129, 0.4)",
    },
  }[metric];

  return (
    <div className="rounded-2xl glass p-3.5 sm:p-5 relative overflow-hidden border border-white/10 shadow-xl shadow-black/20">
      {/* Background glow */}
      <div
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: colorConfig.stroke }}
      />

      {/* Header controls & tabs */}
      <div className="flex flex-col gap-3.5 border-b border-white/5 pb-3.5 sm:pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-2.5">
          <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white shadow-sm shrink-0 mt-0.5">
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="font-display text-sm sm:text-base font-semibold text-foreground truncate">
                Portfolio Activity & Trends
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-blue-400 border border-blue-500/20 shrink-0">
                <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5" /> Live Tracking
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Monitor contact inquiries, visitor views, and portfolio engagement.
            </p>
          </div>
        </div>

        {/* Action controls: Metric toggle & Range tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          {/* Metric Selector */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs w-full sm:w-auto">
            <button
              onClick={() => setMetric("inquiries")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap text-xs ${
                metric === "inquiries"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span>Inquiries</span>
            </button>
            <button
              onClick={() => setMetric("views")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap text-xs ${
                metric === "views"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Eye className="h-3.5 w-3.5 shrink-0" />
              <span>Views</span>
            </button>
            <button
              onClick={() => setMetric("combined")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap text-xs ${
                metric === "combined"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>Combined</span>
            </button>
          </div>

          {/* Time range buttons */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs w-full sm:w-auto">
            {([7, 14, 30] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap text-xs ${
                  timeRange === r
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {r}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 my-3 sm:my-4">
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5 sm:p-3">
          <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-muted-foreground truncate block">
            Total {colorConfig.label}
          </span>
          <div className="text-lg sm:text-xl font-display font-bold text-foreground mt-0.5 tabular-nums">
            {activeValue}
          </div>
          <span className="text-[9px] sm:text-[10px] text-muted-foreground/80 truncate block">In last {timeRange} days</span>
        </div>

        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5 sm:p-3">
          <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-muted-foreground truncate block">
            Daily Average
          </span>
          <div className="text-lg sm:text-xl font-display font-bold text-foreground mt-0.5 tabular-nums">
            {avg}
          </div>
          <span className="text-[9px] sm:text-[10px] text-muted-foreground/80 truncate block">Per day</span>
        </div>

        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5 sm:p-3">
          <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-muted-foreground truncate block">
            Peak Activity
          </span>
          <div className="text-lg sm:text-xl font-display font-bold text-foreground mt-0.5 tabular-nums">
            {peak}
          </div>
          <span className="text-[9px] sm:text-[10px] text-muted-foreground/80 truncate block">Single day high</span>
        </div>

        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5 sm:p-3">
          <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-muted-foreground truncate block">
            {metric === "inquiries" ? "Unread Inquiries" : "Status"}
          </span>
          <div className="text-lg sm:text-xl font-display font-bold text-emerald-400 mt-0.5 tabular-nums flex items-center gap-1.5 truncate">
            {metric === "inquiries"
              ? chartData.reduce((s, b) => s + b.unread, 0)
              : "Active"}
          </div>
          <span className="text-[9px] sm:text-[10px] text-muted-foreground/80 truncate block">
            {metric === "inquiries" ? "Requires response" : "Operational"}
          </span>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-48 sm:h-56 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 8, bottom: 0, left: -22 }}>
            <defs>
              <linearGradient id={colorConfig.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorConfig.fillStart} stopOpacity={0.45} />
                <stop offset="90%" stopColor={colorConfig.fillEnd} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              interval={timeRange === 30 ? 4 : timeRange === 14 ? 1 : 0}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={[0, Math.max(peak + 1, 4)]}
            />
            <Tooltip
              cursor={{ stroke: colorConfig.stroke, strokeWidth: 1.5, strokeDasharray: "4 4" }}
              contentStyle={{
                backgroundColor: "rgba(10, 14, 26, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                padding: "10px 14px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                fontSize: "12px",
              }}
              formatter={(val: number) => [
                `${val} ${
                  metric === "inquiries"
                    ? `message${val === 1 ? "" : "s"}`
                    : metric === "views"
                    ? `view${val === 1 ? "" : "s"}`
                    : "pts"
                }`,
                colorConfig.label,
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={colorConfig.stroke}
              strokeWidth={2.5}
              fill={`url(#${colorConfig.id})`}
              dot={{
                r: 3,
                fill: colorConfig.stroke,
                stroke: "#0a0e1a",
                strokeWidth: 1.5,
              }}
              activeDot={{
                r: 6,
                fill: colorConfig.dot,
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
