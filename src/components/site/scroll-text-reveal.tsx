"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollTextRevealProps {
  text: string;
  className?: string;
}

export function ScrollTextReveal({ text, className }: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 88%", "start 40%"],
  });

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <p
      ref={containerRef}
      className={cn("flex flex-wrap gap-x-1.5 gap-y-1 text-sm sm:text-base leading-relaxed", className)}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.5 / words.length);
        return (
          <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.25, 1]);
  const y = useTransform(progress, range, [4, 0]);
  const color = useTransform(
    progress,
    range,
    ["rgba(148, 163, 184, 0.45)", "rgba(241, 245, 249, 0.95)"]
  );

  return (
    <span className="relative inline-block select-text">
      <motion.span
        style={{ opacity, y, color }}
        className="inline-block transition-colors duration-100 font-normal"
      >
        {children}
      </motion.span>
    </span>
  );
}
