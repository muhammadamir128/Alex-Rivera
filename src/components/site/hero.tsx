"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Twitter, Mail, Sparkles } from "lucide-react";
import type { ProfileData } from "@/lib/data";
import { Magnetic } from "@/components/site/magnetic";

export function Hero({ profile }: { profile: ProfileData }) {
  const s = profile.socialLinks;
  const { scrollY } = useScroll();
  // parallax: portrait drifts up + fades slightly as you scroll
  const portraitY = useTransform(scrollY, [0, 600], [0, -60]);
  const portraitOpacity = useTransform(scrollY, [0, 500], [1, 0.7]);
  const blobY = useTransform(scrollY, [0, 800], [0, 120]);
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center pt-28 pb-16 overflow-hidden"
    >
      {/* animated gradient blobs */}
      <motion.div aria-hidden style={{ y: blobY }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/4 h-[40rem] w-[40rem] rounded-full bg-blue-600/20 blur-[120px] animate-blob" />
        <div className="absolute top-40 right-0 h-[34rem] w-[34rem] rounded-full bg-violet-600/20 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-[120px] animate-blob animation-delay-4000" />
      </motion.div>

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        {/* Left: text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-foreground/80"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for select projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[1.02] tracking-tight text-balance"
          >
            <span className="block text-foreground">{profile.name.split(" ")[0]}</span>
            <span className="block gradient-text animate-gradient-pan">
              {profile.name.split(" ").slice(1).join(" ")}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-3 flex items-center gap-2 font-display text-lg font-medium text-foreground/90"
          >
            <span>{profile.title}</span>
            <RoleRotator
              roles={["Full-Stack Developer", "React Specialist", "API Architect", "UI Crafter"]}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg text-balance"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic strength={0.2}>
              <Link
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-violet-600/50"
              >
                View work
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/[0.08]"
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </motion.div>

          {/* socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 flex items-center gap-4"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Follow
            </span>
            <div className="h-px w-12 bg-gradient-to-r from-white/25 to-white/5" />
            <div className="flex items-center gap-1">
              {s.github && <Social href={s.github} label="GitHub"><Github className="h-4 w-4" /></Social>}
              {s.linkedin && <Social href={s.linkedin} label="LinkedIn"><Linkedin className="h-4 w-4" /></Social>}
              {s.twitter && <Social href={s.twitter} label="Twitter"><Twitter className="h-4 w-4" /></Social>}
              {s.email && <Social href={`mailto:${s.email}`} label="Email"><Mail className="h-4 w-4" /></Social>}
            </div>
          </motion.div>
        </div>

        {/* Right: portrait card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: portraitY, opacity: portraitOpacity }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl glass neon-border neon-glow">
            {profile.avatarUrl ? (
               
              <img
                src={profile.avatarUrl}
                alt={`Portrait of ${profile.name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-600/30 to-violet-600/30">
                <Sparkles className="h-12 w-12 text-white/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="font-display text-sm font-semibold text-white">{profile.name}</p>
                <p className="text-xs text-white/70">{profile.title}</p>
              </div>
              <div className="rounded-full glass-strong px-2.5 py-1 text-[10px] font-medium text-white/80">
                {profile.stats.yearsExperience ?? 3} yrs
              </div>
            </div>
          </div>

          {/* floating stat chips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="absolute -right-3 top-12 hidden sm:block animate-float-slow"
          >
            <div className="glass-strong rounded-2xl px-3 py-2 text-center shadow-xl">
              <div className="font-display text-xl font-bold gradient-text">
                {profile.stats.projectsDelivered ?? 0}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                shipped
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="absolute -left-4 bottom-24 hidden sm:block animate-float-slow [animation-delay:1.5s]"
          >
            <div className="glass-strong rounded-2xl px-3 py-2 text-center shadow-xl">
              <div className="font-display text-xl font-bold gradient-text">
                {profile.stats.technologies ?? 0}+
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                stack
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
    >
      {children}
    </a>
  );
}

/** Cycles through role labels with a smooth vertical slide animation. */
function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (roles.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, 2800);
    return () => clearInterval(t);
  }, [roles.length]);

  return (
    <span className="relative inline-flex h-7 items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-text font-semibold"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
