"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowUp,
  ArrowUpRight,
  Copy,
  Check,
  MapPin,
  Sparkles,
  Lock,
  Code2,
  X,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import type { ProfileData } from "@/lib/data";

export function Footer({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.trim() === "2993") {
      setIsUnlocked(true);
      setPinError("");
      setTimeout(() => {
        setPinModalOpen(false);
        router.push("/admin/login");
      }, 400);
    } else {
      setPinError("Incorrect password. Please try again.");
    }
  };

  const s = profile.socialLinks || {};
  const email = s.email || "muhammadamircs47@gmail.com";
  const year = new Date().getFullYear();

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Skills", href: "/skills" },
    { label: "Projects & Work", href: "/work" },
    { label: "Experience", href: "/experience" },
    { label: "Education", href: "/education" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ];

  const techStack = [
    "Next.js 15",
    "React 19",
    "TypeScript",
    "Prisma ORM",
    "Tailwind CSS",
    "SQLite / PostgreSQL",
    "Framer Motion",
  ];

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
    : "MA";

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-[#080c16]/95 backdrop-blur-2xl text-foreground">
      {/* Top subtle radiant glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-t from-[#080c16]/80 to-transparent"
      />
      {/* Top gradient highlight bar */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 via-violet-500/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Pre-footer Callout Banner */}
        <div className="relative mb-12 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-5 sm:p-6 shadow-xl backdrop-blur-xl">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1.5">

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Have a project or vision in mind?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Let&apos;s engineer high-performance, scalable, and delightful web products together.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:brightness-110 active:scale-95"
              >
                Start a Conversation
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-muted-foreground" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 pb-12 border-b border-white/5">
          {/* Brand & Bio (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 font-display text-sm font-bold text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                {initials}
              </span>
              <div>
                <span className="font-display text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {profile.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {profile.title || "Full-Stack Developer"}
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              {profile.tagline ||
                "Crafting performant, accessible, and delight-driven web experiences from database schema to user interaction."}
            </p>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 block mb-3">
                Connect Across Platforms
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {s.github && (
                  <SocialButton href={s.github} label="GitHub">
                    <Github className="h-4 w-4" />
                  </SocialButton>
                )}
                {s.linkedin && (
                  <SocialButton href={s.linkedin} label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </SocialButton>
                )}
                {s.twitter && (
                  <SocialButton href={s.twitter} label="Twitter / X">
                    <Twitter className="h-4 w-4" />
                  </SocialButton>
                )}
                {email && (
                  <SocialButton href={`mailto:${email}`} label="Email">
                    <Mail className="h-4 w-4" />
                  </SocialButton>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-white transition-colors group"
                  >
                    <span className="h-1 w-1 rounded-full bg-blue-500/0 group-hover:bg-blue-400 transition-all group-hover:w-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tech Architecture */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-xs text-muted-foreground hover:border-white/10 hover:text-foreground transition-colors"
                >
                  <Code2 className="h-3 w-3 text-blue-400/70" />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Column 4: Location & Status */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Status & Info
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Location</div>
                  <div className="text-xs">Pakistan (UTC+5) · Remote worldwide</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Response Rate</div>
                  <div className="text-xs">Quick response within 24 hours</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPinModalOpen(true);
                    setPin("");
                    setPinError("");
                    setIsUnlocked(false);
                  }}
                  aria-label="Admin Access"
                  title="Admin Access"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/5 bg-white/[0.02] text-muted-foreground/40 transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white active:scale-95 cursor-pointer"
                >
                  <Lock className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5 text-center sm:text-left">
            <span>© {year} {profile.name}. All rights reserved.</span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="hidden sm:inline">Built with passion & precision.</span>
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-muted-foreground hover:border-white/20 hover:text-white hover:bg-white/10 transition-all group cursor-pointer"
          >
            Back to Top
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Admin Passcode Modal */}
      <AnimatePresence>
        {pinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPinModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#090d16] p-6 shadow-2xl text-foreground"
            >
              <button
                type="button"
                onClick={() => setPinModalOpen(false)}
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 border border-white/10 text-blue-400">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">Admin Verification</h3>
                  <p className="text-xs text-muted-foreground">Enter password to proceed</p>
                </div>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <input
                    type="password"
                    autoFocus
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      if (pinError) setPinError("");
                    }}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 tracking-wider"
                  />
                  {pinError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-rose-400 font-medium"
                    >
                      {pinError}
                    </motion.p>
                  )}
                  {isUnlocked && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-emerald-400 font-medium flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" /> Password verified! Redirecting to Admin Login...
                    </motion.p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPinModalOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-violet-600/25 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    <span>Proceed</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 hover:scale-105 active:scale-95"
    >
      {children}
    </a>
  );
}
