"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  BarChart3,
  Eye,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Activity,
  Globe,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Summary = {
  total: number;
  last7: number;
  last30: number;
  avgDaily: number;
  topProjects: { slug: string; views: number }[];
  projectViews: {
    slug: string;
    views: number;
    percent: number;
  }[];
  daily: { day: string; label: string; count: number }[];
  daily30: { day: string; label: string; count: number }[];
  recentViews: {
    id: string;
    path: string;
    slug: string | null;
    createdAt: string;
  }[];
};

// Lazy-load the chart (recharts is heavy) so the page shell renders fast.
const AnalyticsAreaChart = dynamic(
  () => import("@/components/admin/analytics-chart").then((m) => m.AnalyticsAreaChart),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl glass p-5">
        <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
        <div className="mt-4 h-64 animate-pulse rounded bg-white/[0.02]" />
      </div>
    ),
  }
);

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/summary", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxProjectViews = useMemo(() => {
    if (!data) return 1;
    return Math.max(...data.projectViews.map((p) => p.views), 1);
  }, [data]);

  const cards = [
    {
      label: "Total views",
      value: data?.total ?? 0,
      icon: Eye,
      color: "from-blue-500 to-cyan-400",
      hint: "all-time",
    },
    {
      label: "Last 7 days",
      value: data?.last7 ?? 0,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-400",
      hint: "rolling week",
    },
    {
      label: "Last 30 days",
      value: data?.last30 ?? 0,
      icon: Calendar,
      color: "from-violet-500 to-fuchsia-500",
      hint: "rolling month",
    },
    {
      label: "Avg / day",
      value: data?.avgDaily ?? 0,
      icon: Activity,
      color: "from-amber-500 to-orange-400",
      hint: "30-day average",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Traffic insights"
        description="See how visitors are finding and exploring your portfolio."
        icon={BarChart3}
      />

      {/* stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
            >
              <div className="relative overflow-hidden rounded-2xl glass p-5">
                <div
                  className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${card.color} opacity-20 blur-2xl`}
                />
                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {loading ? (
                  <Skeleton className="mt-4 h-9 w-16" />
                ) : (
                  <div className="mt-4 font-display text-3xl font-bold tabular-nums tracking-tight">
                    {card.value}
                  </div>
                )}
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground/80">{card.hint}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 30-day area chart */}
      {loading ? (
        <Skeleton className="h-80 w-full rounded-2xl" />
      ) : (
        <AnalyticsAreaChart data={data?.daily30 ?? []} />
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Top projects (all-time) */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl glass p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <h2 className="font-display text-base font-semibold">
                  Top projects <span className="text-muted-foreground/60">·</span> all time
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                by views
              </span>
            </div>

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-lg" />
                ))}
              </div>
            ) : !data || data.projectViews.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No project views recorded yet. Visit a project page on the public site to start
                collecting.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[460px] text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-3 py-2 font-medium">#</th>
                      <th className="px-3 py-2 font-medium">Project</th>
                      <th className="px-3 py-2 font-medium">Views</th>
                      <th className="px-3 py-2 font-medium">%</th>
                      <th className="px-3 py-2 font-medium">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.projectViews.map((p, i) => (
                      <tr
                        key={p.slug}
                        className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-3 py-2.5 align-middle font-mono text-[11px] text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-3 py-2.5 align-middle">
                          <Link
                            href={`/projects/${p.slug}`}
                            target="_blank"
                            className="group inline-flex items-center gap-1.5 font-medium text-foreground hover:text-blue-300"
                          >
                            <span className="truncate">{p.slug.replace(/-/g, " ")}</span>
                            <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 align-middle font-mono tabular-nums text-blue-300">
                          {p.views}
                        </td>
                        <td className="px-3 py-2.5 align-middle font-mono tabular-nums text-muted-foreground">
                          {p.percent}%
                        </td>
                        <td className="px-3 py-2.5 align-middle">
                          <div className="h-1.5 w-full max-w-[180px] overflow-hidden rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-600"
                              style={{
                                width: `${Math.max(
                                  4,
                                  Math.round((p.views / maxProjectViews) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="space-y-5">
          <div className="rounded-2xl glass p-5">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-violet-400" />
              <h2 className="font-display text-base font-semibold">Recent activity</h2>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-lg" />
                ))}
              </div>
            ) : !data || data.recentViews.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No page views tracked yet.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {data.recentViews.map((v) => {
                  const label = v.slug
                    ? v.slug.replace(/-/g, " ")
                    : v.path === "/"
                    ? "home"
                    : v.path.replace(/^\//, "").replace(/-/g, " ") || "home";
                  return (
                    <motion.li
                      key={v.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.02] px-2.5 py-2 transition-colors hover:bg-white/[0.04]"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Globe className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <Link
                          href={v.path}
                          target="_blank"
                          className="truncate text-xs font-medium text-foreground/80 hover:text-blue-300"
                          title={v.path}
                        >
                          {label}
                        </Link>
                      </span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {timeAgo(v.createdAt)}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-2xl glass p-5">
            <div className="mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-400" />
              <h2 className="font-display text-base font-semibold">Top (30 days)</h2>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-full rounded-lg" />
                ))}
              </div>
            ) : !data || data.topProjects.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">No data yet.</p>
            ) : (
              <ul className="space-y-1">
                {data.topProjects.map((p, i) => (
                  <li key={p.slug}>
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
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-start gap-3"
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 ring-1 ring-white/10">
        <Icon className="h-5 w-5 text-blue-300" />
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-blue-400">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
