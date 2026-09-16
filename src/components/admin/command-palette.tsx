"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Boxes,
  Briefcase,
  MessageSquareQuote,
  Inbox,
  UserRound,
  Settings,
  Home,
  Search,
  CornerDownLeft,
  Image as ImageIcon,
  BarChart3,
  Hash,
  Loader2,
  GraduationCap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Cmd = {
  id: string;
  label: string;
  hint: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "Navigate" | "Admin" | "Public";
};

const COMMANDS: Cmd[] = [
  { id: "dashboard", label: "Dashboard", hint: "Overview", href: "/admin", icon: LayoutDashboard, group: "Admin" },
  { id: "projects", label: "Projects", hint: "Manage projects", href: "/admin/projects", icon: FolderGit2, group: "Admin" },
  { id: "skills", label: "Skills", hint: "Manage skills", href: "/admin/skills", icon: Boxes, group: "Admin" },
  { id: "experience", label: "Experience", hint: "Manage experience", href: "/admin/experience", icon: Briefcase, group: "Admin" },
  { id: "education", label: "Education", hint: "Manage degrees & study", href: "/admin/education", icon: GraduationCap, group: "Admin" },
  { id: "testimonials", label: "Testimonials", hint: "Manage testimonials", href: "/admin/testimonials", icon: MessageSquareQuote, group: "Admin" },
  { id: "messages", label: "Messages", hint: "Inbox", href: "/admin/messages", icon: Inbox, group: "Admin" },
  { id: "media", label: "Media", hint: "Library & uploads", href: "/admin/media", icon: ImageIcon, group: "Admin" },
  { id: "analytics", label: "Analytics", hint: "Traffic insights", href: "/admin/analytics", icon: BarChart3, group: "Admin" },
  { id: "profile", label: "Profile", hint: "Edit hero/about", href: "/admin/profile", icon: UserRound, group: "Admin" },
  { id: "settings", label: "Settings", hint: "Password & SEO", href: "/admin/settings", icon: Settings, group: "Admin" },
  { id: "public", label: "View public site", hint: "Open /", href: "/", icon: Home, group: "Public" },
];

type ContentType = "project" | "skill" | "experience" | "testimonial" | "message";

type ContentResult = {
  type: ContentType;
  id: string;
  title: string;
  subtitle: string | null;
  href: string;
};

type SearchResponse = {
  groups: { type: ContentType; label: string; results: ContentResult[] }[];
};

// Lucide icon per content type, for visual variety.
const CONTENT_ICON: Record<ContentType, React.ComponentType<{ className?: string }>> = {
  project: FolderGit2,
  skill: Boxes,
  experience: Briefcase,
  testimonial: MessageSquareQuote,
  message: Inbox,
};

// A flat render item used to keep keyboard navigation indices stable.
type RenderItem =
  | {
      kind: "command";
      key: string;
      label: string;
      hint: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
      groupLabel: string;
      groupId: string;
    }
  | {
      kind: "content";
      key: string;
      label: string;
      hint: string | null;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
      groupLabel: string;
      groupId: string;
    };

