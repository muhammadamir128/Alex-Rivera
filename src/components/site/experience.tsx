"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, Zap } from "lucide-react";
import type { ExperienceData } from "@/lib/data";

function formatRange(start: string, end: string | null, current: boolean): string {
  const fmt = (s: string) => {
    if (!s) return "";
    const [y, m] = s.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mi = Math.max(0, Math.min(11, parseInt(m || "1", 10) - 1));
    return `${months[mi]} ${y}`;
  };
  return `${fmt(start)} — ${current ? "Present" : end ? fmt(end) : "Present"}`;
}

function calcDuration(start: string, end: string | null, current: boolean): string {
  if (!start) return "";
  const [sy, sm] = start.split("-").map(Number);
  let ey: number, em: number;
  if (current || !end) {
    const now = new Date();
    ey = now.getFullYear();
    em = now.getMonth() + 1;
  } else {
    [ey, em] = end.split("-").map(Number);
  }
  const totalMonths = (ey - sy) * 12 + (em - sm);
  if (totalMonths < 0) return "";
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}y`;
  return `${years}y ${months}mo`;
}

export function Experience({ items }: { items: ExperienceData[] }) {
  return (
    <section id="experience" className="relative scroll-mt-24 py-14 sm:py-20 overflow-hidden">

      {/* Cosmic Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[#060913]">
        <div className="absolute top-1/4 left-1/3 h-[32rem] w-[32rem] rounded-full bg-cyan-600/8 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[32rem] w-[32rem] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Animated flowing timeline SVG */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 w-full h-full" style={{ zIndex: 0, opacity: 0.15 }}>
        <style>{`
          @keyframes expFlowR { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -100; } }
          @keyframes expFlowL { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 100; } }
          .exp-r { animation: expFlowR 3s linear infinite; }
          .exp-l { animation: expFlowL 4s linear infinite; }
        `}</style>
        <line x1="0" y1="80" x2="180" y2="80" stroke="#00f0ff" strokeWidth="1" strokeDasharray="8 12" className="exp-r" />
        <line x1="60" y1="0" x2="60" y2="160" stroke="#00f0ff" strokeWidth="1" strokeDasharray="8 12" className="exp-r" />
        <line x1="100%" y1="80" x2="calc(100% - 180px)" y2="80" stroke="#c084fc" strokeWidth="1" strokeDasharray="8 12" className="exp-l" />
        <line x1="calc(100% - 60px)" y1="0" x2="calc(100% - 60px)" y2="160" stroke="#c084fc" strokeWidth="1" strokeDasharray="8 12" className="exp-l" />
      </svg>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6" style={{ zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            <span className="h-px w-8 bg-cyan-400/60" />
            Experience
            <span className="h-px w-8 bg-cyan-400/60" />
          </p>
          <h2 className="gsap-heading-split mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            Three years,{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              one trajectory
            </span>.
          </h2>
          <div className="mt-3 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">

          {/* ══ MULTI-LAYER GLOWING TIMELINE ══ */}

          {/* Layer 1 — Wide outer glow (blurred) */}
          <div
            aria-hidden
            className="absolute left-[18px] sm:left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none"
            style={{ width: "20px", filter: "blur(8px)", background: "linear-gradient(to bottom, rgba(0,240,255,0.18), rgba(139,92,246,0.22), rgba(192,132,252,0.15))", zIndex: 0 }}
          />

          {/* Layer 2 — Medium glow */}
          <div
            aria-hidden
            className="absolute left-[18px] sm:left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none"
            style={{ width: "6px", filter: "blur(3px)", background: "linear-gradient(to bottom, rgba(0,240,255,0.5), rgba(139,92,246,0.6), rgba(192,132,252,0.4))", zIndex: 1 }}
          />

          {/* Layer 3 — Track base */}
          <div
            aria-hidden
            className="absolute left-[18px] sm:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "rgba(139,92,246,0.25)", zIndex: 2 }}
          />

          {/* Layer 4 — Animated CSS flowing lines (SVG) */}
          <svg
            aria-hidden
            className="absolute left-[18px] sm:left-1/2 top-0 h-full -translate-x-1/2 overflow-visible"
            style={{ width: "30px", marginLeft: "-15px", zIndex: 3 }}
          >
            <style>{`
              @keyframes tlFlowA { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -80; } }
              @keyframes tlFlowB { from { stroke-dashoffset: -40; } to { stroke-dashoffset: -120; } }
              @keyframes tlFlowC { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -200; } }
              .tl-a { animation: tlFlowA 1.8s linear infinite; }
              .tl-b { animation: tlFlowB 2.4s linear infinite; }
              .tl-c { animation: tlFlowC 1.2s linear infinite; }
            `}</style>
            <defs>
              <linearGradient id="tlGradA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="1" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            {/* Cyan flowing dash */}
            <line x1="15" y1="0" x2="15" y2="100%"
              stroke="#00f0ff" strokeWidth="2" strokeDasharray="20 50" strokeOpacity="0.9"
              className="tl-a"
            />
            {/* Violet flowing dash (offset) */}
            <line x1="15" y1="0" x2="15" y2="100%"
              stroke="#c084fc" strokeWidth="2" strokeDasharray="14 70" strokeOpacity="0.75"
              className="tl-b"
            />
            {/* White flash packet */}
            <line x1="15" y1="0" x2="15" y2="100%"
              stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 180" strokeOpacity="0.95"
              className="tl-c"
            />
          </svg>

          {/* Layer 5 — Floating orb particles */}
          {[0, 1, 2, 3].map((k) => (
            <motion.div
              key={k}
              aria-hidden
              className="absolute left-[18px] sm:left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
              style={{
                width: k % 2 === 0 ? "6px" : "4px",
                height: k % 2 === 0 ? "6px" : "4px",
                background: k % 2 === 0 ? "#00f0ff" : "#c084fc",
                boxShadow: k % 2 === 0 ? "0 0 8px 3px rgba(0,240,255,0.7)" : "0 0 8px 3px rgba(192,132,252,0.7)",
                zIndex: 5,
                top: `${15 + k * 22}%`,
              }}
              animate={{ top: [`${5 + k * 20}%`, `${85 + k * 4}%`] }}
              transition={{
                duration: 3.5 + k * 0.8,
                repeat: Infinity,
                ease: "linear",
                delay: k * 0.9,
              }}
            />
          ))}

          <div className="space-y-10 sm:space-y-16">
            {items.map((exp, i) => {
              const isLeft = i % 2 === 0;
              const isCurrent = exp.current;
              const dur = calcDuration(exp.startDate, exp.endDate, exp.current);

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 16 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative grid sm:grid-cols-2 gap-y-4"
                >
                  {/* Timeline node dot */}
                  <div className="absolute left-[10px] sm:left-1/2 top-4 z-10 -translate-x-1/2">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.1 + 0.15 }}
                      className="relative h-5 w-5 grid place-items-center"
                    >
                      <span
                        className="absolute h-5 w-5 rounded-full animate-ping"
                        style={{ background: isCurrent ? "rgba(0,240,255,0.35)" : "rgba(139,92,246,0.35)" }}
                      />
                      <span
                        className="relative h-3.5 w-3.5 rounded-full shadow-lg"
                        style={{
                          background: isCurrent
                            ? "linear-gradient(135deg,#00f0ff,#38bdf8)"
                            : "linear-gradient(135deg,#8b5cf6,#c084fc)",
                          boxShadow: isCurrent
                            ? "0 0 12px 3px rgba(0,240,255,0.5)"
                            : "0 0 12px 3px rgba(139,92,246,0.5)",
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Card */}
                  <div
                    className={`pl-10 sm:pl-0 ${
                      isLeft ? "sm:col-start-1 sm:pr-10" : "sm:col-start-2 sm:pl-10"
                    }`}
                  >
                    <motion.div
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="group relative overflow-hidden rounded-2xl backdrop-blur-xl p-5 sm:p-6 shadow-2xl transition-all duration-300"
                      style={{
                        background: "rgba(8,9,19,0.7)",
                        border: isCurrent
                          ? "1px solid rgba(0,240,255,0.35)"
                          : "1px solid rgba(139,92,246,0.30)",
                        boxShadow: isCurrent
                          ? "0 0 24px 2px rgba(0,240,255,0.08), inset 0 0 16px rgba(0,240,255,0.03)"
                          : "0 0 24px 2px rgba(139,92,246,0.08), inset 0 0 16px rgba(139,92,246,0.03)",
                      }}
                    >
                      {/* Corner accents */}
                      <span
                        className="absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2 rounded-tl-2xl"
                        style={{ borderColor: isCurrent ? "rgba(0,240,255,0.5)" : "rgba(139,92,246,0.5)" }}
                      />
                      <span
                        className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 rounded-br-2xl"
                        style={{ borderColor: isCurrent ? "rgba(0,240,255,0.5)" : "rgba(139,92,246,0.5)" }}
                      />

                      {/* Hover glow */}
                      <div
                        className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"
                        style={{
                          background: isCurrent
                            ? "rgba(0,240,255,0.06)"
                            : "rgba(139,92,246,0.06)",
                        }}
                      />

                      {/* Scanning top border animation */}
                      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden rounded-t-2xl">
                        <motion.div
                          className="h-full w-1/3"
                          style={{ background: isCurrent ? "rgba(0,240,255,0.7)" : "rgba(139,92,246,0.7)" }}
                          animate={{ x: ["-100%", "350%"] }}
                          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "linear" }}
                        />
                      </div>

                      {/* Header row */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div
                              className="grid h-7 w-7 place-items-center rounded-lg"
                              style={{
                                background: isCurrent ? "rgba(0,240,255,0.12)" : "rgba(139,92,246,0.12)",
                                border: isCurrent ? "1px solid rgba(0,240,255,0.3)" : "1px solid rgba(139,92,246,0.3)",
                              }}
                            >
                              <Briefcase
                                className="h-3.5 w-3.5"
                                style={{ color: isCurrent ? "#00f0ff" : "#c084fc" }}
                              />
                            </div>
                            <h3 className="font-display text-base sm:text-lg font-bold text-white leading-tight">
                              {exp.role}
                            </h3>
                          </div>
                          <p
                            className="mt-1 text-sm font-semibold"
                            style={{ color: isCurrent ? "#67e8f9" : "#c084fc" }}
                          >
                            {exp.company}
                            {exp.location && (
                              <span className="ml-2 inline-flex items-center gap-1 text-xs text-slate-400 font-normal">
                                <MapPin className="h-3 w-3" />
                                {exp.location}
                              </span>
                            )}
                          </p>
                        </div>

                        {isCurrent && (
                          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                            </span>
                            Current
                          </span>
                        )}
                      </div>

                      {/* Date row */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatRange(exp.startDate, exp.endDate, exp.current)}
                        </span>
                        {dur && (
                          <span
                            className="rounded-full px-2 py-0.5 font-mono text-[10px] font-medium"
                            style={{
                              background: isCurrent ? "rgba(0,240,255,0.08)" : "rgba(139,92,246,0.08)",
                              color: isCurrent ? "#67e8f9" : "#c084fc",
                              border: isCurrent ? "1px solid rgba(0,240,255,0.2)" : "1px solid rgba(139,92,246,0.2)",
                            }}
                          >
                            {dur}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="mt-4 text-sm leading-relaxed text-slate-300/85">
                        {exp.description}
                      </p>

                      {/* Tech badges */}
                      {exp.techUsed.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {exp.techUsed.map((t, ti) => (
                            <motion.span
                              key={t}
                              initial={{ opacity: 0, scale: 0.85 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.25, delay: ti * 0.04 }}
                              className="rounded-md px-2 py-0.5 text-[11px] font-mono font-medium"
                              style={{
                                background: isCurrent ? "rgba(0,240,255,0.08)" : "rgba(139,92,246,0.08)",
                                color: isCurrent ? "#a5f3fc" : "#e9d5ff",
                                border: isCurrent ? "1px solid rgba(0,240,255,0.2)" : "1px solid rgba(139,92,246,0.2)",
                              }}
                            >
                              {t}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
