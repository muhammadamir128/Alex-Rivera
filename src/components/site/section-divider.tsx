"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A decorative section divider with a gradient line + center node.
 * Used between major sections to create visual rhythm.
 */
export function SectionDivider({
  className,
  variant = "line",
}: {
  className?: string;
  variant?: "line" | "dots" | "gradient";
}) {
  if (variant === "dots") {
    return (
      <div
        aria-hidden
        className={cn("flex items-center justify-center gap-1.5 py-2", className)}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="h-1 w-1 rounded-full bg-gradient-to-r from-blue-400 to-violet-500"
          />
        ))}
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div
        aria-hidden
        className={cn(
          "relative mx-auto h-px w-full max-w-6xl overflow-hidden",
          className
        )}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full origin-center bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"
        />
      </div>
    );
  }

  // default: line with center node
  return (
    <div
      aria-hidden
      className={cn("relative mx-auto flex max-w-6xl items-center", className)}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-px flex-1 origin-left bg-gradient-to-r from-transparent via-white/10 to-white/5"
      />
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mx-3 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-px flex-1 origin-right bg-gradient-to-l from-transparent via-white/10 to-white/5"
      />
    </div>
  );
}
