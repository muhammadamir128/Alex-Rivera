"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin reading progress bar fixed to the top of the viewport.
 * Tracks scroll progress through the current page's main content.
 * Intended for long-form pages like project case studies.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[55] h-1 origin-left bg-gradient-to-r from-blue-400 via-violet-500 to-cyan-400"
    />
  );
}
