"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/site/magnetic";
import { ThemeToggle } from "@/components/site/theme-toggle";

const NAV = [
  { label: "About", href: "/about", hash: "#about" },
  { label: "Skills", href: "/skills", hash: "#skills" },
  { label: "Work", href: "/work", hash: "#work" },
  { label: "Experience", href: "/experience", hash: "#experience" },
  { label: "Voices", href: "/testimonials", hash: "#testimonials" },
  { label: "Contact", href: "/contact", hash: "#contact" },
];

export function SiteHeader({ name, socials }: { name: string; socials?: Record<string, string> }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hashActive, setHashActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const ids = NAV.map((n) => n.hash.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setHashActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const isItemActive = (item: (typeof NAV)[number]) => {
    if (pathname === "/") {
      return hashActive === item.hash.slice(1);
    }
    if (item.href === "/work") {
      return pathname === "/work" || pathname.startsWith("/projects");
    }
    return pathname === item.href;
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4"
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300",
            scrolled ? "glass-strong shadow-2xl shadow-black/40" : "bg-transparent"
          )}
        >
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 font-display text-sm font-bold text-white shadow-lg shadow-blue-500/30">
              {name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
              <span className="absolute -inset-px rounded-xl ring-1 ring-white/20" />
            </span>
            <span className="hidden sm:block font-display text-sm font-semibold tracking-tight text-foreground/90">
              {name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active = isItemActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-lg bg-white/5 ring-1 ring-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Magnetic className="hidden sm:block">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition-transform hover:shadow-violet-600/40"
              >
                Let&apos;s talk
              </Link>
            </Magnetic>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden grid h-9 w-9 place-items-center rounded-lg glass text-foreground"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden mt-2 overflow-hidden"
            >
              <div className="glass-strong rounded-2xl p-2 space-y-1">
                {NAV.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-white/10 text-foreground font-semibold"
                          : "text-foreground/80 hover:bg-white/5"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
