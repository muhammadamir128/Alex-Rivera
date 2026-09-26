"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const TECH_ITEMS = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js 15", icon: "▲" },
  { name: "TypeScript", icon: "📘" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "Node.js", icon: "🟢" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Prisma ORM", icon: "💎" },
  { name: "GSAP & ScrollTrigger", icon: "⚡" },
  { name: "Docker", icon: "🐳" },
  { name: "Redis", icon: "🔴" },
  { name: "GraphQL", icon: "◈" },
  { name: "REST APIs", icon: "🔗" },
  { name: "Git & GitHub", icon: "🐙" },
  { name: "Vercel Edge", icon: "▲" },
];

export function TechTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;

    // Duplicate list for infinite loop
    const width = el.scrollWidth / 2;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        x: -width,
        duration: 35,
        ease: "none",
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full overflow-hidden border-y border-white/5 bg-slate-950/40 dark:bg-black/30 py-3.5 backdrop-blur-md select-none">
      {/* Edge gradient masks for smooth fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

      <div
        ref={tickerRef}
        className="flex w-max items-center gap-6 whitespace-nowrap will-change-transform"
      >
        {/* Render twice for seamless continuous scroll */}
        {[...TECH_ITEMS, ...TECH_ITEMS, ...TECH_ITEMS].map((tech, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-foreground/90 shadow-sm backdrop-blur-sm transition-colors hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <span className="text-sm">{tech.icon}</span>
            <span>{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
