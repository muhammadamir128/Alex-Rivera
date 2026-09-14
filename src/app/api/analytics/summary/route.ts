import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok } from "@/lib/api";

/**
 * Admin-only endpoint returning analytics summary.
 * Returns:
 * - total page views
 * - views in last 7 days
 * - views in last 30 days
 * - per-project view counts (all-time, with slug)
 * - daily buckets for last 14 days (kept for the dashboard widget)
 * - daily buckets for last 30 days (for the dedicated analytics page chart)
 * - recent views: last 10 page views with path + timestamp
 */
export async function GET(_request: NextRequest) {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const sevenDaysAgoStr = ymd(sevenDaysAgo);
  const thirtyDaysAgoStr = ymd(thirtyDaysAgo);

  const [
    total,
    last7,
    last30,
    topProjectsAllTime,
    topProjects30Days,
    dailyBuckets14,
    dailyBuckets30,
    recentViews,
  ] = await Promise.all([
    db.pageView.count(),
    db.pageView.count({ where: { day: { gte: sevenDaysAgoStr } } }),
    db.pageView.count({ where: { day: { gte: thirtyDaysAgoStr } } }),
    // All-time top projects by views (slug only)
    db.pageView.groupBy({
      by: ["slug"],
      where: { slug: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    // Top projects in the last 30 days (kept for dashboard widget)
    db.pageView.groupBy({
      by: ["slug"],
      where: {
        slug: { not: null },
        day: { gte: thirtyDaysAgoStr },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    // Daily buckets for last 14 days (dashboard widget)
    (async () => {
      const days = buildDayBuckets(now, 14);
      const views = await db.pageView.groupBy({
        by: ["day"],
        where: { day: { gte: days[0].day } },
        _count: { id: true },
      });
      const map = new Map(views.map((v) => [v.day, v._count.id]));
      return days.map((d) => ({ ...d, count: map.get(d.day) || 0 }));
    })(),
    // Daily buckets for last 30 days (analytics page chart)
    (async () => {
      const days = buildDayBuckets(now, 30);
      const views = await db.pageView.groupBy({
        by: ["day"],
        where: { day: { gte: days[0].day } },
        _count: { id: true },
      });
      const map = new Map(views.map((v) => [v.day, v._count.id]));
      return days.map((d) => ({ ...d, count: map.get(d.day) || 0 }));
    })(),
    // Recent views (last 10) — path + createdAt
    db.pageView.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, path: true, slug: true, createdAt: true },
    }),
  ]);

  const allTimeViews = topProjectsAllTime.reduce((s, t) => s + t._count.id, 0) || 1;

  return ok({
    total,
    last7,
    last30,
    avgDaily: Math.round((last30 / 30) * 10) / 10,
    topProjects: topProjects30Days.map((t) => ({
      slug: t.slug,
      views: t._count.id,
    })),
    projectViews: topProjectsAllTime.map((t) => ({
      slug: t.slug as string,
      views: t._count.id,
      percent: Math.round((t._count.id / allTimeViews) * 1000) / 10,
    })),
    daily: dailyBuckets14,
    daily30: dailyBuckets30,
    recentViews: recentViews.map((v) => ({
      id: v.id,
      path: v.path,
      slug: v.slug,
      createdAt: v.createdAt.toISOString(),
    })),
  });
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildDayBuckets(now: Date, days: number) {
  const out: { day: string; label: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push({
      day: ymd(d),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: 0,
    });
  }
  return out;
}
