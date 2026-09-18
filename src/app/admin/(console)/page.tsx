"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderGit2,
  Inbox,
  MessageSquareQuote,
  Boxes,
  Briefcase,
  GraduationCap,
  Plus,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  TrendingUp,
  Star,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/components/admin/use-async";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { AnalyticsWidget } from "@/components/admin/analytics-widget";

// Lazy-load charts (recharts is heavy) to keep the dashboard compile light.
const MessagesActivityChart = dynamic(
  () => import("@/components/admin/messages-activity-chart").then((m) => m.MessagesActivityChart),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl glass p-5">
        <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
        <div className="mt-4 h-32 animate-pulse rounded bg-white/[0.02]" />
      </div>
    ),
  }
);

const SkillsBreakdownChart = dynamic(
  () => import("@/components/admin/skills-breakdown-chart").then((m) => m.SkillsBreakdownChart),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl glass p-5">
        <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
        <div className="mt-4 h-52 animate-pulse rounded bg-white/[0.02]" />
      </div>
    ),
  }
);

const ProjectTechChart = dynamic(
  () => import("@/components/admin/project-tech-chart").then((m) => m.ProjectTechChart),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl glass p-5">
        <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
        <div className="mt-4 h-52 animate-pulse rounded bg-white/[0.02]" />
      </div>
    ),
  }
);

const ContentDistributionChart = dynamic(
  () => import("@/components/admin/content-distribution-chart").then((m) => m.ContentDistributionChart),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl glass p-5">
        <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
        <div className="mt-4 h-52 animate-pulse rounded bg-white/[0.02]" />
      </div>
    ),
  }
);

