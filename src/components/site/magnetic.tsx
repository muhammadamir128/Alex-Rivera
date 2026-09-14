"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Magnetic hover wrapper — pulls its child slightly toward the cursor on hover.
 */
export function Magnetic({
  children,
  className,
  strength = 0.25,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "div" | "button" | "a";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref as never}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn("inline-flex", className)}
    >
      {children}
    </MotionTag>
  );
}

/** Tilt-on-hover card wrapper */
export function Tilt({
  children,
  className,
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const rotateX = useTransform(srx, (v) => `${v}deg`);
  const rotateY = useTransform(sry, (v) => `${v}deg`);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rx.set((0.5 - py) * max * 2);
    ry.set((px - 0.5) * max * 2);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn("transform-gpu", className)}
    >
      {children}
    </motion.div>
  );
}
