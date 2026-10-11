"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Theme toggle button — switches between dark and light themes.
 * Renders a compact icon button; the sun/moon swap is a CSS transition so the
 * correct icon is painted even before a script-driven animation frame runs.
 *
 * next-themes can only resolve the stored theme on the client, so the button is
 * always rendered with the app's dark-first default and swaps once the theme is
 * known. Client-side detection uses `useSyncExternalStore` rather than a mount
 * effect or `requestAnimationFrame` — a setState-in-effect causes a cascading
 * render, and animation frames are never delivered while the tab is hidden or
 * the window is occluded, either of which would leave the toggle blank.
 */
const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot
  );

  // `resolvedTheme` is only known once next-themes' own effect has run, which
  // happens *after* this component's first client render. Dark is the app's
  // default, so anything other than an explicit light resolution — including
  // that first frame — renders as dark and the icon never flip-flops.
  const isDark = !isClient || resolvedTheme !== "light";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-lg glass text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground",
        className
      )}
      aria-label={label}
      title={label}
    >
      <Sun
        aria-hidden
        className={cn(
          "col-start-1 row-start-1 h-4 w-4 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
          isDark ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          "col-start-1 row-start-1 h-4 w-4 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
          isDark ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"
        )}
      />
    </button>
  );
}
