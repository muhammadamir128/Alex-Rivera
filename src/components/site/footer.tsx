"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";
import type { ProfileData } from "@/lib/data";

export function Footer({ profile }: { profile: ProfileData }) {
  const s = profile.socialLinks;
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-auto border-t border-white/5 bg-background/60 backdrop-blur-xl">
      {/* top gradient accent line */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 font-display text-xs font-bold text-white">
                {profile.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
              </span>
              <span className="font-display text-sm font-semibold">{profile.name}</span>
            </Link>
            <p className="mt-2 text-xs text-muted-foreground">
              © {year} {profile.name}. Built with{" "}
              <span className="gradient-text font-medium">Next.js</span>,{" "}
              <span className="gradient-text font-medium">Prisma</span> & a lot of coffee.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/skills" className="hover:text-foreground transition-colors">Skills</Link>
            <Link href="/work" className="hover:text-foreground transition-colors">Work</Link>
            <Link href="/experience" className="hover:text-foreground transition-colors">Experience</Link>
            <Link href="/testimonials" className="hover:text-foreground transition-colors">Voices</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {s.github && <Icon href={s.github} label="GitHub"><Github className="h-4 w-4" /></Icon>}
              {s.linkedin && <Icon href={s.linkedin} label="LinkedIn"><Linkedin className="h-4 w-4" /></Icon>}
              {s.twitter && <Icon href={s.twitter} label="Twitter"><Twitter className="h-4 w-4" /></Icon>}
              {s.email && <Icon href={`mailto:${s.email}`} label="Email"><Mail className="h-4 w-4" /></Icon>}
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="group grid h-9 w-9 place-items-center rounded-full glass text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Icon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
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
