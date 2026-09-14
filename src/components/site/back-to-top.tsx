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
          className="group fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full glass-strong text-foreground shadow-2xl shadow-black/40 transition-colors hover:bg-white/[0.1] hover:text-blue-300"
        >
          {/* progress ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="url(#bt-ring)"
              strokeWidth="2"
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
          <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
