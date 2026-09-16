"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Twitter, Mail, Sparkles, Download } from "lucide-react";
import type { ProfileData } from "@/lib/data";
import { Magnetic } from "@/components/site/magnetic";

export function Hero({ profile }: { profile: ProfileData }) {
  const s = profile.socialLinks;
  const { scrollY } = useScroll();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop, { passive: true });
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // parallax: applied on desktop side-by-side layout
  const rawPortraitY = useTransform(scrollY, [0, 600], [0, -50]);
  const rawPortraitOpacity = useTransform(scrollY, [0, 500], [1, 0.8]);
  const blobY = useTransform(scrollY, [0, 800], [0, 100]);

  const portraitY = isDesktop ? rawPortraitY : 0;
  const portraitOpacity = isDesktop ? rawPortraitOpacity : 1;

  const firstName = profile.name.split(" ")[0] || profile.name;
  const lastName = profile.name.split(" ").slice(1).join(" ");

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center pt-24 sm:pt-28 lg:pt-24 xl:pt-28 pb-12 sm:pb-16 lg:pb-14 overflow-hidden"
    >
      {/* animated gradient blobs with strict overflow containment */}
      <motion.div aria-hidden style={{ y: blobY }} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/4 h-[24rem] w-[24rem] sm:h-[32rem] sm:w-[32rem] lg:h-[40rem] lg:w-[40rem] rounded-full bg-blue-600/20 blur-[100px] lg:blur-[120px] animate-blob" />
        <div className="absolute top-40 right-0 h-[22rem] w-[22rem] sm:h-[28rem] sm:w-[28rem] lg:h-[34rem] lg:w-[34rem] rounded-full bg-violet-600/20 blur-[100px] lg:blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 h-[18rem] w-[18rem] sm:h-[24rem] sm:w-[24rem] lg:h-[28rem] lg:w-[28rem] rounded-full bg-cyan-500/10 blur-[90px] lg:blur-[120px] animate-blob animation-delay-4000" />
      </motion.div>

      <div className="mx-auto grid w-full max-w-6xl gap-8 sm:gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-10 xl:gap-14 px-4 sm:px-6">
        {/* Left: text */}
        <div className="flex flex-col items-start text-left">


          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-4 sm:mt-6 font-display text-[clamp(2.15rem,5.5vw+0.5rem,4.75rem)] font-bold leading-[1.05] tracking-tight text-balance"
          >
            <span className="block text-foreground">{firstName}</span>
            {lastName && (
              <span className="block gradient-text animate-gradient-pan">
                {lastName}
              </span>
            )}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-display text-base sm:text-lg font-medium text-foreground/90"
          >
            <span className="text-foreground">{profile.title}</span>
            <span className="text-muted-foreground/40 hidden sm:inline">•</span>
            <RoleRotator
              roles={["React Specialist", "Next.js & TypeScript", "API Architect", "UI/UX Craftsman"]}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-4 sm:mt-5 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground text-balance"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic strength={0.2}>
              <Link
                href="#work"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View work</span>
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full glass px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/[0.08] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href={s.cv || s.resume || "/cv.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center justify-center gap-2 rounded-full glass px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/[0.08] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="h-4 w-4 text-blue-400" />
                <span>Download CV</span>
              </a>
            </Magnetic>
          </motion.div>

          {/* socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Follow
            </span>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-white/25 to-white/5" />
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
          className="relative mx-auto w-full max-w-[290px] xs:max-w-[320px] sm:max-w-[340px] lg:max-w-[330px] xl:max-w-[360px]"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl glass neon-border neon-glow">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={`Portrait of ${profile.name}`}
                className="h-full w-full object-cover transition-transform duration-300"
                style={{
                  objectPosition: `${profile.stats?.avatarPosX ?? 50}% ${profile.stats?.avatarPosY ?? 15}%`,
                  transform: profile.stats?.avatarZoom && Number(profile.stats.avatarZoom) !== 100 ? `scale(${Number(profile.stats.avatarZoom) / 100})`
                    : undefined,
                }}
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-600/30 to-violet-600/30">
                <Sparkles className="h-12 w-12 text-white/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-end justify-between">
              <div>
                <p className="font-display text-sm sm:text-base font-semibold text-white">{profile.name}</p>
                <p className="text-xs text-white/70">{profile.title}</p>
              </div>
              <div className="rounded-full glass-strong px-2.5 py-1 text-[10px] font-medium text-white/90">
                {profile.stats.yearsExperience ?? 3} yrs
              </div>
            </div>
          </div>

          {/* floating stat chips for sm+ screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="absolute -right-2 sm:-right-4 top-8 sm:top-10 hidden sm:block animate-float-slow pointer-events-none"
          >
            <div className="glass-strong rounded-2xl px-3 py-2 text-center shadow-xl border border-white/10">
              <div className="font-display text-lg sm:text-xl font-bold gradient-text">
                {profile.stats.projectsDelivered ?? 24}
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                shipped
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="absolute -left-2 sm:-left-4 bottom-20 sm:bottom-24 hidden sm:block animate-float-slow [animation-delay:1.5s] pointer-events-none"
          >
            <div className="glass-strong rounded-2xl px-3 py-2 text-center shadow-xl border border-white/10">
              <div className="font-display text-lg sm:text-xl font-bold gradient-text">
                {profile.stats.technologies ?? 18}+
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                stack
              </div>
            </div>
          </motion.div>

          {/* Mobile compact stat pills (under the card on small mobile) */}
          <div className="mt-3 flex sm:hidden items-center justify-center gap-2">
            <div className="glass-strong rounded-xl px-3 py-1.5 text-center flex-1">
              <div className="font-display text-sm font-bold gradient-text">
                {profile.stats.projectsDelivered ?? 24}
              </div>
              <div className="text-[8px] uppercase tracking-wider text-muted-foreground">
                shipped
              </div>
            </div>
            <div className="glass-strong rounded-xl px-3 py-1.5 text-center flex-1">
              <div className="font-display text-sm font-bold gradient-text">
                {profile.stats.technologies ?? 18}+
              </div>
              <div className="text-[8px] uppercase tracking-wider text-muted-foreground">
                stack
              </div>
            </div>
            <div className="glass-strong rounded-xl px-3 py-1.5 text-center flex-1">
              <div className="font-display text-sm font-bold gradient-text">
                {profile.stats.yearsExperience ?? 3} yrs
              </div>
              <div className="text-[8px] uppercase tracking-wider text-muted-foreground">
                experience
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* scroll cue - hidden on small/laptop viewports to prevent collision */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-3 xl:bottom-6 left-1/2 -translate-x-1/2 hidden xl:flex flex-col items-center gap-2 text-muted-foreground pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="relative h-8 xl:h-10 w-px overflow-hidden bg-white/10">
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
