"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, Grid3x3, Rows3 } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/components/site/reveal";
import type { TestimonialData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Testimonials({ items }: { items: TestimonialData[] }) {
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<"carousel" | "grid">("carousel");
  const [autoPlay, setAutoPlay] = useState(true);
  const count = items.length;
  const current = items[index];

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count]
  );

  // auto-advance carousel every 6s
  useEffect(() => {
    if (!autoPlay || view !== "carousel" || count <= 1) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [autoPlay, view, count, go]);

  if (count === 0) return null;

  return (
    <section id="testimonials" className="relative scroll-mt-24 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-violet-400">
                <span className="h-px w-8 bg-violet-400/60" />
                Kind words
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                What people I&apos;ve worked with <span className="gradient-text">say</span>.
              </h2>
            </div>
            {/* view toggle */}
            <div className="hidden items-center gap-1 rounded-full glass p-1 sm:flex">
              <button
                onClick={() => setView("carousel")}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full transition-all",
                  view === "carousel"
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Carousel view"
              >
                <Rows3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full transition-all",
                  view === "grid"
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>

        {view === "carousel" ? (
          <Reveal delay={0.1}>
            <div
              className="relative mt-12 overflow-hidden rounded-3xl glass p-8 sm:p-12"
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
            >
              <Quote className="absolute right-6 top-6 h-16 w-16 text-white/[0.04]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="mt-5 font-display text-xl font-medium leading-relaxed text-foreground/90 sm:text-2xl text-balance">
                    &ldquo;{current.message}&rdquo;
                  </blockquote>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/10">
                      {current.avatarUrl ? (
                        <Image
                          src={current.avatarUrl}
                          alt={current.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
                          {current.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{current.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {current.role} · {current.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* controls */}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === index
                          ? "w-6 bg-gradient-to-r from-blue-400 to-violet-500"
                          : "w-1.5 bg-white/15 hover:bg-white/30"
                      )}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => go(-1)}
                    aria-label="Previous"
                    className="h-9 w-9 rounded-full glass hover:bg-white/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => go(1)}
                    aria-label="Next"
                    className="h-9 w-9 rounded-full glass hover:bg-white/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        ) : (
          <RevealStagger className="mt-12 grid gap-4 sm:grid-cols-2" stagger={0.1}>
            {items.map((t) => (
              <RevealItem key={t.id}>
                <div className="group relative h-full overflow-hidden rounded-2xl glass p-6 transition-all hover:bg-white/[0.05] hover:-translate-y-0.5">
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-white/[0.06]" />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/85 line-clamp-4">
                    &ldquo;{t.message}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-2.5 border-t border-white/5 pt-4">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
                      {t.avatarUrl ? (
                        <Image
                          src={t.avatarUrl}
                          alt={t.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
                          {t.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {t.name}
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {t.role} · {t.company}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        )}
      </div>
    </section>
  );
}
