"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Loader2,
  ImageOffIcon,
  Eye,
  Download,
  ExternalLink,
  Grid,
  List,
  ArrowUpDown,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  HardDrive,
  FileText,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type MediaFile = {
  name: string;
  size: number;
  mtime: string;
  url: string;
};

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif|bmp|ico)$/i;

type SortOption = "newest" | "oldest" | "largest" | "smallest" | "name-asc" | "name-desc";
type FormatFilter = "all" | "webp" | "jpg" | "png" | "svg" | "other";

export default function AdminMediaPage() {
  const { data, loading, refetch, setData } = useAsync<MediaFile[]>(
    () => api<MediaFile[]>("/api/media"),
    []
  );

  // Search & Filter & Sort state
  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Selection state
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Upload state & drag drop
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single delete state
  const [deleteName, setDeleteName] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Batch delete state
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false);
  const [batchDeleting, setBatchDeleting] = useState(false);

  // Clipboard copy state
  const [copied, setCopied] = useState<string | null>(null);

  // Lightbox / Inspector modal state
  const [inspectIndex, setInspectIndex] = useState<number | null>(null);
  const [naturalDimensions, setNaturalDimensions] = useState<{ [url: string]: { width: number; height: number } }>({});

  // Filtered & Sorted list
  const processedFiles = useMemo(() => {
    let list = data || [];

    // Search filter
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }

    // Format filter
    if (formatFilter !== "all") {
      list = list.filter((f) => {
        const ext = f.name.split(".").pop()?.toLowerCase() || "";
        if (formatFilter === "webp") return ext === "webp";
        if (formatFilter === "jpg") return ext === "jpg" || ext === "jpeg";
        if (formatFilter === "png") return ext === "png";
        if (formatFilter === "svg") return ext === "svg";
        if (formatFilter === "other") return !["webp", "jpg", "jpeg", "png", "svg"].includes(ext);
        return true;
      });
    }

    // Sort
    const sorted = [...list].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.mtime).getTime() - new Date(a.mtime).getTime();
        case "oldest":
          return new Date(a.mtime).getTime() - new Date(b.mtime).getTime();
        case "largest":
          return b.size - a.size;
        case "smallest":
          return a.size - b.size;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [data, search, formatFilter, sortOption]);

  // Statistics
  const stats = useMemo(() => {
    const all = data || [];
    const totalSize = all.reduce((sum, f) => sum + f.size, 0);
    const webpCount = all.filter((f) => f.name.toLowerCase().endsWith(".webp")).length;
    const jpgCount = all.filter((f) => /\.(jpe?g)$/i.test(f.name)).length;
    const pngCount = all.filter((f) => f.name.toLowerCase().endsWith(".png")).length;
    const svgCount = all.filter((f) => f.name.toLowerCase().endsWith(".svg")).length;
    return {
      totalCount: all.length,
      totalSize,
      webpCount,
      jpgCount,
      pngCount,
      svgCount,
    };
  }, [data]);

  // Drag and drop listeners on window
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = (e: DragEvent) => {
      if (e.relatedTarget === null) {
        setIsDragging(false);
      }
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files) {
        onUpload(e.dataTransfer.files);
      }
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

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
      const absolute = `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(absolute);
      setCopied(url);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopied((c) => (c === url ? null : c)), 2000);
    } catch {
      toast.error("Could not copy URL");
    }
  };

  const copyRelativeUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Relative path copied (/uploads/...)");
    } catch {
      toast.error("Could not copy path");
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success(`Downloaded ${filename}`);
    } catch {
      toast.error("Failed to download file");
    }
  };

  const confirmDelete = async () => {
    if (!deleteName) return;
    setDeleting(true);
    try {
      await api(`/api/media/${encodeURIComponent(deleteName)}`, { method: "DELETE" });
      setData((data || []).filter((f) => f.name !== deleteName));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(deleteName);
        return next;
      });
      if (inspectIndex !== null && processedFiles[inspectIndex]?.name === deleteName) {
        setInspectIndex(null);
      }
      toast.success("File deleted");
      setDeleteName(null);
    } catch (e) {
      toast.error("Failed to delete", { description: (e as Error).message });
    } finally {
      setDeleting(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selected.size === 0) return;
    setBatchDeleting(true);
    const toDelete = Array.from(selected);
    let successCount = 0;
    for (const name of toDelete) {
      try {
        await api(`/api/media/${encodeURIComponent(name)}`, { method: "DELETE" });
        successCount++;
      } catch (err) {
        console.error("Batch delete item failed:", name, err);
      }
    }
    setData((data || []).filter((f) => !selected.has(f.name)));
    setSelected(new Set());
    setBatchDeleteOpen(false);
    setBatchDeleting(false);
    toast.success(`Deleted ${successCount} of ${toDelete.length} files`);
  };

  const handleBatchCopyUrls = async () => {
    const urls = (data || [])
      .filter((f) => selected.has(f.name))
      .map((f) => `${window.location.origin}${f.url}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(urls);
      toast.success(`Copied ${selected.size} URLs to clipboard`);
    } catch {
      toast.error("Failed to copy URLs");
    }
  };

  const toggleSelect = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === processedFiles.length && processedFiles.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(processedFiles.map((f) => f.name)));
    }
  };

  // Inspect navigation
  const currentInspectFile = inspectIndex !== null ? processedFiles[inspectIndex] : null;

  const inspectNext = () => {
    if (inspectIndex === null) return;
    setInspectIndex((inspectIndex + 1) % processedFiles.length);
  };

  const inspectPrev = () => {
    if (inspectIndex === null) return;
    setInspectIndex((inspectIndex - 1 + processedFiles.length) % processedFiles.length);
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Window Highlight Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/85 backdrop-blur-md border-4 border-dashed border-blue-500 pointer-events-none"
          >
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/40 shadow-2xl animate-pulse">
              <Upload className="h-10 w-10" />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold text-foreground">
              Drop images anywhere to upload
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Images will be automatically uploaded and optimized in WebP format
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        eyebrow="Library"
        title="Media library"
        description="Browse, upload, and manage files in your uploads folder."
        icon={ImageIcon}
        action={
          <div className="flex items-center gap-2">
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
              className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/20"
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
          </div>
        }
      />

      {/* Storage and Overview Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground">Total Files</span>
            <div className="text-lg font-display font-bold text-foreground">{stats.totalCount}</div>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 shrink-0">
            <HardDrive className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground">Disk Used</span>
            <div className="text-lg font-display font-bold text-foreground">{humanSize(stats.totalSize)}</div>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground">Optimized WebP</span>
            <div className="text-lg font-display font-bold text-emerald-400">{stats.webpCount} files</div>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground">JPG / PNG / SVG</span>
            <div className="text-lg font-display font-bold text-foreground">
              {stats.jpgCount + stats.pngCount + stats.svgCount} files
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl glass p-4 sm:p-5 border border-white/10 shadow-xl shadow-black/20">
        {/* Controls Toolbar: Search, Format Pills, Sort, View Toggle */}
        <div className="flex flex-col gap-3.5 border-b border-white/5 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by filename…"
                className="pl-9 bg-white/[0.02] border-white/10"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & View mode controls */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {/* Sort Selector with Custom Glass Design */}
              <Select
                value={sortOption}
                onValueChange={(val) => setSortOption(val as SortOption)}
              >
                <SelectTrigger className="h-8 gap-2 rounded-xl border-white/10 bg-white/[0.03] px-2.5 sm:px-3 text-xs text-foreground hover:border-white/20 hover:bg-white/[0.06] shadow-sm">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground mr-0.5 shrink-0" />
                  <SelectValue placeholder="Sort files" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="largest">Largest size</SelectItem>
                  <SelectItem value="smallest">Smallest size</SelectItem>
                  <SelectItem value="name-asc">Name (A → Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z → A)</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle (Grid / List) */}
              <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-lg transition-colors",
                    viewMode === "grid"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Grid view"
                >
                  <Grid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-lg transition-colors",
                    viewMode === "list"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="List view"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Pills + Multi-select toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-muted-foreground font-medium mr-1">Filter:</span>
              {(
                [
                  { key: "all", label: "All", count: stats.totalCount },
                  { key: "webp", label: "WebP", count: stats.webpCount },
                  { key: "jpg", label: "JPEG / JPG", count: stats.jpgCount },
                  { key: "png", label: "PNG", count: stats.pngCount },
                  { key: "svg", label: "SVG", count: stats.svgCount },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFormatFilter(tab.key)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium transition-all border",
                    formatFilter === tab.key
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm"
                      : "border-white/5 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                  )}
                >
                  {tab.label} <span className="opacity-60 ml-0.5">({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Select All / Deselect All */}
            {processedFiles.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {selected.size === processedFiles.length && processedFiles.length > 0 ? (
                    <>
                      <CheckSquare className="h-3.5 w-3.5 text-blue-400" />
                      <span>Deselect all</span>
                    </>
                  ) : (
                    <>
                      <Square className="h-3.5 w-3.5" />
                      <span>Select all</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Media Grid or List Area */}
        <div className="mt-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl" />
              ))}
            </div>
          ) : processedFiles.length === 0 ? (
            <EmptyState
              icon={ImageOffIcon}
              title={search ? "No matching files" : "No files yet"}
              hint={
                search
                  ? "Try searching for a different filename or clearing filters."
                  : "Upload or drag & drop images to get started."
              }
            />
          ) : viewMode === "grid" ? (
            /* GRID VIEW */
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {processedFiles.map((f, i) => {
                const isImage = IMAGE_EXT.test(f.name);
                const isSelected = selected.has(f.name);
                const ext = f.name.split(".").pop()?.toUpperCase() || "FILE";

                return (
                  <motion.div
                    key={f.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(0.03 * i, 0.3) }}
                    className={cn(
                      "group relative flex flex-col overflow-hidden rounded-xl border transition-all",
                      isSelected
                        ? "border-blue-500/80 bg-blue-500/[0.08] shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 hover:shadow-md"
                    )}
                  >
                    {/* Checkbox badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(f.name);
                      }}
                      className={cn(
                        "absolute top-2 left-2 z-10 grid h-6 w-6 place-items-center rounded-md backdrop-blur transition-all",
                        isSelected
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-black/75 hover:text-white"
                      )}
                      title={isSelected ? "Deselect" : "Select"}
                    >
                      {isSelected ? (
                        <CheckSquare className="h-3.5 w-3.5" />
                      ) : (
                        <Square className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {/* Format Badge */}
                    <span className="absolute top-2 right-2 z-10 rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase bg-black/60 text-white/80 backdrop-blur pointer-events-none">
                      {ext}
                    </span>

                    {/* Thumbnail Image Container */}
                    <div
                      className="relative aspect-square overflow-hidden bg-black/40 cursor-pointer"
                      onClick={() => setInspectIndex(i)}
                    >
                      {isImage ? (
                        <img
                          src={f.url}
                          alt={f.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onLoad={(e) => {
                            const img = e.currentTarget;
                            if (img.naturalWidth && img.naturalHeight) {
                              setNaturalDimensions((prev) => ({
                                ...prev,
                                [f.url]: { width: img.naturalWidth, height: img.naturalHeight },
                              }));
                            }
                          }}
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                      )}

                      {/* Hover Overlay Actions */}
                      <div className="absolute inset-0 flex items-end justify-end gap-1.5 bg-gradient-to-t from-black/85 via-black/20 to-black/0 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        {/* Preview button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectIndex(i);
                          }}
                          className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-white backdrop-blur transition-colors hover:bg-blue-500 hover:text-white shadow-sm"
                          aria-label="Preview image"
                          title="Preview full size"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Copy URL button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyUrl(f.url);
                          }}
                          className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 shadow-sm"
                          aria-label="Copy URL"
                          title="Copy Full URL"
                        >
                          {copied === f.url ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>

                        {/* Download button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(f.url, f.name);
                          }}
                          className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 shadow-sm"
                          aria-label="Download file"
                          title="Download file"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteName(f.name);
                          }}
                          className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-white backdrop-blur transition-colors hover:bg-red-500/80 shadow-sm"
                          aria-label="Delete file"
                          title="Delete file"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-2.5">
                      <p
                        className="truncate text-xs font-medium text-foreground cursor-pointer hover:text-blue-400 transition-colors"
                        title={f.name}
                        onClick={() => setInspectIndex(i)}
                      >
                        {f.name}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="font-mono">{humanSize(f.size)}</span>
                        <span>{formatDate(f.mtime)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW (TABLE) */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-[11px] font-semibold">
                    <th className="py-2.5 px-3 w-10">
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="grid h-5 w-5 place-items-center rounded hover:bg-white/10"
                      >
                        {selected.size === processedFiles.length && processedFiles.length > 0 ? (
                          <CheckSquare className="h-3.5 w-3.5 text-blue-400" />
                        ) : (
                          <Square className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </th>
                    <th className="py-2.5 px-3 w-14">Preview</th>
                    <th className="py-2.5 px-3">Filename</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Modified</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {processedFiles.map((f, i) => {
                    const isSelected = selected.has(f.name);
                    const ext = f.name.split(".").pop()?.toUpperCase() || "FILE";
                    const isImage = IMAGE_EXT.test(f.name);

                    return (
                      <tr
                        key={f.name}
                        className={cn(
                          "transition-colors hover:bg-white/[0.03]",
                          isSelected && "bg-blue-500/[0.06]"
                        )}
                      >
                        <td className="py-2.5 px-3">
                          <button
                            type="button"
                            onClick={() => toggleSelect(f.name)}
                            className="grid h-5 w-5 place-items-center rounded hover:bg-white/10 text-muted-foreground"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-3.5 w-3.5 text-blue-400" />
                            ) : (
                              <Square className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </td>

                        <td className="py-2.5 px-3">
                          <div
                            onClick={() => setInspectIndex(i)}
                            className="relative h-10 w-10 overflow-hidden rounded-lg bg-black/40 border border-white/10 cursor-pointer group"
                          >
                            {isImage ? (
                              <img
                                src={f.url}
                                alt={f.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-muted-foreground">
                                <ImageIcon className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 font-medium text-foreground">
                          <div
                            onClick={() => setInspectIndex(i)}
                            className="hover:text-blue-400 cursor-pointer truncate max-w-xs"
                            title={f.name}
                          >
                            {f.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono truncate max-w-xs">
                            {f.url}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <span className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                            {ext}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {humanSize(f.size)}
                        </td>

                        <td className="py-2.5 px-3 text-muted-foreground">
                          {formatDate(f.mtime)}
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setInspectIndex(i)}
                              className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                              title="Preview"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => copyUrl(f.url)}
                              className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                              title="Copy URL"
                            >
                              {copied === f.url ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => downloadFile(f.url, f.name)}
                              className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                              title="Download"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteName(f.name)}
                              className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:bg-red-500/20 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Batch Action Bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-2xl glass-strong border border-blue-500/30 bg-[#0d1322]/95 px-4 py-2.5 shadow-2xl shadow-blue-500/20 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 pr-2 border-r border-white/10 text-xs">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500 font-bold text-white text-[11px]">
                {selected.size}
              </span>
              <span className="font-medium text-foreground">selected</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBatchCopyUrls}
              className="h-8 gap-1.5 text-xs border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy URLs</span>
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setBatchDeleteOpen(true)}
              className="h-8 gap-1.5 text-xs bg-red-500/80 hover:bg-red-500 text-white"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete ({selected.size})</span>
            </Button>

            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="ml-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1"
            >
              Deselect
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Lightbox / Image Inspector Modal */}
      <AnimatePresence>
        {currentInspectFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectIndex(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 flex flex-col lg:flex-row w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/15 bg-[#0a0e1a] shadow-2xl shadow-black/80"
            >
              {/* Left / Top: Image Viewport */}
              <div className="relative flex-1 bg-black/70 flex items-center justify-center p-4 min-h-[300px] lg:min-h-[460px] overflow-hidden">
                <img
                  src={currentInspectFile.url}
                  alt={currentInspectFile.name}
                  className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform"
                />

                {/* Nav buttons for cycling images */}
                {processedFiles.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        inspectPrev();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white/80 hover:bg-black/90 hover:text-white backdrop-blur transition-all"
                      title="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        inspectNext();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white/80 hover:bg-black/90 hover:text-white backdrop-blur transition-all"
                      title="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Right / Bottom: Metadata & Actions Panel */}
              <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 p-5 flex flex-col justify-between bg-panel-deep/50 overflow-y-auto">
                <div className="space-y-4">
                  {/* Header & Close */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-400">
                        File details
                      </span>
                      <h3 className="font-display text-sm font-bold text-foreground break-all mt-0.5" title={currentInspectFile.name}>
                        {currentInspectFile.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInspectIndex(null)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                      <span className="text-[10px] text-muted-foreground block">Size</span>
                      <span className="font-mono font-semibold text-foreground">
                        {humanSize(currentInspectFile.size)}
                      </span>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                      <span className="text-[10px] text-muted-foreground block">Format</span>
                      <span className="font-mono font-semibold text-foreground uppercase">
                        {currentInspectFile.name.split(".").pop() || "IMG"}
                      </span>
                    </div>

                    {naturalDimensions[currentInspectFile.url] && (
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 col-span-2">
                        <span className="text-[10px] text-muted-foreground block">Resolution</span>
                        <span className="font-mono font-semibold text-emerald-400">
                          {naturalDimensions[currentInspectFile.url].width} ×{" "}
                          {naturalDimensions[currentInspectFile.url].height} px
                        </span>
                      </div>
                    )}

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 col-span-2">
                      <span className="text-[10px] text-muted-foreground block">Uploaded</span>
                      <span className="text-foreground">
                        {new Date(currentInspectFile.mtime).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Path and URLs with copy */}
                  <div className="space-y-2 pt-1">
                    <label className="text-[11px] font-medium text-muted-foreground block">
                      URL Links
                    </label>

                    {/* Relative path */}
                    <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1.5">
                      <Input
                        readOnly
                        value={currentInspectFile.url}
                        className="h-7 border-0 bg-transparent font-mono text-[11px] px-1 text-foreground"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyRelativeUrl(currentInspectFile.url)}
                        className="h-7 px-2 text-xs shrink-0"
                        title="Copy relative path"
                      >
                        <Copy className="h-3 w-3 mr-1" /> Path
                      </Button>
                    </div>

                    {/* Absolute URL */}
                    <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1.5">
                      <Input
                        readOnly
                        value={`${typeof window !== "undefined" ? window.location.origin : ""}${currentInspectFile.url}`}
                        className="h-7 border-0 bg-transparent font-mono text-[11px] px-1 text-foreground"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyUrl(currentInspectFile.url)}
                        className="h-7 px-2 text-xs shrink-0"
                        title="Copy full URL"
                      >
                        <Copy className="h-3 w-3 mr-1" /> Full
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-white/10 mt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(currentInspectFile.url, currentInspectFile.name)}
                      className="gap-1.5 text-xs border-white/10 bg-white/5 hover:bg-white/10"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-1.5 text-xs border-white/10 bg-white/5 hover:bg-white/10"
                    >
                      <a href={currentInspectFile.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Open tab</span>
                      </a>
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteName(currentInspectFile.name)}
                    className="w-full gap-1.5 text-xs bg-red-500/80 hover:bg-red-500 text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete file</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteName} onOpenChange={(o) => !o && setDeleteName(null)}>
        <AlertDialogContent className="glass-strong border border-white/15 bg-[#0d1322]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-mono text-foreground font-semibold">{deleteName}</span> will be permanently removed
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

      {/* Batch Delete Confirmation Dialog */}
      <AlertDialog open={batchDeleteOpen} onOpenChange={setBatchDeleteOpen}>
        <AlertDialogContent className="glass-strong border border-white/15 bg-[#0d1322]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} selected files?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete these {selected.size} files from the uploads folder?
              Any portfolio references using these images will break. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={batchDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchDelete}
              disabled={batchDeleting}
              className={cn("gap-2 bg-red-500 text-white hover:bg-red-500/90")}
            >
              {batchDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting files…
                </>
              ) : (
                `Delete ${selected.size} files`
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
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 ring-1 ring-white/10 shadow-lg shadow-blue-500/10">
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
