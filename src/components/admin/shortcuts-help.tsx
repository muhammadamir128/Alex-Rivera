"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Shortcut = {
  keys: string[];
  label: string;
  group: string;
};

const SHORTCUTS: Shortcut[] = [
  { keys: ["⌘", "K"], label: "Open command palette", group: "Global" },
  { keys: ["?"], label: "Toggle this shortcuts panel", group: "Global" },
  { keys: ["/"], label: "Focus the page search box", group: "Global" },
  { keys: ["Esc"], label: "Close dialogs / menus", group: "Global" },
  { keys: ["↑", "↓"], label: "Navigate command palette items", group: "Command palette" },
  { keys: ["↵"], label: "Run selected command", group: "Command palette" },
  { keys: ["g", "d"], label: "Go to Dashboard", group: "Navigation" },
  { keys: ["g", "p"], label: "Go to Projects", group: "Navigation" },
  { keys: ["g", "s"], label: "Go to Skills", group: "Navigation" },
  { keys: ["g", "e"], label: "Go to Experience", group: "Navigation" },
  { keys: ["g", "t"], label: "Go to Testimonials", group: "Navigation" },
  { keys: ["g", "m"], label: "Go to Messages", group: "Navigation" },
];

export function ShortcutsHelp({
  open: controlledOpen,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inField = ["INPUT", "TEXTAREA", "SELECT"].includes(tag);
      if (e.key === "?") {
        if (inField) return;
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // "g" + letter navigation
  useEffect(() => {
    let lastG = 0;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inField = ["INPUT", "TEXTAREA", "SELECT"].includes(tag);
      if (inField) return;
      const now = Date.now();
      if (e.key.toLowerCase() === "g") {
        lastG = now;
        return;
      }
      if (now - lastG < 800 && lastG > 0) {
        const map: Record<string, string> = {
          d: "/admin",
          p: "/admin/projects",
          s: "/admin/skills",
          e: "/admin/experience",
          t: "/admin/testimonials",
          m: "/admin/messages",
        };
        const href = map[e.key.toLowerCase()];
        if (href) {
          e.preventDefault();
          window.location.href = href;
          lastG = 0;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const groups = Array.from(new Set(SHORTCUTS.map((s) => s.group)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[12%] max-w-lg translate-y-0 gap-0 overflow-hidden rounded-2xl border-white/10 bg-[#0a0e1a]/95 p-0 backdrop-blur-2xl">
        <DialogTitle className="sr-only">Keyboard shortcuts</DialogTitle>
        <DialogDescription className="sr-only">
          List of available keyboard shortcuts in the admin panel.
        </DialogDescription>
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white">
              <Keyboard className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-sm font-semibold">Keyboard shortcuts</h2>
              <p className="text-[11px] text-muted-foreground">Press ? anytime to toggle</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {groups.map((group) => (
            <div key={group} className="mb-4 last:mb-0">
              <h3 className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </h3>
              <ul className="space-y-0.5">
                {SHORTCUTS.filter((s) => s.group === group).map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/[0.03]"
                  >
                    <span className="text-sm text-foreground/80">{s.label}</span>
                    <span className="flex items-center gap-1">
                      {s.keys.map((k, j) => (
                        <kbd
                          key={j}
                          className="min-w-[24px] rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-center font-mono text-[11px] font-medium text-foreground/80"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 px-5 py-3 text-[11px] text-muted-foreground">
          Tip: type <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono text-[10px]">g</kbd>{" "}
          then a letter to jump to a section.
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** A small floating button that opens the shortcuts help — shown in the admin sidebar footer. */
export function ShortcutsHelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
    >
      <Keyboard className="h-3.5 w-3.5" />
      Shortcuts
      <kbd className="ml-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono">
        ?
      </kbd>
    </button>
  );
}
