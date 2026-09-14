"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Boxes as BoxesIcon,
  CircleSlash,
} from "lucide-react";
import { toast } from "sonner";
import { api, useAsync } from "@/components/admin/use-async";
import { SortableSkillList, type SortableSkill } from "@/components/admin/sortable-skill-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  order: number;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  name: string;
  category: string;
  proficiency: number;
  order: number;
};

const DEFAULT_CATEGORIES = ["Frontend", "Backend", "Database", "Tools"];

const EMPTY_FORM: FormState = {
  name: "",
  category: "Frontend",
  proficiency: 80,
  order: 0,
};

function proficiencyColor(value: number) {
  if (value >= 85) return "from-emerald-500 to-teal-400";
  if (value >= 65) return "from-blue-500 to-cyan-400";
  if (value >= 40) return "from-amber-500 to-orange-400";
  return "from-rose-500 to-pink-400";
}

export default function AdminSkillsPage() {
  const { data, loading, refetch, setData } = useAsync<Skill[]>(
    () => api<Skill[]>("/api/skills"),
    []
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [customCat, setCustomCat] = useState("");

  const groups = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const s of data || []) {
      const key = s.category || "Uncategorized";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    // sort each group by order then name
    for (const [k, list] of map) {
      map.set(
        k,
        list.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
      );
    }
    // sort categories: known first, then custom alphabetical
    const known = DEFAULT_CATEGORIES.filter((c) => map.has(c));
    const custom = [...map.keys()]
      .filter((c) => !DEFAULT_CATEGORIES.includes(c))
      .sort((a, b) => a.localeCompare(b));
    return [...known, ...custom].map((c) => ({ category: c, items: map.get(c)! }));
  }, [data]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setCustomCat("");
    setSheetOpen(true);
  };

  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      order: s.order,
    });
    setCustomCat(DEFAULT_CATEGORIES.includes(s.category) ? "" : s.category);
    setSheetOpen(true);
  };

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error("Skill name is required");
      return;
    }
    const category =
      form.category === "__custom__" ? customCat.trim() || "Other" : form.category;
    if (!category) {
      toast.error("Category is required");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      category,
      proficiency: Number(form.proficiency),
      order: Number(form.order) || 0,
    };
    try {
      if (editing) {
        const updated = await api<Skill>(`/api/skills/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setData((data || []).map((s) => (s.id === editing.id ? updated : s)));
        toast.success("Skill updated");
      } else {
        const created = await api<Skill>("/api/skills", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setData([...(data || []), created]);
        toast.success("Skill added");
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
      await api(`/api/skills/${deleteId}`, { method: "DELETE" });
      setData((data || []).filter((s) => s.id !== deleteId));
      toast.success("Skill deleted");
      setDeleteId(null);
    } catch (e) {
      toast.error("Failed to delete", { description: (e as Error).message });
    } finally {
      setDeleting(false);
    }
  };

  const handleReorder = async (category: string, reordered: SortableSkill[]) => {
    // optimistic update: set new order across the whole dataset
    const reorderedIds = new Map(reordered.map((s) => [s.id, s.order]));
    const otherCategories = (data || []).filter((s) => s.category !== category);
    const newAll = [...otherCategories, ...reordered];
    setData(newAll);

    try {
      await api("/api/skills/reorder", {
        method: "PATCH",
        body: JSON.stringify({
          items: reordered.map((s) => ({ id: s.id, order: s.order })),
        }),
      });
      toast.success("Order saved", { description: `${category} reordered` });
    } catch (e) {
      toast.error("Reorder failed", { description: (e as Error).message });
      // revert by refetching
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Skills"
        title="Manage skills"
        description="Group, reorder, and tune proficiency for each skill you showcase."
        icon={Boxes}
        action={
          <Button
            onClick={openCreate}
            className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add skill
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-2xl glass p-4">
          <EmptyState
            icon={CircleSlash}
            title="No skills yet"
            hint="Add your first skill to start building your tech profile."
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((g, gi) => (
            <motion.div
              key={g.category}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04 * gi }}
              className="rounded-2xl glass p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-600/20 text-blue-300">
                    <BoxesIcon className="h-4 w-4" />
                  </div>
                  <h2 className="font-display text-sm font-semibold tracking-tight">
                    {g.category}
                  </h2>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">
                  {g.items.length} skill{g.items.length === 1 ? "" : "s"}
                </span>
              </div>

              <SortableSkillList
                items={g.items}
                onReorder={(reordered) => handleReorder(g.category, reordered)}
                onEdit={(s) => openEdit(s as Skill)}
                onDelete={(id) => setDeleteId(id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-white/5 px-6 py-4">
            <SheetTitle className="font-display">
              {editing ? "Edit skill" : "Add skill"}
            </SheetTitle>
            <SheetDescription className="text-xs">
              {editing
                ? "Update this skill's details and proficiency."
                : "Add a new skill to your profile."}
            </SheetDescription>
          </SheetHeader>

          <div
            className="flex-1 overflow-y-auto px-6 py-5"
            style={{ maxHeight: "calc(90vh - 4rem)" }}
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="s-name">Name</Label>
                <Input
                  id="s-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. React, Node.js, PostgreSQL"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pick a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                    <SelectItem value="__custom__">+ Custom category</SelectItem>
                  </SelectContent>
                </Select>
                {form.category === "__custom__" && (
                  <Input
                    value={customCat}
                    onChange={(e) => setCustomCat(e.target.value)}
                    placeholder="Type a custom category name"
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="s-prof">Proficiency</Label>
                  <span className="font-mono text-sm font-semibold text-blue-300">
                    {form.proficiency}%
                  </span>
                </div>
                <Slider
                  id="s-prof"
                  value={[form.proficiency]}
                  onValueChange={(v) => setForm({ ...form, proficiency: v[0] })}
                  min={0}
                  max={100}
                  step={5}
                />
                <div
                  className={cn(
                    "h-1.5 w-full overflow-hidden rounded-full bg-white/5"
                  )}
                >
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all",
                      proficiencyColor(form.proficiency)
                    )}
                    style={{ width: `${form.proficiency}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="s-order">Display order</Label>
                <Input
                  id="s-order"
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
                <p className="text-[11px] text-muted-foreground">
                  Lower numbers appear first within a category.
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
                "Add skill"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="glass-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this skill?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the skill from your profile. This action cannot be undone.
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
