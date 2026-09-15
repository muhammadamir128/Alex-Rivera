"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import type { ProfileData } from "@/lib/data";

export function Footer({ profile }: { profile: ProfileData }) {
  const [copied, setCopied] = useState(false);
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
        <div className="relative mb-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available for new opportunities & collaborations
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Have a project or vision in mind?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Let&apos;s engineer high-performance, scalable, and delightful web products together.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:brightness-110 active:scale-95"
              >
                Start a Conversation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 cursor-pointer"
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
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  <Lock className="h-3 w-3" />
                  Admin Console
                </Link>
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
