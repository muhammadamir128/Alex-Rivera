"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Theme toggle button — switches between dark and light themes.
 * Renders a compact icon button with a smooth icon transition.
 *
 * Uses a mounted flag to avoid hydration mismatch (next-themes reads
 * localStorage on mount). The flag is set synchronously in a layout
 * effect to avoid a flash.
 */
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to defer the state update out of the effect body
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg glass",
          className
        )}
        aria-hidden
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-lg glass text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="grid place-items-center"
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="grid place-items-center"
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
