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
import { GripVertical, MapPin, CalendarDays, Pencil, Trash2, GraduationCap, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type SortableEducation = {
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

function formatDate(yyyy_mm: string) {
  if (!yyyy_mm) return "";
  const [y, m] = yyyy_mm.split("-");
  if (!y || !m) return yyyy_mm;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const idx = parseInt(m, 10) - 1;
  return `${months[idx] || m} ${y}`;
}

export function SortableEducationList({
  items,
  onReorder,
  onEdit,
  onDelete,
}: {
  items: SortableEducation[];
  onReorder: (newItems: SortableEducation[]) => void;
  onEdit: (item: SortableEducation) => void;
  onDelete: (id: string) => void;
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
        <div className="relative space-y-4">
          <div
            aria-hidden
            className="absolute bottom-4 left-[18px] top-4 w-px bg-gradient-to-b from-blue-500/40 via-violet-500/20 to-transparent sm:left-[26px]"
          />
          {localItems.map((e, i) => (
            <SortableEducationRow
              key={e.id}
              item={e}
              index={i}
              onEdit={() => onEdit(e)}
              onDelete={() => onDelete(e.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableEducationRow({
  item: e,
  index,
  onEdit,
  onDelete,
}: {
  item: SortableEducation;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: e.id });

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
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.04 * index }}
      className={cn(
        "relative pl-10 sm:pl-14",
        isDragging && "z-20"
      )}
    >
      <span className="absolute left-[11px] top-5 grid h-3.5 w-3.5 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-violet-500 ring-4 ring-[#0a0e1a] sm:left-[19px]">
        <span className="h-1 w-1 rounded-full bg-white" />
      </span>

      <div
        className={cn(
          "group rounded-2xl glass p-5 transition-colors hover:bg-white/[0.04]",
          isDragging && "bg-blue-500/10 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-400/30"
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <button
                {...attributes}
                {...listeners}
                className="-ml-1 mr-0.5 grid h-5 w-5 shrink-0 cursor-grab touch-none place-items-center text-muted-foreground/40 transition-colors hover:text-foreground active:cursor-grabbing"
                aria-label="Drag to reorder"
                tabIndex={-1}
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <h3 className="font-display text-base font-semibold tracking-tight">
                {e.degree}
              </h3>
              <span className="text-muted-foreground">@</span>
              <span className="text-sm font-medium text-blue-300">
                {e.institution}
              </span>
              {e.current && (
                <Badge className="bg-emerald-500/15 text-[10px] text-emerald-300">
                  Enrolled
                </Badge>
              )}
            </div>

            {e.field && (
              <p className="mt-0.5 pl-6 text-xs text-muted-foreground/90 font-medium">
                Field of study: <span className="text-foreground/90">{e.field}</span>
              </p>
            )}

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 pl-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(e.startDate)} —{" "}
                {e.current ? "Present" : formatDate(e.endDate || "")}
              </span>
              {e.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {e.location}
                </span>
              )}
              {e.grade && (
                <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                  <Award className="h-3.5 w-3.5" />
                  {e.grade}
                </span>
              )}
              <span className="font-mono text-[10px] opacity-60">
                order #{e.order}
              </span>
            </div>

            {e.description && (
              <p className="mt-3 pl-6 text-sm leading-relaxed text-foreground/80">
                {e.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 sm:flex-col">
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
        </div>
      </div>
    </motion.div>
  );
}
