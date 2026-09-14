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

type Message = {
  id: string;
  createdAt: string;
  isRead: boolean;
};

type Bucket = {
  label: string;
  date: Date;
  count: number;
  unread: number;
};

/**
 * A compact area chart showing messages received over the last 14 days.
 * Pure presentation — no interactivity beyond hover tooltips.
 */
export function MessagesActivityChart({ messages }: { messages: Message[] }) {
  const data = useMemo(() => {
    const days = 14;
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const buckets: Bucket[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      buckets.push({
        date: d,
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: 0,
        unread: 0,
      });
    }

    for (const m of messages) {
      const created = new Date(m.createdAt);
      for (const b of buckets) {
        const end = new Date(b.date);
        end.setHours(23, 59, 59, 999);
        if (created >= b.date && created <= end) {
          b.count++;
          if (!m.isRead) b.unread++;
          break;
        }
      }
    }

    return buckets;
  }, [messages]);

  const total = data.reduce((sum, b) => sum + b.count, 0);
  const peak = Math.max(...data.map((b) => b.count), 1);

  return (
    <div className="rounded-2xl glass p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          <h2 className="font-display text-base font-semibold">
            Messages activity
          </h2>
        </div>
        <div className="text-right">
          <div className="font-display text-xl font-bold tabular-nums text-foreground">
            {total}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            last 14 days
          </div>
        </div>
      </div>

      <div className="mt-4 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="msg-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="msg-stroke" x1="0" y1="0" x2="1" y2="0">
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
              interval={3}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "rgba(148,163,184,0.6)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={16}
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
              formatter={(value: number) => [
                `${value} message${value === 1 ? "" : "s"}`,
                "Received",
              ]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="url(#msg-stroke)"
              strokeWidth={2}
              fill="url(#msg-gradient)"
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
