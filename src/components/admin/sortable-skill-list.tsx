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
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type SortableSkill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  order: number;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
};

function proficiencyColor(value: number) {
  if (value >= 85) return "from-emerald-500 to-teal-400";
  if (value >= 65) return "from-blue-500 to-cyan-400";
  if (value >= 40) return "from-amber-500 to-orange-400";
  return "from-rose-500 to-pink-400";
}

export function SortableSkillList({
  items,
  onReorder,
  onEdit,
  onDelete,
}: {
  items: SortableSkill[];
  onReorder: (newItems: SortableSkill[]) => void;
  onEdit: (skill: SortableSkill) => void;
  onDelete: (id: string) => void;
}) {
  const [localItems, setLocalItems] = useState(items);

  // keep local state in sync when parent data changes (e.g. after refetch)
  if (items.length !== localItems.length || items.some((it, i) => it.id !== localItems[i]?.id && it.order !== localItems[i]?.order)) {
    // Only sync if the IDs/order diverge structurally; avoid clobbering during a drag.
    const sameIds = items.length === localItems.length && items.every((it, i) => it.id === localItems[i].id);
    if (!sameIds) {
      setLocalItems(items);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocalItems((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const next = arrayMove(prev, oldIndex, newIndex);
      // re-index order
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
        <ul className="mt-4 space-y-1">
          {localItems.map((s) => (
            <SortableSkillRow
              key={s.id}
              skill={s}
              onEdit={() => onEdit(s)}
              onDelete={() => onDelete(s.id)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableSkillRow({
  skill,
  onEdit,
  onDelete,
}: {
  skill: SortableSkill;
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
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      layout
      className={cn(
        "group flex items-center gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.03]",
        isDragging && "bg-blue-500/10 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-400/30 cursor-grabbing"
      )}
    >
      {/* drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="grid h-7 w-5 shrink-0 cursor-grab touch-none place-items-center text-muted-foreground/40 transition-colors hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
        tabIndex={-1}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 font-mono text-[10px] text-muted-foreground">
        {String(skill.order).padStart(2, "0")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {skill.name}
          </span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {skill.proficiency}%
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r",
              proficiencyColor(skill.proficiency)
            )}
            style={{ width: `${skill.proficiency}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
          aria-label="Edit skill"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
          aria-label="Delete skill"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.li>
  );
}
