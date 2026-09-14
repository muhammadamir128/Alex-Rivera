"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Mail,
  Trash2,
  Loader2,
  MailOpen,
  Reply,
  CircleSlash,
  Search,
  ShieldAlert,
  Send,
  X,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { api, useAsync } from "@/components/admin/use-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  isSpam: boolean;
  createdAt: string;
  updatedAt: string;
};

type MessagesResponse = {
  items: Message[];
  total: number;
  page: number;
  totalPages: number;
};

type FilterKey = "all" | "unread";

const PAGE_SIZE = 20;

export default function AdminMessagesPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [page, setPage] = useState(1);
  const { data, loading, setData } = useAsync<MessagesResponse>(
    () =>
      api<MessagesResponse>(
        `/api/messages?filter=${filter}&page=${page}&limit=${PAGE_SIZE}`
      ),
    [filter, page]
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [replyOpen, setReplyOpen] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [copied, setCopied] = useState(false);

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.page || 1;

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter((m) =>
      (m.name + m.email + m.message).toLowerCase().includes(q)
    );
  }, [items, search]);

  const unreadCount = useMemo(() => items.filter((m) => !m.isRead).length, [items]);
  const selected = useMemo(
    () => items.find((m) => m.id === selectedId) || null,
    [items, selectedId]
  );

  // when selecting a message, mark as read after a tick
  useEffect(() => {
    if (!selected) return;
    if (!selected.isRead) {
      const id = selected.id;
      setData({
        ...data!,
        items: (data?.items || []).map((m) =>
          m.id === id ? { ...m, isRead: true } : m
        ),
      });
      api(`/api/messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isRead: true }),
      }).catch((e) => {
        toast.error("Failed to mark as read", { description: (e as Error).message });
        setData({
          ...data!,
          items: (data?.items || []).map((m) =>
            m.id === id ? { ...m, isRead: false } : m
          ),
        });
      });
    }
  }, [selectedId]);

  const selectMessage = (id: string) => {
    setSelectedId(id);
    setMobileView("detail");
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api(`/api/messages/${deleteId}`, { method: "DELETE" });
      const newItems = (data?.items || []).filter((m) => m.id !== deleteId);
      setData({
        items: newItems,
        total: Math.max(0, (data?.total || 0) - 1),
        page: currentPage,
        totalPages: Math.max(1, Math.ceil(newItems.length / PAGE_SIZE)),
      });
      if (selectedId === deleteId) setSelectedId(null);
      toast.success("Message deleted");
      setDeleteId(null);
      setMobileView("list");
    } catch (e) {
      toast.error("Failed to delete", { description: (e as Error).message });
    } finally {
      setDeleting(false);
    }
  };

  const markUnread = async (m: Message) => {
    const next = !m.isRead;
    setData({
      ...data!,
      items: (data?.items || []).map((x) =>
        x.id === m.id ? { ...x, isRead: !next } : x
      ),
    });
    try {
      await api(`/api/messages/${m.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isRead: !next }),
      });
      toast.success(next ? "Marked unread" : "Marked read");
    } catch (e) {
      setData({
        ...data!,
        items: (data?.items || []).map((x) =>
          x.id === m.id ? { ...x, isRead: next } : x
        ),
      });
      toast.error("Failed to update", { description: (e as Error).message });
    }
  };

  const openReply = () => {
    if (!selected) return;
    setReplySubject(`Re: your message`);
    setReplyBody(
      `Hi ${selected.name},\n\nThanks for reaching out via my portfolio.\n\n`
    );
    setReplyOpen(true);
  };

  const buildMailto = () => {
    if (!selected) return "";
    return `mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent(
      replySubject
    )}&body=${encodeURIComponent(replyBody)}`;
  };

  const sendReply = () => {
    if (!replyBody.trim()) {
      toast.error("Reply body is empty");
      return;
    }
    const mailto = buildMailto();
    window.location.href = mailto;
    toast.success("Opening your mail client…", {
      description: `Replying to ${selected?.email}`,
    });
    setReplyOpen(false);
  };

  const copyReply = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(replyBody);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  // change filter resets the page
  const changeFilter = (f: FilterKey) => {
    setFilter(f);
    setPage(1);
    setSelectedId(null);
    setMobileView("list");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Messages"
        title="Inbox"
        description={
          unreadCount > 0
            ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"} waiting for you.`
            : "All caught up. New contact form submissions land here."
        }
        icon={Inbox}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* List pane */}
        <div
          className={cn(
            "flex flex-col rounded-2xl glass overflow-hidden",
            mobileView === "detail" && "hidden lg:flex"
          )}
        >
          <div className="border-b border-white/5 p-3">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search within this page…"
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-1">
                {([
                  { key: "all", label: "All" },
                  { key: "unread", label: `Unread${unreadCount ? ` (${unreadCount})` : ""}` },
                ] as const).map((f) => {
                  const active = filter === f.key;
                  return (
                    <button
                      key={f.key}
                      onClick={() => changeFilter(f.key)}
                      className={cn(
                        "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                        active
                          ? "bg-white/10 text-foreground"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={CircleSlash}
                title={search ? "No matches" : "Inbox zero"}
                hint={
                  search
                    ? "Try a different search."
                    : filter === "unread"
                    ? "No unread messages."
                    : "Messages from your contact form will appear here."
                }
              />
            ) : (
              <ul className="divide-y divide-white/5">
                {filtered.map((m) => {
                  const active = m.id === selectedId;
                  return (
                    <li key={m.id}>
                      <button
                        onClick={() => selectMessage(m.id)}
                        className={cn(
                          "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors",
                          active ? "bg-white/[0.05]" : "hover:bg-white/[0.025]"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                            m.isRead ? "bg-transparent" : "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.7)]"
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span
                              className={cn(
                                "truncate text-sm",
                                m.isRead ? "font-medium text-foreground/80" : "font-semibold text-foreground"
                              )}
                            >
                              {m.name}
                              {m.isSpam && (
                                <ShieldAlert className="ml-1 inline h-3 w-3 text-amber-400" />
                              )}
                            </span>
                            <span className="shrink-0 text-[10px] text-muted-foreground">
                              {timeAgo(m.createdAt)}
                            </span>
                          </div>
                          <div className="truncate text-[11px] text-muted-foreground">
                            {m.email}
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-xs text-foreground/60">
                            {m.message}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Pagination controls */}
          {!loading && (
            <div className="flex items-center justify-between gap-2 border-t border-white/5 px-3 py-2 text-xs text-muted-foreground">
              <span>
                {total === 0 ? (
                  "No messages"
                ) : (
                  <>
                    <span className="font-mono text-foreground/80">
                      {total}
                    </span>{" "}
                    total · page{" "}
                    <span className="font-mono text-foreground/80">{currentPage}</span> of{" "}
                    <span className="font-mono text-foreground/80">{totalPages}</span>
                  </>
                )}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail pane */}
        <div
          className={cn(
            "rounded-2xl glass overflow-hidden",
            mobileView === "list" && "hidden lg:flex"
          )}
        >
          {selected ? (
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
                <div className="min-w-0">
                  <button
                    onClick={() => setMobileView("list")}
                    className="mb-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground lg:hidden"
                  >
                    ← Back to inbox
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
                      {selected.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-base font-semibold">
                        {selected.name}
                      </h2>
                      <p className="truncate text-xs text-muted-foreground">{selected.email}</p>
                    </div>
                  </div>
                  {selected.isSpam && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                      <ShieldAlert className="h-3 w-3" />
                      Flagged as spam (honeypot triggered)
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => markUnread(selected)}
                    aria-label={selected.isRead ? "Mark unread" : "Mark read"}
                    className="h-8 w-8"
                  >
                    {selected.isRead ? (
                      <Mail className="h-4 w-4" />
                    ) : (
                      <MailOpen className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(selected.id)}
                    aria-label="Delete"
                    className="h-8 w-8 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Received</span>
                  <span className="font-mono">
                    {new Date(selected.createdAt).toLocaleString()}
                  </span>
                  {selected.isRead ? (
                    <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                      Read
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-500/15 text-[10px] text-blue-300">
                      Unread
                    </Badge>
                  )}
                </div>

                <div className="whitespace-pre-wrap break-words rounded-xl bg-white/[0.02] p-4 text-sm leading-relaxed text-foreground/90">
                  {selected.message}
                </div>
              </div>

              <div className="border-t border-white/5 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Compose a reply — it opens in your mail client.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => markUnread(selected)}
                      className="text-xs"
                    >
                      {selected.isRead ? "Mark unread" : "Mark read"}
                    </Button>
                    <Button
                      onClick={openReply}
                      className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-600/20 hover:opacity-90"
                    >
                      <Reply className="h-4 w-4" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid h-full place-items-center p-6">
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-muted-foreground">
                  <Mail className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">Select a message</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Choose a message from the list to read it here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply compose dialog */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="max-h-[88vh] gap-0 overflow-hidden border-white/10 bg-[#0f1729]/95 p-0 backdrop-blur-2xl sm:max-w-2xl sm:rounded-3xl">
          <DialogHeader className="border-b border-white/5 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="font-display text-lg font-semibold">
                  Reply to {selected?.name}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  to {selected?.email}
                </DialogDescription>
              </div>
              <button
                onClick={() => setReplyOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* quoted original message */}
            {selected && (
              <div className="mb-4 rounded-xl border-l-2 border-white/10 bg-white/[0.02] py-2 pl-3 pr-2 text-xs text-muted-foreground">
                <div className="mb-1 font-medium text-foreground/70">
                  On {new Date(selected.createdAt).toLocaleString()}, {selected.name} wrote:
                </div>
                <div className="line-clamp-3 whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="reply-subject" className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Subject
                </Label>
                <Input
                  id="reply-subject"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reply-body" className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Message
                  </Label>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {replyBody.length} chars
                  </span>
                </div>
                <Textarea
                  id="reply-body"
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  rows={10}
                  className="resize-none bg-white/5 border-white/10 font-mono text-[13px] leading-relaxed"
                  placeholder="Write your reply…"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-white/5 px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyReply}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={sendReply}
                className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
              >
                <Send className="h-3.5 w-3.5" />
                Open in mail client
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="glass-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the message from your inbox. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="gap-2 bg-red-500 text-white hover:bg-red-500/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  return date.toLocaleDateString();
}

function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="flex items-start gap-3">
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
      </div>
      {action}
    </motion.div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
