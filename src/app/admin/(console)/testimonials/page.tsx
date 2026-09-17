"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquareQuote,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Star,
  CheckCircle2,
  Clock3,
  ImagePlus,
  CircleSlash,
  LayoutGrid,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { api, uploadFile, useAsync } from "@/components/admin/use-async";
import {
  SortableTestimonialsList,
  type SortableTestimonial,
} from "@/components/admin/sortable-testimonials-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  avatarUrl: string | null;
  rating: number;
  approved: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  name: string;
  role: string;
  company: string;
  message: string;
  avatarUrl: string;
  rating: number;
  approved: boolean;
  order: number;
};

const EMPTY_FORM: FormState = {
  name: "",
  role: "",
  company: "",
  message: "",
  avatarUrl: "",
  rating: 5,
  approved: true,
  order: 0,
};

type FilterKey = "all" | "approved" | "pending";

export default function AdminTestimonialsPage() {
  const { data, loading, setData } = useAsync<Testimonial[]>(
    () => api<Testimonial[]>("/api/testimonials?approved=false"),
    []
  );
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "reorder">("cards");

  const handleReorder = async (reordered: SortableTestimonial[]) => {
    const reorderedMap = new Map(reordered.map((r) => [r.id, r]));
    const nextAll = (data || []).map((t) => reorderedMap.get(t.id) || t);
    setData(nextAll);
    try {
      await api("/api/testimonials/reorder", {
        method: "PATCH",
        body: JSON.stringify({
          items: reordered.map((s) => ({ id: s.id, order: s.order })),
        }),
      });
      toast.success("Order saved", { description: "Testimonials reordered" });
    } catch (e) {
      toast.error("Failed to save order", { description: (e as Error).message });
    }
  };

  const filtered = useMemo(() => {
    const list = data || [];
    return list
      .filter((t) =>
        filter === "approved" ? t.approved : filter === "pending" ? !t.approved : true
      )
      .sort((a, b) => a.order - b.order || (a.createdAt < b.createdAt ? 1 : -1));
  }, [data, filter]);

  const counts = useMemo(() => {
    const list = data || [];
    return {
      all: list.length,
      approved: list.filter((t) => t.approved).length,
      pending: list.filter((t) => !t.approved).length,
    };
  }, [data]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSheetOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name,
      role: t.role,
      company: t.company,
      message: t.message,
      avatarUrl: t.avatarUrl || "",
      rating: t.rating,
      approved: t.approved,
      order: t.order,
    });
    setSheetOpen(true);
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm((f) => ({ ...f, avatarUrl: url }));
      toast.success("Avatar uploaded");
    } catch (e) {
      toast.error("Upload failed", { description: (e as Error).message });
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!form.name.trim() || !form.role.trim() || !form.company.trim() || !form.message.trim()) {
      toast.error("Name, role, company, and message are all required");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      company: form.company.trim(),
      message: form.message.trim(),
      avatarUrl: form.avatarUrl || null,
      rating: Number(form.rating),
      approved: form.approved,
      order: Number(form.order) || 0,
    };
    try {
      if (editing) {
        const updated = await api<Testimonial>(`/api/testimonials/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setData((data || []).map((x) => (x.id === editing.id ? updated : x)));
        toast.success("Testimonial updated");
      } else {
        const created = await api<Testimonial>("/api/testimonials", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setData([...(data || []), created]);
        toast.success("Testimonial added");
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

  const toggleApproved = async (t: Testimonial) => {
    const next = !t.approved;
    setData((data || []).map((x) => (x.id === t.id ? { ...x, approved: next } : x)));
    try {
      await api(`/api/testimonials/${t.id}`, {
        method: "PATCH",
        body: JSON.stringify({ approved: next }),
      });
      toast.success(next ? "Testimonial approved" : "Testimonial unapproved");
    } catch (e) {
      setData((data || []).map((x) => (x.id === t.id ? { ...x, approved: !next } : x)));
      toast.error("Failed to toggle", { description: (e as Error).message });
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api(`/api/testimonials/${deleteId}`, { method: "DELETE" });
      setData((data || []).filter((x) => x.id !== deleteId));
      toast.success("Testimonial deleted");
      setDeleteId(null);
    } catch (e) {
      toast.error("Failed to delete", { description: (e as Error).message });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Testimonials"
        title="Manage testimonials"
        description="Curate what people say about you. Approve, edit, or remove submissions."
        icon={MessageSquareQuote}
        action={
          <Button
            onClick={openCreate}
            className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add testimonial
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {([
            { key: "all", label: "All", count: counts.all, icon: MessageSquareQuote },
            { key: "approved", label: "Approved", count: counts.approved, icon: CheckCircle2 },
            { key: "pending", label: "Pending", count: counts.pending, icon: Clock3 },
          ] as const).map((f) => {
            const active = filter === f.key;
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-blue-500/20 to-violet-600/20 text-foreground ring-1 ring-white/15"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {f.label}
                <span
                  className={cn(
                    "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-white/15" : "bg-white/5"
                  )}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setViewMode("cards")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              viewMode === "cards" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"
            )}
            title="Card Grid View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            onClick={() => setViewMode("reorder")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              viewMode === "reorder" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"
            )}
            title="Drag to Reorder"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reorder</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl glass p-4">
          <EmptyState
            icon={CircleSlash}
            title="No testimonials here"
            hint={filter === "pending" ? "No testimonials waiting for approval." : "Add a testimonial to get started."}
          />
        </div>
      ) : viewMode === "reorder" ? (
        <SortableTestimonialsList
          items={filtered}
          onReorder={handleReorder}
          onEdit={openEdit}
          onDelete={(id) => setDeleteId(id)}
          onToggleApproved={toggleApproved}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04 * i }}
              className="group relative flex flex-col rounded-2xl glass p-5 transition-all hover:bg-white/[0.05]"
            >
              {/* big quote glyph */}
              <span
                aria-hidden
                className="absolute -top-2 right-4 select-none font-display text-5xl leading-none text-white/5"
              >
                &rdquo;
              </span>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-violet-600 ring-1 ring-white/10">
                  {t.avatarUrl ? (
                     
                    <img
                      src={t.avatarUrl}
                      alt={t.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-sm font-bold text-white">
                      {t.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-foreground">
                    {t.name}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {t.role} @ {t.company}
                  </div>
                </div>
                <Badge
                  variant={t.approved ? "default" : "secondary"}
                  className={cn(
                    "shrink-0 text-[10px]",
                    t.approved
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/15 text-amber-300"
                  )}
                >
                  {t.approved ? "Approved" : "Pending"}
                </Badge>
              </div>

              <div className="mt-3 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={cn(
                      "h-3.5 w-3.5",
                      idx < t.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-white/5 text-white/10"
                    )}
                  />
                ))}
              </div>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80 line-clamp-5">
                {t.message}
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleApproved(t)}
                  className="h-7 gap-1.5 px-2 text-xs"
                >
                  {t.approved ? (
                    <>
                      <Clock3 className="h-3 w-3" />
                      Unapprove
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Approve
                    </>
                  )}
                </Button>
                <div className="flex-1" />
                <button
                  onClick={() => openEdit(t)}
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(t.id)}
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full flex-col gap-0 p-0 sm:max-w-md md:max-w-lg">
          <SheetHeader className="border-b border-white/5 px-6 py-4">
            <SheetTitle className="font-display">
              {editing ? "Edit testimonial" : "Add testimonial"}
            </SheetTitle>
            <SheetDescription className="text-xs">
              {editing ? "Update this testimonial's details." : "Add a new testimonial to your collection."}
            </SheetDescription>
          </SheetHeader>

          <div
            className="flex-1 overflow-y-auto px-6 py-5"
            style={{ maxHeight: "calc(90vh - 4rem)" }}
          >
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                  {form.avatarUrl ? (
                     
                    <img
                      src={form.avatarUrl}
                      alt="avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted-foreground">
                      <ImagePlus className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="t-avatar">Avatar URL</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e.target.files?.[0])}
                    disabled={uploading}
                    className="cursor-pointer file:bg-white/5 file:text-xs"
                  />
                  {uploading && <p className="text-[11px] text-blue-400">Uploading…</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="t-name">Name</Label>
                  <Input
                    id="t-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-rating">Rating</Label>
                  <Select
                    value={String(form.rating)}
                    onValueChange={(v) => setForm({ ...form, rating: Number(v) })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <SelectItem key={r} value={String(r)}>
                          {r} star{r === 1 ? "" : "s"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="t-role">Role</Label>
                  <Input
                    id="t-role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Product Manager"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-company">Company</Label>
                  <Input
                    id="t-company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Acme Inc."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="t-message">Message</Label>
                <Textarea
                  id="t-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Working with … was an absolute pleasure…"
                  rows={5}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="t-order">Display order</Label>
                  <Input
                    id="t-order"
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                  <Label htmlFor="t-approved" className="cursor-pointer">
                    Approved
                  </Label>
                  <Switch
                    id="t-approved"
                    checked={form.approved}
                    onCheckedChange={(c) => setForm({ ...form, approved: c })}
                  />
                </div>
              </div>
            </div>
          </div>

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
                "Add testimonial"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="glass-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the testimonial from your collection. This action cannot be undone.
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
