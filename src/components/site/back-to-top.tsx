"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * Floating "back to top" button that appears after scrolling.
 * Shows a circular progress ring indicating how far down the page you are.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const scrollProgress = useSpring(0, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(ratio);
      scrollProgress.set(ratio);
      setVisible(scrollTop > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // circle geometry
  const R = 18;
  const CIRC = 2 * Math.PI * R;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="group fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-white shadow-xl shadow-black/10 dark:shadow-black/50 transition-all hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 cursor-pointer"
        >
          {/* progress ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-white/10"
              strokeWidth="2.5"
            />
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="url(#bt-ring)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - progress)}
              className="transition-[stroke-dashoffset] duration-150"
            />
            <defs>
              <linearGradient id="bt-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp className="relative z-10 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