export function CommandPalette({
  open: controlledOpen,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [contentGroups, setContentGroups] = useState<SearchResponse["groups"]>([]);
  const [searching, setSearching] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
      // "/" focuses search on list pages (only when not already in an input)
      if (
        e.key === "/" &&
        !open &&
        !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)
      ) {
        const search = document.querySelector<HTMLInputElement>(
          'input[placeholder*="earch" i], input[placeholder*="title" i], input[placeholder*="message" i]'
        );
        if (search) {
          e.preventDefault();
          search.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus the input when the palette opens.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Debounced content search: only fire when query > 2 chars.
  useEffect(() => {
    const q = query.trim();
    if (q.length <= 2) {
      // Defer the reset to a microtask so we don't call setState synchronously
      // in the effect body (which triggers cascading renders).
      const raf = setTimeout(() => {
        setContentGroups([]);
        setSearching(false);
      }, 0);
      return () => clearTimeout(raf);
    }
    const raf = setTimeout(() => {
      setSearching(true);
    }, 0);
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : { groups: [] }))
        .then((data: SearchResponse) => {
          setContentGroups(data.groups || []);
        })
        .catch(() => setContentGroups([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => {
      clearTimeout(raf);
      clearTimeout(t);
    };
  }, [query]);

  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    );
  }, [query]);

  // Build a stable flat list of render items + their group sections.
  // Items are grouped in order: nav commands (by group), then content
  // results (by group). Each item carries a stable index based on its
  // position in this flat array, used for keyboard navigation.
  const { items, sections } = useMemo(() => {
    const items: RenderItem[] = [];
    const sections: { id: string; label: string; startIndex: number; count: number }[] = [];

    // Group nav commands by their `group` field, preserving COMMANDS order.
    const navByGroup = new Map<string, Cmd[]>();
    filteredCommands.forEach((c) => {
      const arr = navByGroup.get(c.group) || [];
      arr.push(c);
      navByGroup.set(c.group, arr);
    });
    navByGroup.forEach((cmds, group) => {
      const startIndex = items.length;
      cmds.forEach((cmd) => {
        items.push({
          kind: "command",
          key: `cmd-${cmd.id}`,
          label: cmd.label,
          hint: cmd.hint,
          href: cmd.href,
          icon: cmd.icon,
          groupLabel: group,
          groupId: `nav-${group}`,
        });
      });
      sections.push({
        id: `nav-${group}`,
        label: group,
        startIndex,
        count: cmds.length,
      });
    });

    // Then content search groups.
    if (contentGroups.length > 0) {
      const startIndex = items.length;
      // Insert a section header for "Content" so the user sees the split.
      // We'll model content as a single "Content" section that contains
      // sub-labels inline.
      contentGroups.forEach((g) => {
        g.results.forEach((r) => {
          items.push({
            kind: "content",
            key: `content-${r.type}-${r.id}`,
            label: r.title,
            hint: r.subtitle,
            href: r.href,
            icon: CONTENT_ICON[r.type],
            groupLabel: "Content",
            groupId: "content",
          });
        });
      });
      sections.push({
        id: "content",
        label: "Content",
        startIndex,
        count: items.length - startIndex,
      });
    }

    return { items, sections };
  }, [filteredCommands, contentGroups]);

  const totalItems = items.length;

  // Clamp active index whenever the list shrinks.
  const safeActive = Math.min(active, Math.max(0, totalItems - 1));

  const run = (href: string) => {
    setOpen(false);
    if (href.startsWith("/admin") || href === "/admin") {
      router.push(href);
    } else {
      window.open(href, "_blank");
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // reset on close
      setQuery("");
      setActive(0);
      setContentGroups([]);
    }
    setOpen(next);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(0, totalItems - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[safeActive];
      if (item) run(item.href);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="top-[15%] max-w-xl translate-y-0 gap-0 overflow-hidden rounded-2xl border-white/10 bg-[#0a0e1a]/95 p-0 backdrop-blur-2xl"
        onKeyDown={onKeyDown}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-3 border-b border-white/5 px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {searching && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {totalItems === 0 && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {sections.map((section) => {
            const sectionItems = items.slice(
              section.startIndex,
              section.startIndex + section.count
            );
            return (
              <div key={section.id} className="mb-2">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.id === "content" && <Hash className="h-3 w-3" />}
                    {section.label}
                  </div>
                  {section.id === "content" && sectionItems.length > 0 && (
                    <span className="text-[10px] text-muted-foreground/60">
                      {sectionItems.length} match{sectionItems.length === 1 ? "" : "es"}
                    </span>
                  )}
                </div>

                {section.id === "content" ? (
                  // Content results grouped by their original subgroup.
                  contentGroups.map((g) => {
                    const subItems = sectionItems.filter((it) =>
                      it.kind === "content" && it.href.endsWith("/admin/" + g.type + "s") ? true : it.label !== undefined && it.kind === "content"
                    );
                    // Simpler: just iterate contentGroups and pick by group.
                    const realItems = sectionItems.filter((_, i) => {
                      // Each content item corresponds to one result across groups,
                      // in order. We just re-slice by walking groups.
                      return true;
                    });
                    // Use the group's own results for rendering.
                    const renderItems = g.results.map((r) => {
                      const idx = items.findIndex(
                        (it) => it.kind === "content" && it.key === `content-${r.type}-${r.id}`
                      );
                      return { result: r, idx };
                    });
                    return (
                      <div key={g.type} className="mb-1.5">
                        <div className="px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">
                          {g.label}
                        </div>
                        {renderItems.map(({ result, idx }) => {
                          const item = items[idx];
                          if (!item || item.kind !== "content") return null;
                          const Icon = item.icon;
                          const isActive = idx === safeActive;
                          return (
                            <button
                              key={item.key}
                              onMouseEnter={() => setActive(idx)}
                              onClick={() => run(item.href)}
                              className={cn(
                                "group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                                isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                              )}
                            >
                              <span
                                className={cn(
                                  "grid h-8 w-8 place-items-center rounded-md transition-colors",
                                  isActive
                                    ? "bg-gradient-to-br from-blue-500 to-violet-600 text-white"
                                    : "bg-white/5 text-muted-foreground"
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-foreground">
                                  {item.label}
                                </span>
                                {item.hint && (
                                  <span className="block truncate text-xs text-muted-foreground">
                                    {item.hint}
                                  </span>
                                )}
                              </span>
                              {isActive && (
                                <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                ) : (
                  sectionItems.map((item, i) => {
                    const idx = section.startIndex + i;
                    if (item.kind !== "command") return null;
                    const Icon = item.icon;
                    const isActive = idx === safeActive;
                    return (
                      <button
                        key={item.key}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => run(item.href)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                          isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-8 w-8 place-items-center rounded-md transition-colors",
                            isActive
                              ? "bg-gradient-to-br from-blue-500 to-violet-600 text-white"
                              : "bg-white/5 text-muted-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-foreground">
                            {item.label}
                          </span>
                          <span className="block text-xs text-muted-foreground">{item.hint}</span>
                        </span>
                        {isActive && (
                          <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            );
          })}

          {/* searching hint */}
          {searching && (
            <div className="px-3 py-2 text-center text-[11px] text-muted-foreground">
              Searching content…
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 px-4 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↑↓</kbd>
            navigate
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↵</kbd>
            select
          </span>
          <span>Press / to focus page search</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
