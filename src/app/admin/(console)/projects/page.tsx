"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderGit2,
  Plus,
  Star,
  Search,
  Pencil,
  Trash2,
  Loader2,
  GripVertical,
  ExternalLink,
  Github,
  ImagePlus,
  ArrowUpDown,
  FolderX,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { api, uploadFile, useAsync } from "@/components/admin/use-async";
import {
  SortableProjectsTable,
  type SortableProject,
} from "@/components/admin/sortable-projects-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  caseStudy: string;
  coverImage: string | null;
  images: string[];
  techTags: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  title: string;
  slug: string;
  slugTouched: boolean;
  description: string;
  caseStudy: string;
  coverImage: string;
  techTags: string[];
  techInput: string;
  liveUrl: string;
  repoUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
};

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  slugTouched: false,
  description: "",
  caseStudy: "",
  coverImage: "",
  techTags: [],
  techInput: "",
  liveUrl: "",
  repoUrl: "",
  isFeatured: false,
  isPublished: true,
  order: 0,
};

function slugifyLocal(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export default function AdminProjectsPage() {
  const { data, loading, refetch, setData } = useAsync<Project[]>(
    () => api<Project[]>("/api/projects?all=true"),
    []
  );
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkActionRunning, setBulkActionRunning] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (ids: string[], checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) ids.forEach((id) => next.add(id));
      else ids.forEach((id) => next.delete(id));
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const bulkPublish = async (publish: boolean) => {
    if (selectedIds.size === 0) return;
    setBulkActionRunning(true);
    const ids = Array.from(selectedIds);
    // Optimistic update
    setData(
      (data || []).map((p) =>
        selectedIds.has(p.id) ? { ...p, isPublished: publish } : p
      )
    );
    try {
      await Promise.all(
        ids.map((id) =>
          api(`/api/projects/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ isPublished: publish }),
          })
        )
      );
      toast.success(
        `${ids.length} project${ids.length === 1 ? "" : "s"} ${publish ? "published" : "unpublished"}`
      );
      clearSelection();
    } catch (e) {
      toast.error(`Bulk ${publish ? "publish" : "unpublish"} failed`, {
        description: (e as Error).message,
      });
      refetch();
    } finally {
      setBulkActionRunning(false);
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkActionRunning(true);
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(
        ids.map((id) => api(`/api/projects/${id}`, { method: "DELETE" }))
      );
      setData((data || []).filter((p) => !selectedIds.has(p.id)));
      toast.success(`${ids.length} project${ids.length === 1 ? "" : "s"} deleted`);
      clearSelection();
      setBulkDeleteOpen(false);
    } catch (e) {
      toast.error("Bulk delete failed", { description: (e as Error).message });
      refetch();
    } finally {
      setBulkActionRunning(false);
    }
  };

  const filtered = useMemo(() => {
    const list = (data || []).filter((p) =>
      p.title.toLowerCase().includes(search.trim().toLowerCase())
    );
    return [...list].sort((a, b) =>
      sortDir === "asc" ? a.order - b.order : b.order - a.order
    );
  }, [data, search, sortDir]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSheetOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      slugTouched: true,
      description: p.description,
      caseStudy: p.caseStudy || "",
      coverImage: p.coverImage || "",
      techTags: p.techTags || [],
      techInput: "",
      liveUrl: p.liveUrl || "",
      repoUrl: p.repoUrl || "",
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
      order: p.order,
    });
    setSheetOpen(true);
  };

  const onTitleChange = (value: string) => {
    setForm((f) => ({
      ...f,
      title: value,
      slug: f.slugTouched ? f.slug : slugifyLocal(value),
    }));
  };

  const onSlugChange = (value: string) => {
    setForm((f) => ({ ...f, slug: slugifyLocal(value), slugTouched: true }));
  };

  const addTag = () => {
    const raw = form.techInput.split(",").map((t) => t.trim()).filter(Boolean);
    if (!raw.length) return;
    setForm((f) => ({
      ...f,
      techTags: Array.from(new Set([...f.techTags, ...raw])),
      techInput: "",
    }));
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, techTags: f.techTags.filter((t) => t !== tag) }));
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm((f) => ({ ...f, coverImage: url }));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error("Upload failed", { description: (e as Error).message });
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugifyLocal(form.title),
      description: form.description.trim(),
      caseStudy: form.caseStudy,
      coverImage: form.coverImage || null,
      techTags: form.techTags,
      liveUrl: form.liveUrl || null,
      repoUrl: form.repoUrl || null,
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
      order: Number(form.order) || 0,
    };
    try {
      if (editing) {
        const updated = await api<Project>(`/api/projects/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setData((data || []).map((p) => (p.id === editing.id ? updated : p)));
        toast.success("Project updated");
      } else {
        const created = await api<Project>("/api/projects", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setData([...(data || []), created]);
        toast.success("Project created");
      }
      setSheetOpen(false);
    } catch (e) {
      toast.error(editing ? "Failed to update" : "Failed to create", {
        description: (e as Error).message,
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (p: Project) => {
    const next = !p.isPublished;
    setData((data || []).map((x) => (x.id === p.id ? { ...x, isPublished: next } : x)));
    try {
      await api(`/api/projects/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished: next }),
      });
      toast.success(next ? "Project published" : "Project unpublished");
    } catch (e) {
      setData((data || []).map((x) => (x.id === p.id ? { ...x, isPublished: !next } : x)));
      toast.error("Failed to toggle", { description: (e as Error).message });
    }
  };

  const toggleFeatured = async (p: Project) => {
    const next = !p.isFeatured;
    setData((data || []).map((x) => (x.id === p.id ? { ...x, isFeatured: next } : x)));
    try {
      await api(`/api/projects/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isFeatured: next }),
      });
      toast.success(next ? "Marked as featured" : "Removed from featured");
    } catch (e) {
      setData((data || []).map((x) => (x.id === p.id ? { ...x, isFeatured: !next } : x)));
      toast.error("Failed to toggle", { description: (e as Error).message });
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api(`/api/projects/${deleteId}`, { method: "DELETE" });
      setData((data || []).filter((p) => p.id !== deleteId));
      toast.success("Project deleted");
      setDeleteId(null);
    } catch (e) {
      toast.error("Failed to delete", { description: (e as Error).message });
    } finally {
      setDeleting(false);
    }
  };

  const handleReorder = async (reordered: SortableProject[]) => {
    setData(reordered as Project[]);
    try {
      await api("/api/projects/reorder", {
        method: "PATCH",
        body: JSON.stringify({
          items: reordered.map((p) => ({ id: p.id, order: p.order })),
        }),
      });
      toast.success("Order saved", { description: "Projects reordered" });
    } catch (e) {
      toast.error("Reorder failed", { description: (e as Error).message });
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Projects"
        title="Manage projects"
        description="Showcase what you've built. Featured projects appear first on the public site."
        icon={FolderGit2}
        action={
          <Button
            onClick={openCreate}
            className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New project
          </Button>
        }
      />

      <div className="rounded-2xl glass p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title…"
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="gap-2"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            Order {sortDir === "asc" ? "↑" : "↓"}
          </Button>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={FolderX}
              title={search ? "No matches" : "No projects yet"}
              hint={search ? "Try a different search." : "Create your first project to get started."}
            />
          ) : (
            <SortableProjectsTable
              items={filtered}
              onReorder={handleReorder}
              onEdit={(p) => openEdit(p as Project)}
              onDelete={(id) => setDeleteId(id)}
              onToggleFeatured={(p) => toggleFeatured(p as Project)}
              onTogglePublished={(p) => togglePublished(p as Project)}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
            />
          )}
        </div>
      </div>

      {/* Create/Edit sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full flex-col gap-0 p-0 sm:max-w-md md:max-w-lg"
        >
          <SheetHeader className="border-b border-white/5 px-6 py-4">
            <SheetTitle className="font-display">
              {editing ? "Edit project" : "New project"}
            </SheetTitle>
            <SheetDescription className="text-xs">
              {editing
                ? "Update the details below. Changes save instantly."
                : "Fill in the details below to publish a new project."}
            </SheetDescription>
          </SheetHeader>

          <form
            onSubmit={submit}
            className="flex-1 overflow-y-auto px-6 py-5"
            style={{ maxHeight: "calc(90vh - 4rem)" }}
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="p-title">Title</Label>
                <Input
                  id="p-title"
                  value={form.title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="My awesome project"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="p-slug">Slug</Label>
                <Input
                  id="p-slug"
                  value={form.slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="my-awesome-project"
                  className="font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Used in the URL: /projects/{form.slug || "…"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="p-desc">Description</Label>
                <Textarea
                  id="p-desc"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="A short one-liner describing the project."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="p-case">Case study (markdown)</Label>
                <Textarea
                  id="p-case"
                  value={form.caseStudy}
                  onChange={(e) => setForm({ ...form, caseStudy: e.target.value })}
                  placeholder={"## Challenge\nDescribe the problem…\n\n## Solution\n…"}
                  rows={6}
                  className="font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Supports markdown. Renders as the case study body on the project page.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Cover image</Label>
                <div className="flex items-start gap-3">
                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    {form.coverImage ? (
                       
                      <img
                        src={form.coverImage}
                        alt="cover preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-muted-foreground">
                        <ImagePlus className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => handleUpload(e.target.files?.[0])}
                      className="cursor-pointer file:bg-white/5 file:text-xs"
                    />
                    {uploading && (
                      <p className="text-[11px] text-blue-400">Uploading…</p>
                    )}
                    <Input
                      value={form.coverImage}
                      onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                      placeholder="or paste image URL"
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="p-tags">Tech tags</Label>
                <Input
                  id="p-tags"
                  value={form.techInput}
                  onChange={(e) => setForm({ ...form, techInput: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  onBlur={addTag}
                  placeholder="Type a tag and press Enter (comma-separated)"
                />
                {form.techTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.techTags.map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="gap-1 pr-1.5"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="ml-0.5 grid h-3.5 w-3.5 place-items-center rounded-full hover:bg-white/15"
                          aria-label={`Remove ${t}`}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="p-live">Live URL</Label>
                  <Input
                    id="p-live"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://…"
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-repo">Repository URL</Label>
                  <Input
                    id="p-repo"
                    value={form.repoUrl}
                    onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                    placeholder="https://github.com/…"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="p-order">Order</Label>
                  <Input
                    id="p-order"
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                  <Label htmlFor="p-feat" className="cursor-pointer">
                    Featured
                  </Label>
                  <Switch
                    id="p-feat"
                    checked={form.isFeatured}
                    onCheckedChange={(c) => setForm({ ...form, isFeatured: c })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                  <Label htmlFor="p-pub" className="cursor-pointer">
                    Published
                  </Label>
                  <Switch
                    id="p-pub"
                    checked={form.isPublished}
                    onCheckedChange={(c) => setForm({ ...form, isPublished: c })}
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="flex items-center justify-end gap-2 border-t border-white/5 px-6 py-4">
            <Button variant="ghost" onClick={() => setSheetOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={saving || uploading}
              className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : editing ? (
                "Save changes"
              ) : (
                "Create project"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="glass-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the project and its slug from the database. This action cannot be undone.
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

      {/* Bulk-delete confirmation */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent className="glass-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedIds.size} selected project{selectedIds.size === 1 ? "" : "s"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove all selected projects from the database. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkActionRunning}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={bulkDelete}
              disabled={bulkActionRunning}
              className="gap-2 bg-red-500 text-white hover:bg-red-500/90"
            >
              {bulkActionRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                `Delete ${selectedIds.size}`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Floating bulk-action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-5 z-40 mx-auto flex w-[calc(100%-2rem)] max-w-2xl items-center gap-2 rounded-2xl border border-white/10 bg-[#0f1729]/95 px-3 py-2.5 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl sm:px-4"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-blue-500 px-1.5 text-[11px] font-bold text-white">
                {selectedIds.size}
              </span>
              <span className="hidden sm:inline">selected</span>
            </span>

            <div className="mx-1 h-6 w-px bg-white/10" />

            <Button
              size="sm"
              variant="ghost"
              onClick={() => bulkPublish(true)}
              disabled={bulkActionRunning}
              className="gap-1.5 text-xs hover:bg-emerald-500/10 hover:text-emerald-300"
            >
              <Eye className="h-3.5 w-3.5" />
              Publish
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => bulkPublish(false)}
              disabled={bulkActionRunning}
              className="gap-1.5 text-xs hover:bg-amber-500/10 hover:text-amber-300"
            >
              <EyeOff className="h-3.5 w-3.5" />
              Unpublish
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setBulkDeleteOpen(true)}
              disabled={bulkActionRunning}
              className="gap-1.5 text-xs text-muted-foreground hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>

            <div className="flex-1" />

            <button
              onClick={clearSelection}
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
