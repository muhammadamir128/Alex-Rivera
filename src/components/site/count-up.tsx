"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

/**
 * Animated count-up that triggers when scrolled into view.
 * Renders a plain number (no wrapping span) so it can be composed freely.
 */
export function CountUp({
  value,
  duration = 1.4,
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const mv = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, mv]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
