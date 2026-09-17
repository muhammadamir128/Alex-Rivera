"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2, Loader2, Github, Linkedin, Twitter } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { Magnetic } from "@/components/site/magnetic";
import type { ProfileData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Contact({ profile }: { profile: ProfileData }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const MAX_MSG = 5000;
  const MIN_MSG = 10;

  const errors = {
    name: form.name.trim().length < 2 ? "Please enter your name" : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? "Please enter a valid email"
      : "",
    message:
      form.message.trim().length < MIN_MSG
        ? `Message must be at least ${MIN_MSG} characters`
        : form.message.length > MAX_MSG
        ? `Message is too long (max ${MAX_MSG})`
        : "",
  };

  const isValid = !errors.name && !errors.email && !errors.message;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setTouched({ name: true, email: true, message: true });
    if (!isValid) {
      toast.error("Please fix the form errors");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message");
      }
      setStatus("success");
      setForm({ name: "", email: "", message: "", website: "" });
      setTouched({});
      toast.success("Message sent!", { description: "I'll get back to you within 24h." });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      toast.error("Could not send", {
        description: (err as Error).message,
      });
      setStatus("idle");
    }
  };

  const s = profile.socialLinks;

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          {/* Left: pitch + direct contact */}
          <div>
            <Reveal>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
                <span className="h-px w-8 bg-cyan-400/60" />
                Contact
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Let&apos;s build something <span className="gradient-text">worth shipping</span>.
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Have a project in mind, a role to fill, or just want to nerd out about web
                performance? Drop me a line — I read every message.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 space-y-3">
                {s.email && (
                  <a
                    href={`mailto:${s.email}`}
                    className="group flex items-center gap-3 rounded-2xl glass p-4 transition-colors hover:bg-white/[0.06]"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div>
                      <div className="text-sm font-medium text-foreground">{s.email}</div>
                    </div>
                  </a>
                )}
                <div className="flex items-center gap-3 rounded-2xl glass p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-foreground">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Based</div>
                    <div className="text-sm font-medium text-foreground">Faisalabad, Punjab, Pakistan</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-6 flex items-center gap-2">
                {s.github && <SocialPill href={s.github} label="GitHub"><Github className="h-4 w-4" /></SocialPill>}
                {s.linkedin && <SocialPill href={s.linkedin} label="LinkedIn"><Linkedin className="h-4 w-4" /></SocialPill>}
                {s.twitter && <SocialPill href={s.twitter} label="Twitter"><Twitter className="h-4 w-4" /></SocialPill>}
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <Reveal delay={0.15}>
            <form
              onSubmit={onSubmit}
              className="relative overflow-hidden rounded-3xl glass p-6 sm:p-8"
            >
              <div aria-hidden className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
              <div aria-hidden className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative space-y-4">
                <Field label="Your name" htmlFor="name" error={touched.name ? errors.name : ""}>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    placeholder="Ada Lovelace"
                    className={cn(
                      "bg-white/5 border-white/10 placeholder:text-muted-foreground/60 transition-colors",
                      touched.name && errors.name && "border-red-400/50 focus:border-red-400/70",
                      touched.name && !errors.name && form.name && "border-emerald-400/50 focus:border-emerald-400/70"
                    )}
                  />
                </Field>
                <Field label="Email" htmlFor="email" error={touched.email ? errors.email : ""}>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    placeholder="ada@example.com"
                    className={cn(
                      "bg-white/5 border-white/10 placeholder:text-muted-foreground/60 transition-colors",
                      touched.email && errors.email && "border-red-400/50 focus:border-red-400/70",
                      touched.email && !errors.email && form.email && "border-emerald-400/50 focus:border-emerald-400/70"
                    )}
                  />
                </Field>
                <Field
                  label="Message"
                  htmlFor="message"
                  error={touched.message ? errors.message : ""}
                  hint={
                    <span
                      className={cn(
                        "font-mono text-[10px]",
                        form.message.length > MAX_MSG
                          ? "text-red-400"
                          : form.message.length > MAX_MSG * 0.9
                          ? "text-amber-400"
                          : "text-muted-foreground"
                      )}
                    >
                      {form.message.length} / {MAX_MSG}
                    </span>
                  }
                >
                  <Textarea
                    id="message"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onBlur={() => setTouched({ ...touched, message: true })}
                    placeholder="Tell me about your project, timeline, and budget…"
                    rows={5}
                    className={cn(
                      "bg-white/5 border-white/10 resize-none placeholder:text-muted-foreground/60 transition-colors",
                      touched.message && errors.message && "border-red-400/50 focus:border-red-400/70",
                      touched.message && !errors.message && form.message.trim().length >= MIN_MSG && "border-emerald-400/50 focus:border-emerald-400/70"
                    )}
                  />
                </Field>

                {/* Honeypot — hidden from humans, visible to bots */}
                <div aria-hidden className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
                  <label>
                    Website (leave empty)
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                    />
                  </label>
                </div>

                <Magnetic strength={0.15}>
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="group w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 disabled:opacity-50"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {status === "loading" ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </motion.span>
                      ) : status === "success" ? (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <motion.span
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                            className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/20"
                          >
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <motion.path
                                d="M5 13l4 4L19 7"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                              />
                            </svg>
                          </motion.span>
                          Sent!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          Send message
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </Magnetic>

                <p className="text-center text-xs text-muted-foreground">
                  Protected by honeypot + rate limiting. No spam, ever.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={htmlFor} className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
        {hint}
      </div>
      {children}
      {error ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 flex items-center gap-1 text-xs text-red-400"
        >
          <span className="h-1 w-1 rounded-full bg-red-400" />
          {error}
        </motion.p>
      ) : null}
    </div>
  );
}

function SocialPill({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-xl glass text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground"
    >
      {children}
    </a>
  );
}
