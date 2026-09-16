"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  CalendarDays,
  Award,
  BookOpen,
  CircleSlash,
} from "lucide-react";
import { toast } from "sonner";
import { api, useAsync } from "@/components/admin/use-async";
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

type Education = {
  id: string;
  degree: string;
  institution: string;
  field: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  grade: string | null;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  degree: string;
  institution: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  grade: string;
  description: string;
  order: number;
};

const EMPTY_FORM: FormState = {
  degree: "",
  institution: "",
  field: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  grade: "",
  description: "",
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

export default function AdminEducationPage() {
  const { data, loading, refetch, setData } = useAsync<Education[]>(
    () => api<Education[]>("/api/education"),
    []
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sorted = (data || []).slice().sort((a, b) => a.order - b.order || b.startDate.localeCompare(a.startDate));

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSheetOpen(true);
  };

  const openEdit = (e: Education) => {
    setEditing(e);
    setForm({
      degree: e.degree,
      institution: e.institution,
      field: e.field || "",
      location: e.location || "",
      startDate: e.startDate || "",
      endDate: e.endDate || "",
      current: e.current,
      grade: e.grade || "",
      description: e.description || "",
      order: e.order,
    });
    setSheetOpen(true);
  };

  const submit = async () => {
    if (!form.degree.trim() || !form.institution.trim()) {
      toast.error("Degree and institution are required");
      return;
    }
    if (!form.startDate) {
      toast.error("Start date is required");
      return;
    }
    setSaving(true);
    const payload = {
      degree: form.degree.trim(),
      institution: form.institution.trim(),
      field: form.field.trim() || null,
      location: form.location.trim() || null,
      startDate: form.startDate,
      endDate: form.current ? null : form.endDate || null,
      current: form.current,
      grade: form.grade.trim() || null,
      description: form.description.trim(),
      order: Number(form.order) || 0,
    };

    try {
      if (editing) {
        const updated = await api<Education>(`/api/education/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setData((data || []).map((x) => (x.id === editing.id ? updated : x)));
        toast.success("Education record updated");
      } else {
        const created = await api<Education>("/api/education", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setData([...(data || []), created]);
        toast.success("Education record added");
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
      await api(`/api/education/${deleteId}`, { method: "DELETE" });
      setData((data || []).filter((x) => x.id !== deleteId));
      toast.success("Education record deleted");
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
        eyebrow="Academic Background"
        title="Manage Education"
        description="Add and organize your degrees, university qualifications, academic honors, and achievements."
        icon={GraduationCap}
        action={
          <Button
            onClick={openCreate}
            className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90 shadow-md shadow-violet-600/20"
          >
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl glass p-4">
          <EmptyState
            icon={CircleSlash}
            title="No education entries yet"
            hint="Add your degree or diploma to showcase your academic credentials."
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {sorted.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-2xl glass p-6 transition-all hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/20 text-blue-400 ring-1 ring-white/10 shadow-sm">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {item.degree}
                      </h3>
                      {item.current && (
                        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">
                          In Progress
                        </Badge>
                      )}
                      {item.grade && (
                        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs">
                          <Award className="mr-1 h-3 w-3" />
                          {item.grade}
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 font-medium text-blue-400">
                      {item.institution}
                      {item.field && (
                        <span className="text-muted-foreground font-normal"> · {item.field}</span>
                      )}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-blue-400/80" />
                        {formatDate(item.startDate)} — {item.current ? "Present" : formatDate(item.endDate || "")}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground/80" />
                          {item.location}
                        </span>
                      )}
                      <span className="text-muted-foreground/60 font-mono">
                        Order #{item.order}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-3xl">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(item)}
                    className="h-8 gap-1.5 glass text-xs hover:bg-white/10"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(item.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit / Create Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full flex-col gap-0 p-0 sm:max-w-md md:max-w-lg">
          <SheetHeader className="border-b border-white/5 px-6 py-4">
            <SheetTitle className="font-display">
              {editing ? "Edit Education" : "Add Education"}
            </SheetTitle>
            <SheetDescription className="text-xs">
              {editing
                ? "Update your degree, university, or academic achievements."
                : "Add a new qualification to your profile."}
            </SheetDescription>
          </SheetHeader>

          <div
            className="flex-1 overflow-y-auto px-6 py-5"
            style={{ maxHeight: "calc(90vh - 4rem)" }}
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="ed-degree">Degree / Qualification</Label>
                <Input
                  id="ed-degree"
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science in Computer Science (BSCS)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ed-inst">Institution / University</Label>
                <Input
                  id="ed-inst"
                  value={form.institution}
                  onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  placeholder="e.g. University of Engineering & Technology"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ed-field">Major / Field of Study</Label>
                  <Input
                    id="ed-field"
                    value={form.field}
                    onChange={(e) => setForm({ ...form, field: e.target.value })}
                    placeholder="e.g. Software Engineering"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ed-loc">Location</Label>
                  <Input
                    id="ed-loc"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Lahore, Pakistan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ed-start">Start date</Label>
                  <Input
                    id="ed-start"
                    type="month"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ed-end">
                    End date{" "}
                    {form.current && (
                      <span className="text-[10px] text-muted-foreground">(current study)</span>
                    )}
                  </Label>
                  <Input
                    id="ed-end"
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
                  <Label htmlFor="ed-current" className="cursor-pointer font-medium">
                    Currently studying here
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Shows &quot;Present&quot; instead of end date
                  </p>
                </div>
                <Switch
                  id="ed-current"
                  checked={form.current}
                  onCheckedChange={(checked) => setForm({ ...form, current: checked })}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ed-grade">Grade / CGPA / Honors</Label>
                  <Input
                    id="ed-grade"
                    value={form.grade}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    placeholder="e.g. 3.7 / 4.0 CGPA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ed-order">Display Order</Label>
                  <Input
                    id="ed-order"
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ed-desc">Description & Highlights</Label>
                <Textarea
                  id="ed-desc"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Key coursework, achievements, capstone project, or campus activities..."
                />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/5 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setSheetOpen(false)}
                disabled={saving}
                className="glass"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={submit}
                disabled={saving}
                className="bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Save changes" : "Add education"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="glass-strong border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Education Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this academic qualification. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleting ? "Deleting..." : "Delete"}
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
