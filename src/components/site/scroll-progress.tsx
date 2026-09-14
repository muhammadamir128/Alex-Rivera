"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin gradient progress bar fixed to the top of the viewport that tracks
 * reading progress through the page. Sits above all other content.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-blue-400 via-violet-500 to-cyan-400"
    />
  );
}
