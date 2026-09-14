"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  CalendarDays,
  CircleSlash,
} from "lucide-react";
import { toast } from "sonner";
import { api, useAsync } from "@/components/admin/use-async";
import {
  SortableExperienceList,
  type SortableExperience,
} from "@/components/admin/sortable-experience-list";
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

type Experience = {
  id: string;
  role: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  techUsed: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  techUsed: string[];
  techInput: string;
  order: number;
};

const EMPTY_FORM: FormState = {
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  techUsed: [],
  techInput: "",
  order: 0,
};

function formatDate(yyyy_mm: string) {
  if (!yyyy_mm) return "";
  const [y, m] = yyyy_mm.split("-");
  if (!y || !m) return yyyy_mm;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const idx = parseInt(m, 10) - 1;
  return `${months[idx] || m} ${y}`;
}

export default function AdminExperiencePage() {
  const { data, loading, refetch, setData } = useAsync<Experience[]>(
    () => api<Experience[]>("/api/experience"),
    []
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sorted = (data || []).slice().sort((a, b) => a.order - b.order);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSheetOpen(true);
  };

  const openEdit = (e: Experience) => {
    setEditing(e);
    setForm({
      role: e.role,
      company: e.company,
      location: e.location || "",
      startDate: e.startDate || "",
      endDate: e.endDate || "",
      current: e.current,
      description: e.description || "",
      techUsed: e.techUsed || [],
      techInput: "",
      order: e.order,
    });
    setSheetOpen(true);
  };

  const addTech = () => {
    const raw = form.techInput.split(",").map((t) => t.trim()).filter(Boolean);
    if (!raw.length) return;
    setForm((f) => ({
      ...f,
      techUsed: Array.from(new Set([...f.techUsed, ...raw])),
      techInput: "",
    }));
  };

  const removeTech = (tag: string) => {
    setForm((f) => ({ ...f, techUsed: f.techUsed.filter((t) => t !== tag) }));
  };

  const submit = async () => {
    if (!form.role.trim() || !form.company.trim()) {
      toast.error("Role and company are required");
      return;
    }
    if (!form.startDate) {
      toast.error("Start date is required");
      return;
    }
    setSaving(true);
    const payload = {
      role: form.role.trim(),
      company: form.company.trim(),
      location: form.location || null,
      startDate: form.startDate,
      endDate: form.current ? null : form.endDate || null,
      current: form.current,
      description: form.description,
      techUsed: form.techUsed,
      order: Number(form.order) || 0,
    };
    try {
      if (editing) {
        const updated = await api<Experience>(`/api/experience/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setData((data || []).map((x) => (x.id === editing.id ? updated : x)));
        toast.success("Experience updated");
      } else {
        const created = await api<Experience>("/api/experience", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setData([...(data || []), created]);
        toast.success("Experience added");
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

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api(`/api/experience/${deleteId}`, { method: "DELETE" });
      setData((data || []).filter((x) => x.id !== deleteId));
      toast.success("Experience deleted");
      setDeleteId(null);
    } catch (e) {
      toast.error("Failed to delete", { description: (e as Error).message });
    } finally {
      setDeleting(false);
    }
  };

  const handleReorder = async (reordered: SortableExperience[]) => {
    setData(reordered);
    try {
      await api("/api/experience/reorder", {
        method: "PATCH",
        body: JSON.stringify({
          items: reordered.map((s) => ({ id: s.id, order: s.order })),
        }),
      });
      toast.success("Order saved", { description: "Timeline reordered" });
    } catch (e) {
      toast.error("Reorder failed", { description: (e as Error).message });
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Experience"
        title="Manage experience"
        description="Document your career timeline, roles, and the stack you worked with."
        icon={Briefcase}
        action={
          <Button
            onClick={openCreate}
            className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add experience
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl glass p-4">
          <EmptyState
            icon={CircleSlash}
            title="No experience entries yet"
            hint="Add your first role to start building your timeline."
          />
        </div>
      ) : (
        <SortableExperienceList
          items={sorted}
          onReorder={handleReorder}
          onEdit={(e) => openEdit(e as Experience)}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full flex-col gap-0 p-0 sm:max-w-md md:max-w-lg">
          <SheetHeader className="border-b border-white/5 px-6 py-4">
            <SheetTitle className="font-display">
              {editing ? "Edit experience" : "Add experience"}
            </SheetTitle>
            <SheetDescription className="text-xs">
              {editing
                ? "Update this role's details."
                : "Document a new role in your career timeline."}
            </SheetDescription>
          </SheetHeader>

          <div
            className="flex-1 overflow-y-auto px-6 py-5"
            style={{ maxHeight: "calc(90vh - 4rem)" }}
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="e-role">Role</Label>
                <Input
                  id="e-role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Senior Software Engineer"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="e-company">Company</Label>
                  <Input
                    id="e-company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Acme Inc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-loc">Location</Label>
                  <Input
                    id="e-loc"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Remote / San Francisco"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="e-start">Start date</Label>
                  <Input
                    id="e-start"
                    type="month"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-end">
                    End date{" "}
                    {form.current && (
                      <span className="text-[10px] text-muted-foreground">(current role)</span>
                    )}
                  </Label>
                  <Input
                    id="e-end"
                    type="month"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    disabled={form.current}
                    className="disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <div>
                  <Label htmlFor="e-current" className="cursor-pointer">
                    I currently work here
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    End date will be hidden and "Present" shown instead.
                  </p>
                </div>
                <Switch
                  id="e-current"
                  checked={form.current}
                  onCheckedChange={(c) =>
                    setForm({ ...form, current: c, endDate: c ? "" : form.endDate })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="e-desc">Description</Label>
                <Textarea
                  id="e-desc"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What did you build, lead, or ship in this role?"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="e-tech">Tech used</Label>
                <Input
                  id="e-tech"
                  value={form.techInput}
                  onChange={(e) => setForm({ ...form, techInput: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  onBlur={addTech}
                  placeholder="Type a tech and press Enter (comma-separated)"
                />
                {form.techUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.techUsed.map((t) => (
                      <Badge key={t} variant="secondary" className="gap-1 pr-1.5">
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTech(t)}
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

              <div className="space-y-2">
                <Label htmlFor="e-order">Display order</Label>
                <Input
                  id="e-order"
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
                <p className="text-[11px] text-muted-foreground">
                  Lower numbers appear first in the timeline.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-white/5 px-6 py-4">
            <Button variant="ghost" onClick={() => setSheetOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={saving}
              className={cn(
                "gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
              )}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : editing ? (
                "Save changes"
              ) : (
                "Add experience"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="glass-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this experience entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the role from your timeline. This action cannot be undone.
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
