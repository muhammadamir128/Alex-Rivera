"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderGit2,
  Boxes,
  Briefcase,
  MessageSquareQuote,
  Inbox,
  UserRound,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Search,
  Image as ImageIcon,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/admin/command-palette";
import { ShortcutsHelp, ShortcutsHelpButton } from "@/components/admin/shortcuts-help";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/skills", label: "Skills", icon: Boxes },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [admin, setAdmin] = useState<{ name: string | null; email: string } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.admin) setAdmin({ name: data.admin.name, email: data.admin.email });
        else router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  useEffect(() => {
    fetch("/api/messages?filter=unread", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        // The messages API now returns a paginated envelope { items, total, ... }.
        const items = data?.items;
        setUnreadCount(Array.isArray(items) ? items.length : Array.isArray(data) ? data.length : 0);
      })
      .catch(() => {});
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#070a14] text-foreground">
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
      <ShortcutsHelp open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.07] bg-[#080b16]/95 backdrop-blur-2xl shadow-[1px_0_0_0_rgba(255,255,255,0.02)] lg:flex">
        {/* subtle vertical accent line */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-500/15 to-transparent" />
        <SidebarContent
          pathname={pathname}
          unreadCount={unreadCount}
          admin={admin}
          onLogout={logout}
          onOpenCmd={() => setCmdOpen(true)}
          onOpenShortcuts={() => setShortcutsOpen(true)}
        />
      </aside>

      {/* mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-[#0a0e1a]/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
            AR
          </span>
          <span className="font-display text-sm font-semibold">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <CmdKButton onClick={() => setCmdOpen(true)} />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg glass"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-[#0a0e1a] lg:hidden"
            >
              <SidebarContent
                pathname={pathname}
                unreadCount={unreadCount}
                admin={admin}
                onLogout={logout}
                onNavigate={() => setMobileOpen(false)}
                onOpenCmd={() => {
                  setMobileOpen(false);
                  setCmdOpen(true);
                }}
                onOpenShortcuts={() => {
                  setMobileOpen(false);
                  setShortcutsOpen(true);
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}

function SidebarContent({
  pathname,
  unreadCount,
  admin,
  onLogout,
  onNavigate,
  onOpenCmd,
  onOpenShortcuts,
}: {
  pathname: string;
  unreadCount: number;
  admin: { name: string | null; email: string } | null;
  onLogout: () => void;
  onNavigate?: () => void;
  onOpenCmd?: () => void;
  onOpenShortcuts?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-white/5 px-5 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 font-display text-sm font-bold text-white shadow-lg shadow-blue-500/30">
          AR
        </span>
        <div>
          <div className="font-display text-sm font-semibold">Portfolio</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Admin Console
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {onOpenCmd && (
          <button
            onClick={onOpenCmd}
            className="mb-2 flex w-full items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Quick search…</span>
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium">
              ⌘K
            </kbd>
          </button>
        )}
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-blue-500/15 to-violet-600/10 text-foreground ring-1 ring-white/10"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 -translate-y-1/2 w-0.5 rounded-full bg-gradient-to-b from-blue-400 to-violet-500" />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
              {item.href === "/admin/messages" && unreadCount > 0 && (
                <span className="ml-auto rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-3">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View public site
        </Link>
        {onOpenShortcuts && (
          <div className="mt-1">
            <ShortcutsHelpButton onClick={onOpenShortcuts} />
          </div>
        )}
        <div className="mt-2 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
            {(admin?.name || admin?.email || "A").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-foreground">
              {admin?.name || "Admin"}
            </div>
            <div className="truncate text-[10px] text-muted-foreground">{admin?.email}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-7 w-7 text-muted-foreground hover:text-red-300"
            aria-label="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/** A small pill button that opens the command palette (and shows the ⌘K shortcut hint on desktop). */
function CmdKButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open command palette"
      className="flex h-9 items-center gap-1.5 rounded-lg glass px-2.5 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
    >
      <Search className="h-4 w-4" />
      <kbd className="hidden text-[10px] font-medium sm:inline">⌘K</kbd>
    </button>
  );
}