type AdminInfo = { admin: { id: string; email: string; name: string | null; lastLoginAt: string | null } };

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  approved: boolean;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    featured: 0,
    skills: 0,
    experience: 0,
    education: 0,
    testimonials: 0,
    testimonialsPending: 0,
    unread: 0,
  });
  const [rawProjects, setRawProjects] = useState<any[]>([]);
  const [rawSkills, setRawSkills] = useState<any[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<any | null>(null);
  const [recentMessages, setRecentMessages] = useState<
    { id: string; name: string; email: string; message: string; createdAt: string; isRead: boolean }[]
  >([]);
  const [allMessages, setAllMessages] = useState<
    { id: string; createdAt: string; isRead: boolean; name?: string }[]
  >([]);
  const [admin, setAdmin] = useState<AdminInfo["admin"] | null>(null);
  const [completeness, setCompleteness] = useState<{
    percent: number;
    items: { label: string; done: boolean }[];
  } | null>(null);
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>(
    []
  );
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [projects, skills, experience, education, testimonials, messagesResp, me, profile, analyticsData] = await Promise.all([
          api<{ length: number } & unknown[]>("/api/projects"),
          api<unknown[]>("/api/skills"),
          api<unknown[]>("/api/experience"),
          api<unknown[]>("/api/education"),
          api<unknown[]>("/api/testimonials?approved=false"),
          api<{ items: any[] } | any[]>("/api/messages?filter=all"),
          api<AdminInfo>("/api/auth/me"),
          api<{
            name: string; title: string; tagline: string; bio: string;
            avatarUrl: string | null;
            socialLinks: Record<string, string>;
            seo: Record<string, string>;
            stats: Record<string, number>;
          }>("/api/profile"),
          fetch("/api/analytics/summary", { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ]);
        // Messages API now returns a paginated envelope { items, total, ... }.
        const messages: any[] = Array.isArray(messagesResp)
          ? messagesResp
          : (messagesResp?.items || []);
        const testimonialsList = Array.isArray(testimonials) ? testimonials : [];
        const projectsList = Array.isArray(projects) ? projects : [];
        const skillsList = Array.isArray(skills) ? skills : [];

        setRawProjects(projectsList);
        setRawSkills(skillsList);
        if (analyticsData) {
          setAnalyticsSummary(analyticsData);
        }

        setStats({
          projects: projectsList.length,
          featured: projectsList.filter((p: any) => p.isFeatured).length,
          skills: skillsList.length,
          experience: Array.isArray(experience) ? experience.length : 0,
          education: Array.isArray(education) ? education.length : 0,
          testimonials: testimonialsList.length,
          testimonialsPending: testimonialsList.filter((t: any) => !t.approved).length,
          unread: messages.filter((m: any) => !m.isRead).length,
        });
        setRecentMessages(
          messages.slice(0, 4).map((m: any) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            message: m.message,
            createdAt: m.createdAt,
            isRead: m.isRead,
          }))
        );
        setAllMessages(
          messages.map((m: any) => ({
            id: m.id,
            name: m.name,
            createdAt: m.createdAt,
            isRead: m.isRead,
          }))
        );
        setAdmin(me.admin);
        // Pending testimonials (client-side filter on `!approved`).
        const pending: Testimonial[] = (Array.isArray(testimonials) ? testimonials : [])
          .filter((t: any) => !t.approved)
          .slice(0, 3)
          .map((t: any) => ({
            id: t.id,
            name: t.name,
            role: t.role,
            company: t.company,
            message: t.message,
            approved: !!t.approved,
            createdAt: t.createdAt,
          }));
        setPendingTestimonials(pending);
        setCompleteness(computeProfileCompleteness(profile as ProfileShape, {
          projects: Array.isArray(projects) ? projects.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        }));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const approveTestimonial = async (id: string) => {
    // Optimistic update: remove from pending list immediately.
    const snapshot = pendingTestimonials;
    setPendingTestimonials((prev) => prev.filter((t) => t.id !== id));
    setApprovingId(id);
    try {
      await api(`/api/testimonials/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ approved: true }),
      });
      toast.success("Testimonial approved");
    } catch (e) {
      // rollback
      setPendingTestimonials(snapshot);
      toast.error("Failed to approve", { description: (e as Error).message });
    } finally {
      setApprovingId(null);
    }
  };

  const cards = [
    {
      label: "Total projects",
      value: stats.projects,
      icon: FolderGit2,
      href: "/admin/projects",
      color: "from-blue-500 to-cyan-400",
      hint: `${stats.featured} featured`,
    },
    {
      label: "Skills tracked",
      value: stats.skills,
      icon: Boxes,
      href: "/admin/skills",
      color: "from-emerald-500 to-teal-400",
      hint: "across categories",
    },
    {
      label: "Experience roles",
      value: stats.experience,
      icon: Briefcase,
      href: "/admin/experience",
      color: "from-indigo-500 to-blue-400",
      hint: "career milestones",
    },
    {
      label: "Education",
      value: stats.education,
      icon: GraduationCap,
      href: "/admin/education",
      color: "from-teal-500 to-emerald-400",
      hint: "academic degrees",
    },
    {
      label: "Testimonials",
      value: stats.testimonials,
      icon: MessageSquareQuote,
      href: "/admin/testimonials",
      color: "from-amber-500 to-orange-400",
      hint: `${stats.testimonialsPending} pending approval`,
    },
    {
      label: "Unread messages",
      value: stats.unread,
      icon: Inbox,
      href: "/admin/messages",
      color: "from-violet-500 to-fuchsia-500",
      hint: stats.unread > 0 ? "needs attention" : "all caught up",
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Dashboard
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back{admin?.name ? `, ${admin.name}` : ""} 👋
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your portfolio today.
          </p>
        </motion.div>

        {/* Quick Actions Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-foreground hover:border-blue-500/40 hover:bg-white/10 hover:text-white transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 text-blue-400" />
            <span>Project</span>
          </Link>
          <Link
            href="/admin/skills"
            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-foreground hover:border-emerald-500/40 hover:bg-white/10 hover:text-white transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-400" />
            <span>Skill</span>
          </Link>
          <Link
            href="/admin/experience"
            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-foreground hover:border-violet-500/40 hover:bg-white/10 hover:text-white transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 text-violet-400" />
            <span>Experience</span>
          </Link>
          <Link
            href="/admin/education"
            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-foreground hover:border-cyan-500/40 hover:bg-white/10 hover:text-white transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 text-cyan-400" />
            <span>Education</span>
          </Link>
        </div>
      </header>

      {/* stat cards */}
      <div className="grid gap-2 sm:gap-3 grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
            >
              <Link
                href={card.href}
                className="group relative block overflow-hidden rounded-xl glass p-3 sm:p-4 transition-all hover:bg-white/[0.06] hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div
                  className={`absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br ${card.color} opacity-20 blur-xl transition-opacity group-hover:opacity-40`}
                />
                <div className="flex items-start justify-between">
                  <div
                    className={`grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-lg bg-gradient-to-br ${card.color} text-white shadow-md`}
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <div className="mt-2 sm:mt-2.5 font-display text-xl sm:text-2xl font-bold tracking-tight">
                  {card.value}
                </div>
                <div className="mt-0.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">
                  {card.label}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground/75 truncate">{card.hint}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Portfolio Activity & Inquiries Chart */}
      <MessagesActivityChart
        messages={allMessages}
        viewsData={analyticsSummary?.daily30 || analyticsSummary?.daily || []}
      />

      {/* Row of dedicated domain & project charts */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SkillsBreakdownChart skills={rawSkills} />
        <ProjectTechChart
          projects={rawProjects}
          projectViews={analyticsSummary?.projectViews || []}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left: Content Distribution & Recent messages */}
        <div className="lg:col-span-2 space-y-5">
          <ContentDistributionChart stats={stats} />

          {/* recent messages */}
          <div className="rounded-2xl glass p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">Recent messages</h2>
              <Link
                href="/admin/messages"
                className="text-xs font-medium text-blue-400 hover:text-blue-300"
              >
                View all →
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentMessages.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-start gap-3 rounded-xl bg-white/[0.02] p-3 transition-colors hover:bg-white/5"
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        m.isRead ? "bg-white/20" : "bg-blue-400"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{m.name}</span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {timeAgo(m.createdAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {m.message}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* right column: analytics + pending testimonials + profile + last login */}
        <div className="space-y-5">
          <AnalyticsWidget />

          {/* Pending testimonials quick-approve */}
          <div className="rounded-2xl glass p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="h-4 w-4 text-amber-400" />
                <h2 className="font-display text-base font-semibold">Pending testimonials</h2>
              </div>
              <Link
                href="/admin/testimonials"
                className="text-xs font-medium text-blue-400 hover:text-blue-300"
              >
                View all →
              </Link>
            </div>
            {pendingTestimonials.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-3 text-xs text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                No pending approvals — you&apos;re all caught up.
              </div>
            ) : (
              <ul className="space-y-2">
                {pendingTestimonials.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-[11px] font-bold text-white">
                        {t.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-sm font-medium">{t.name}</span>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {timeAgo(t.createdAt)}
                          </span>
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {t.role} @ {t.company}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-foreground/70">
                      {t.message}
                    </p>
                    <div className="mt-2.5 flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => approveTestimonial(t.id)}
                        disabled={approvingId === t.id}
                        className="h-7 gap-1.5 bg-gradient-to-r from-blue-500 to-violet-600 px-2 text-xs text-white hover:opacity-90"
                      >
                        {approvingId === t.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        Approve
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl glass p-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-violet-400" />
              <h2 className="font-display text-base font-semibold">Profile completeness</h2>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-16 w-16">
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 176" }}
                    animate={{
                      strokeDasharray: `${((completeness?.percent ?? 0) / 100) * 176} 176`,
                    }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center font-display text-sm font-bold tabular-nums">
                  {completeness === null ? "…" : `${completeness.percent}%`}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  {(completeness?.percent ?? 0) >= 100
                    ? "Your profile is complete. Nice."
                    : "Fill in the gaps to improve your portfolio."}
                </p>
                <Link
                  href="/admin/profile"
                  className="mt-2 inline-block text-xs font-medium text-blue-400 hover:text-blue-300"
                >
                  Edit profile →
                </Link>
              </div>
            </div>
            {/* checklist */}
            <ul className="mt-4 grid grid-cols-2 gap-1.5 text-[11px]">
              {(completeness?.items ?? []).map((c) => (
                <li
                  key={c.label}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-1",
                    c.done ? "text-emerald-300/80" : "text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-3.5 w-3.5 place-items-center rounded-full",
                      c.done ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-muted-foreground"
                    )}
                  >
                    {c.done ? "✓" : "·"}
                  </span>
                  {c.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl glass p-5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <h2 className="font-display text-base font-semibold">Last login</h2>
            </div>
            <p className="mt-3 text-sm text-foreground/80">
              {admin?.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : "First login"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Signed in as {admin?.email}
            </p>
          </div>

          <div className="rounded-2xl glass p-5">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" />
              <h2 className="font-display text-base font-semibold">Quick actions</h2>
            </div>
            <div className="mt-3 grid gap-2">
              <Link
                href="/admin/projects"
                className="rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-foreground/80 transition-colors hover:bg-white/10"
              >
                + Add a project
              </Link>
              <Link
                href="/admin/testimonials"
                className="rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-foreground/80 transition-colors hover:bg-white/10"
              >
                + Add a testimonial
              </Link>
              <Link
                href="/admin/profile"
                className="rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-foreground/80 transition-colors hover:bg-white/10"
              >
                ✎ Update hero text
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ProfileShape = {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatarUrl: string | null;
  socialLinks: Record<string, string>;
  seo: Record<string, string>;
  stats: Record<string, number>;
};

type Counts = { projects: number; skills: number; testimonials: number };

function computeProfileCompleteness(profile: ProfileShape, counts: Counts): {
  percent: number;
  items: { label: string; done: boolean }[];
} {
  const socials = profile.socialLinks || {};
  const items = [
    { label: "Name", done: !!profile.name?.trim() },
    { label: "Title", done: !!profile.title?.trim() },
    { label: "Tagline", done: !!profile.tagline?.trim() && profile.tagline.length > 20 },
    { label: "Bio", done: !!profile.bio?.trim() && profile.bio.length > 60 },
    { label: "Avatar", done: !!profile.avatarUrl?.trim() },
    { label: "GitHub link", done: !!socials.github?.trim() },
    { label: "LinkedIn link", done: !!socials.linkedin?.trim() },
    { label: "Contact email", done: !!socials.email?.trim() },
    { label: "SEO title", done: !!profile.seo?.title?.trim() },
    { label: "SEO description", done: !!profile.seo?.description?.trim() },
    { label: "≥3 projects", done: counts.projects >= 3 },
    { label: "≥5 skills", done: counts.skills >= 5 },
    { label: "≥1 testimonial", done: counts.testimonials >= 1 },
    { label: "Stats filled", done: Object.keys(profile.stats || {}).length >= 3 },
  ];
  const done = items.filter((i) => i.done).length;
  return { percent: Math.round((done / items.length) * 100), items };
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
  return `${days}d ago`;
}
