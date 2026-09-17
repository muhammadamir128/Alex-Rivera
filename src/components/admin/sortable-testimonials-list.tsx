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
import {
  GripVertical,
  Pencil,
  Trash2,
  Star,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type SortableTestimonial = {
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

export function SortableTestimonialsList({
  items,
  onReorder,
  onEdit,
  onDelete,
  onToggleApproved,
}: {
  items: SortableTestimonial[];
  onReorder: (newItems: SortableTestimonial[]) => void;
  onEdit: (item: SortableTestimonial) => void;
  onDelete: (id: string) => void;
  onToggleApproved: (item: SortableTestimonial) => void;
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
        <div className="space-y-3">
          {localItems.map((item, index) => (
            <SortableTestimonialRow
              key={item.id}
              item={item}
              index={index}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
              onToggleApproved={() => onToggleApproved(item)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableTestimonialRow({
  item: t,
  index,
  onEdit,
  onDelete,
  onToggleApproved,
}: {
  item: SortableTestimonial;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleApproved: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: t.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.02 * index }}
      className={cn(
        "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl glass p-4 transition-all hover:bg-white/[0.04] border border-white/5",
        isDragging && "bg-blue-500/10 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-400/30"
      )}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 grid h-7 w-7 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted-foreground/40 transition-colors hover:bg-white/5 hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
          tabIndex={-1}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* avatar */}
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

        {/* content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground tracking-tight">
              {t.name}
            </h4>
            <span className="text-xs text-muted-foreground">
              {t.role} @ <span className="text-blue-300 font-medium">{t.company}</span>
            </span>
            <Badge
              variant={t.approved ? "default" : "secondary"}
              className={cn(
                "ml-auto sm:ml-0 text-[10px]",
                t.approved
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
              )}
            >
              {t.approved ? "Approved" : "Pending"}
            </Badge>
            <span className="text-[10px] font-mono text-muted-foreground/60">
              #{t.order}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={cn(
                  "h-3 w-3",
                  idx < t.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-white/5 text-white/10"
                )}
              />
            ))}
          </div>

          <p className="mt-1.5 text-xs leading-relaxed text-foreground/80 line-clamp-2">
            "{t.message}"
          </p>
        </div>
      </div>

      {/* action buttons */}
      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleApproved}
          className="h-7 gap-1 px-2 text-[11px] glass hover:bg-white/10"
        >
          {t.approved ? (
            <>
              <Clock3 className="h-3 w-3 text-amber-400" />
              <span>Unapprove</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>Approve</span>
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="h-7 w-7 p-0 glass hover:bg-white/10"
          aria-label="Edit testimonial"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-7 w-7 p-0 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
          aria-label="Delete testimonial"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
