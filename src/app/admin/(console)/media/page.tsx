"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Loader2,
  ImageOffIcon,
} from "lucide-react";
import { toast } from "sonner";
import { api, uploadFile, useAsync } from "@/components/admin/use-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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

type MediaFile = {
  name: string;
  size: number;
  mtime: string;
  url: string;
};

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif|bmp|ico)$/i;

export default function AdminMediaPage() {
  const { data, loading, refetch, setData } = useAsync<MediaFile[]>(
    () => api<MediaFile[]>("/api/media"),
    []
  );
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleteName, setDeleteName] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data || [];
    return (data || []).filter((f) => f.name.toLowerCase().includes(q));
  }, [data, search]);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let okCount = 0;
    let failCount = 0;
    for (const file of Array.from(files)) {
      try {
        await uploadFile(file);
        okCount++;
      } catch (e) {
        failCount++;
        console.error("upload failed", e);
      }
    }
    setUploading(false);
    if (okCount > 0) {
      toast.success(
        `Uploaded ${okCount} file${okCount === 1 ? "" : "s"}` +
          (failCount > 0 ? ` · ${failCount} failed` : "")
      );
      refetch();
    } else if (failCount > 0) {
      toast.error(`Upload failed (${failCount} file${failCount === 1 ? "" : "s"})`);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyUrl = async (url: string) => {
    try {
      // build absolute URL for convenience
      const absolute = `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(absolute);
      setCopied(url);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopied((c) => (c === url ? null : c)), 2000);
    } catch {
      toast.error("Could not copy URL");
    }
  };

  const confirmDelete = async () => {
    if (!deleteName) return;
    setDeleting(true);
    try {
      await api(`/api/media/${encodeURIComponent(deleteName)}`, { method: "DELETE" });
      setData((data || []).filter((f) => f.name !== deleteName));
      toast.success("File deleted");
      setDeleteName(null);
    } catch (e) {
      toast.error("Failed to delete", { description: (e as Error).message });
    } finally {
      setDeleting(false);
    }
  };

  const totalSize = useMemo(() => {
    return (data || []).reduce((acc, f) => acc + f.size, 0);
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Library"
        title="Media library"
        description="Browse, upload, and manage files in your uploads folder."
        icon={ImageIcon}
        action={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onUpload(e.target.files)}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </>
        }
      />

      <div className="rounded-2xl glass p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by filename…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              <span className="font-mono text-foreground/80">
                {data?.length ?? 0}
              </span>{" "}
              files
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">
              <span className="font-mono text-foreground/80">
                {humanSize(totalSize)}
              </span>{" "}
              total
            </span>
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={ImageOffIcon}
              title={search ? "No matches" : "No files yet"}
              hint={
                search
                  ? "Try a different search."
                  : "Upload your first image to get started."
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((f, i) => {
                const isImage = IMAGE_EXT.test(f.name);
                return (
                  <motion.div
                    key={f.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(0.04 * i, 0.4) }}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="relative aspect-square overflow-hidden bg-black/30">
                      {isImage ? (
                        <img
                          src={f.url}
                          alt={f.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                      )}
                      {/* hover actions */}
                      <div className="absolute inset-0 flex items-end justify-end gap-1.5 bg-gradient-to-t from-black/70 via-black/0 to-black/0 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => copyUrl(f.url)}
                          className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
                          aria-label="Copy URL"
                          title="Copy URL"
                        >
                          {copied === f.url ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteName(f.name)}
                          className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-white backdrop-blur transition-colors hover:bg-red-500/70"
                          aria-label="Delete file"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="truncate text-xs font-medium text-foreground" title={f.name}>
                        {f.name}
                      </p>
                      <div className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="font-mono">{humanSize(f.size)}</span>
                        <span>{formatDate(f.mtime)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteName} onOpenChange={(o) => !o && setDeleteName(null)}>
        <AlertDialogContent className="glass-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-mono">{deleteName}</span> will be permanently removed
              from <code>/uploads/</code>. Any references (project covers, avatars, OG image)
              will break. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className={cn("gap-2 bg-red-500 text-white hover:bg-red-500/90")}
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

function humanSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / Math.pow(1024, i);
  return `${i === 0 ? v : v.toFixed(i === 1 ? 0 : 1)} ${units[i]}`;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
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
