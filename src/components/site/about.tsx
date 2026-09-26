"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Zap, Clock, Briefcase, Code2, Users, Star } from "lucide-react";
import { CountUp } from "@/components/site/count-up";
import type { ProfileData } from "@/lib/data";

const STAT_ICONS = [Briefcase, Star, Code2, Users];
const STAT_COLORS = [
  { border: "border-cyan-500/40", glow: "shadow-cyan-500/20", text: "text-cyan-300", bg: "bg-cyan-500/10", dot: "bg-cyan-400" },
  { border: "border-violet-500/40", glow: "shadow-violet-500/20", text: "text-violet-300", bg: "bg-violet-500/10", dot: "bg-violet-400" },
  { border: "border-fuchsia-500/40", glow: "shadow-fuchsia-500/20", text: "text-fuchsia-300", bg: "bg-fuchsia-500/10", dot: "bg-fuchsia-400" },
  { border: "border-blue-500/40", glow: "shadow-blue-500/20", text: "text-blue-300", bg: "bg-blue-500/10", dot: "bg-blue-400" },
];

export function About({ profile }: { profile: ProfileData }) {
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    { label: "Years Experience", value: profile.stats.yearsExperience ?? 3, suffix: "" },
    { label: "Projects Delivered", value: profile.stats.projectsDelivered ?? 0, suffix: "" },
    { label: "Technologies", value: profile.stats.technologies ?? 0, suffix: "+" },
    { label: "Happy Clients", value: profile.stats.clients ?? 0, suffix: "" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative scroll-mt-24 py-14 sm:py-20 overflow-hidden"
    >
      {/* Cosmic Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[#060913]">
        <div className="absolute top-0 left-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-[28rem] w-[28rem] rounded-full bg-violet-600/12 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Animated corner circuit lines */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 w-full h-full" style={{ zIndex: 0, opacity: 0.22 }}>
        <style>{`
          @keyframes abtFlowR { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -120; } }
          @keyframes abtFlowL { from { stroke-dashoffset: 0; } to { stroke-dashoffset:  120; } }
          .abt-r { animation: abtFlowR 3s linear infinite; }
          .abt-l { animation: abtFlowL 4s linear infinite; }
        `}</style>
        <line x1="0" y1="60" x2="220" y2="60" stroke="#00f0ff" strokeWidth="1" strokeDasharray="8 12" className="abt-r" />
        <line x1="60" y1="0" x2="60" y2="180" stroke="#00f0ff" strokeWidth="1" strokeDasharray="8 12" className="abt-r" />
        <line x1="0" y1="calc(100% - 60px)" x2="160" y2="calc(100% - 60px)" stroke="#c084fc" strokeWidth="1" strokeDasharray="6 10" className="abt-r" />
        <line x1="100%" y1="60" x2="calc(100% - 220px)" y2="60" stroke="#c084fc" strokeWidth="1" strokeDasharray="8 12" className="abt-l" />
        <line x1="calc(100% - 60px)" y1="0" x2="calc(100% - 60px)" y2="180" stroke="#c084fc" strokeWidth="1" strokeDasharray="8 12" className="abt-l" />
        <line x1="100%" y1="calc(100% - 60px)" x2="calc(100% - 160px)" y2="calc(100% - 60px)" stroke="#00f0ff" strokeWidth="1" strokeDasharray="6 10" className="abt-l" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6" style={{ zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
        >
          <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            <span className="h-px w-8 bg-cyan-400/60" />
            Professional Profile
            <span className="h-px w-8 bg-cyan-400/60" />
          </p>
          <h2 className="gsap-heading-split mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            MY{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              PROFESSIONAL
            </span>{" "}
            PROFILE
          </h2>
          <div className="mt-3 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        </motion.div>

        {/* 3-Column grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr_0.9fr] lg:items-start">

          {/* Col 1 — Stats + Meta */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => {
                const Icon = STAT_ICONS[i];
                const c = STAT_COLORS[i];
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`relative group overflow-hidden rounded-2xl border ${c.border} bg-slate-950/60 backdrop-blur-xl p-4 shadow-xl cursor-default`}
                  >
                    {/* Hover ambient glow */}
                    <div className={`pointer-events-none absolute -inset-0.5 rounded-2xl ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10`} />
                    {/* Scanning top border */}
                    <div className="absolute top-0 left-0 right-0 h-px overflow-hidden rounded-t-2xl">
                      <motion.div
                        className={`h-full ${c.bg} w-1/2`}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2.4 + i * 0.4, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                      />
                    </div>

                    <div className="flex items-start justify-between">
                      <div className={`grid h-8 w-8 place-items-center rounded-xl ${c.bg} border ${c.border}`}>
                        <Icon className={`h-4 w-4 ${c.text}`} />
                      </div>
                      <span className="relative flex h-2 w-2 mt-1">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-70`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${c.dot}`} />
                      </span>
                    </div>

                    <div className={`mt-3 font-display text-3xl font-extrabold tracking-tight ${c.text} tabular-nums`}>
                      <CountUp value={Number(stat.value) || 0} />
                      <span>{stat.suffix}</span>
                    </div>
                    <div className="mt-0.5 text-[10px] font-mono font-medium uppercase tracking-wider text-slate-400">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Meta badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="rounded-2xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-4 space-y-2.5"
            >
              {[
                { icon: MapPin, label: "Faisalabad, Pakistan", dot: "bg-emerald-400", col: "text-emerald-400" },
                { icon: Zap, label: "Open to freelance", dot: "bg-blue-400", col: "text-blue-400" },
                { icon: Clock, label: "Replies within 24h", dot: "bg-violet-400", col: "text-violet-400" },
              ].map(({ icon: Icon, label, dot, col }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dot} opacity-75`} />
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dot}`} />
                  </span>
                  <Icon className={`h-3.5 w-3.5 ${col} flex-shrink-0`} />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Col 2 — Bio Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between min-h-[280px]"
          >
            {/* Corner brackets */}
            <span className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-cyan-500/60 rounded-tl-2xl" />
            <span className="absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-violet-500/60 rounded-tr-2xl" />
            <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-violet-500/60 rounded-bl-2xl" />
            <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-cyan-500/60 rounded-br-2xl" />

            {/* Animated scanning line */}
            <motion.div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none"
              animate={{ top: ["10%", "90%", "10%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                A developer who sweats the{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  small details...
                </span>
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300/85">{profile.bio}</p>
            </div>

            {/* Tech badges */}
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              {["React.js", "Node.js", "PostgreSQL", "TypeScript"].map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.07 }}
                  className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-mono font-medium text-cyan-300"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Col 3 — Portrait */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="group relative overflow-hidden rounded-2xl shadow-2xl shadow-violet-500/20 cursor-default"
              style={{
                background: "radial-gradient(ellipse at 50% 30%, #3b1f6e 0%, #1a0f3e 40%, #080415 100%)",
                border: "1.5px solid rgba(139,92,246,0.55)",
              }}
            >
              {/* Animated neon border glow */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(0,240,255,0.12) 0%, rgba(139,92,246,0.22) 50%, rgba(0,240,255,0.08) 100%)",
                  boxShadow: "0 0 32px 4px rgba(139,92,246,0.25), inset 0 0 24px 2px rgba(0,240,255,0.06)",
                }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Top star / grid decoration */}
              <div className="absolute top-4 left-4 right-4 flex justify-between opacity-30 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
                ))}
              </div>

              {/* Circular portrait frame */}
              <div className="relative flex flex-col items-center px-6 pt-8 pb-4">
                {/* Rotating outer glow ring */}
                <div className="relative">
                  <motion.div
                    className="absolute -inset-3 rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg, #00f0ff, #8b5cf6, #c084fc, #00f0ff)",
                      padding: "2px",
                      borderRadius: "50%",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Blurred glow behind circle */}
                  <div
                    className="absolute -inset-3 rounded-full blur-lg opacity-50"
                    style={{ background: "conic-gradient(from 0deg, #00f0ff44, #8b5cf644, #c084fc44, #00f0ff44)" }}
                  />

                  {/* Static violet ring */}
                  <div
                    className="relative rounded-full overflow-hidden"
                    style={{
                      width: "310px",
                      height: "310px",
                      border: "2.5px solid rgba(139,92,246,0.7)",
                      boxShadow: "0 0 28px 6px rgba(139,92,246,0.45), inset 0 0 20px rgba(0,240,255,0.08)",
                    }}
                  >
                    {/* Inner gradient bg */}
                    <div
                      className="absolute inset-0"
                      style={{ background: "radial-gradient(circle at 50% 35%, #2d1260 0%, #0d0620 100%)" }}
                    />
                    {/* Portrait image */}
                    <div
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                      role="img"
                      aria-label={profile.name}
                      style={{
                        backgroundImage: `url("/uploads/about-portrait-transparent.png")`,
                        backgroundSize: "105%",
                        backgroundPosition: "center 30%",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  </div>
                </div>

                {/* Name below circle */}
                <div className="mt-5 text-center">
                  <p className="font-display text-lg font-bold text-white tracking-tight">{profile.name}</p>
                  <p className="mt-0.5 text-[12px] font-mono text-violet-300/80">{profile.title || "Full-Stack Developer"}</p>
                </div>

                {/* Available badge */}
                <div className="mt-3 mb-1 flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-widest">Available for work</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
