"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, ExternalLink, Github, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type SortableProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  techTags: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
};

export function SortableProjectsTable({
  items,
  onReorder,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublished,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: {
  items: SortableProject[];
  onReorder: (newItems: SortableProject[]) => void;
  onEdit: (p: SortableProject) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (p: SortableProject) => void;
  onTogglePublished: (p: SortableProject) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (ids: string[], checked: boolean) => void;
}) {
  const [localItems, setLocalItems] = useState(items);

  const sameIds =
    items.length === localItems.length &&
    items.every((it, i) => it.id === localItems[i].id);
  if (!sameIds) {
    setLocalItems(items);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocalItems((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const next = arrayMove(prev, oldIndex, newIndex);
      const reindexed = next.map((s, i) => ({ ...s, order: i }));
      onReorder(reindexed);
      return reindexed;
    });
  };

  const visibleIds = localItems.map((s) => s.id);
  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const someSelected =
    visibleIds.some((id) => selectedIds.has(id)) && !allSelected;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localItems.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="w-10 px-3 py-2">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(checked) =>
                      onToggleSelectAll(visibleIds, checked === true)
                    }
                    aria-label="Select all visible"
                    className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                </th>
                <th className="px-3 py-2 font-medium">Order</th>
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">Tags</th>
                <th className="px-3 py-2 font-medium">Featured</th>
                <th className="px-3 py-2 font-medium">Published</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {localItems.map((p, i) => (
                <SortableProjectRow
                  key={p.id}
                  project={p}
                  index={i}
                  isSelected={selectedIds.has(p.id)}
                  onToggleSelect={() => onToggleSelect(p.id)}
                  onEdit={() => onEdit(p)}
                  onDelete={() => onDelete(p.id)}
                  onToggleFeatured={() => onToggleFeatured(p)}
                  onTogglePublished={() => onTogglePublished(p)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableProjectRow({
  project: p,
  index,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublished,
}: {
  project: SortableProject;
  index: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onTogglePublished: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: p.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <tr
      ref={setNodeRef as never}
      style={style}
      className={cn(
        "group border-b border-white/5 transition-colors",
        isSelected ? "bg-blue-500/[0.06]" : index % 2 === 1 && "bg-white/[0.015]",
        !isSelected && "hover:bg-white/[0.025]",
        isDragging && "bg-blue-500/10 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-400/30"
      )}
    >
      <td className="px-3 py-3 align-middle">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(c) => c !== undefined && onToggleSelect()}
          aria-label={`Select ${p.title}`}
          className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="px-3 py-3 align-middle">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <button
            {...attributes}
            {...listeners}
            className="grid h-6 w-5 shrink-0 cursor-grab touch-none place-items-center text-muted-foreground/40 transition-colors hover:text-foreground active:cursor-grabbing"
            aria-label="Drag to reorder"
            tabIndex={-1}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-xs tabular-nums">{p.order}</span>
        </div>
      </td>
      <td className="px-3 py-3 align-middle">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
            {p.coverImage ? (
              <img
                src={p.coverImage}
                alt={p.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted-foreground">
                <span className="text-[10px] font-mono">—</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground">{p.title}</div>
            <div className="truncate text-[11px] text-muted-foreground">/{p.slug}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 align-middle">
        <div className="flex max-w-[260px] flex-wrap gap-1">
          {p.techTags.slice(0, 3).map((t) => (
            <Badge key={t} variant="secondary" className="text-[10px]">
              {t}
            </Badge>
          ))}
          {p.techTags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">
              +{p.techTags.length - 3}
            </span>
          )}
          {p.techTags.length === 0 && (
            <span className="text-[10px] text-muted-foreground/60">—</span>
          )}
        </div>
      </td>
      <td className="px-3 py-3 align-middle">
        <button
          onClick={onToggleFeatured}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-lg transition-colors",
            p.isFeatured
              ? "text-amber-400 hover:bg-amber-400/10"
              : "text-muted-foreground/40 hover:bg-white/5 hover:text-muted-foreground"
          )}
          aria-label={p.isFeatured ? "Unfeature" : "Feature"}
        >
          <Star className={cn("h-4 w-4", p.isFeatured && "fill-amber-400")} />
        </button>
      </td>
      <td className="px-3 py-3 align-middle">
        <Switch
          checked={p.isPublished}
          onCheckedChange={onTogglePublished}
          aria-label={p.isPublished ? "Unpublish project" : "Publish project"}
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="px-3 py-3 text-right align-middle">
        <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
              aria-label="Live site"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {p.repoUrl && (
            <a
              href={p.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
              aria-label="Source code"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            onClick={onEdit}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
            aria-label="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
            aria-label="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
