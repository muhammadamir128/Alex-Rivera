"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
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

  const infoCards = [
    {
      href: `mailto:${s.email}`,
      icon: Mail,
      label: "Email",
      value: s.email,
      color: {
        border: "rgba(0,240,255,0.4)",
        glow: "rgba(0,240,255,0.12)",
        icon: "from-cyan-500 to-blue-600",
        text: "#67e8f9",
        shimmer: "#00f0ff",
      },
    },
    {
      href: `tel:${s.phone || "+923064609884"}`,
      icon: Phone,
      label: "Phone / WhatsApp",
      value: s.phone || "+92 306 4609884",
      color: {
        border: "rgba(59,130,246,0.4)",
        glow: "rgba(59,130,246,0.12)",
        icon: "from-blue-500 to-cyan-500",
        text: "#93c5fd",
        shimmer: "#38bdf8",
      },
    },
    {
      href: undefined,
      icon: MapPin,
      label: "Based",
      value: "Faisalabad, Punjab, Pakistan",
      color: {
        border: "rgba(14,165,233,0.4)",
        glow: "rgba(14,165,233,0.12)",
        icon: "from-sky-500 to-blue-600",
        text: "#7dd3fc",
        shimmer: "#00f0ff",
      },
    },
  ];

  return (
    <section id="contact" className="relative scroll-mt-24 py-14 sm:py-20 overflow-hidden">

      {/* Cosmic Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[#060913]">
        <div className="absolute top-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-600/8 blur-[130px]" />
        <div className="absolute bottom-0 right-1/3 h-[28rem] w-[28rem] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Animated corner circuit lines */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 w-full h-full" style={{ zIndex: 0, opacity: 0.18 }}>
        <style>{`
          @keyframes cntFlowR { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -100; } }
          @keyframes cntFlowL { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 100; } }
          .cnt-r { animation: cntFlowR 3s linear infinite; }
          .cnt-l { animation: cntFlowL 4s linear infinite; }
        `}</style>
        <line x1="0" y1="60" x2="200" y2="60" stroke="#00f0ff" strokeWidth="1" strokeDasharray="8 12" className="cnt-r" />
        <line x1="60" y1="0" x2="60" y2="160" stroke="#00f0ff" strokeWidth="1" strokeDasharray="8 12" className="cnt-r" />
        <line x1="100%" y1="60" x2="calc(100% - 200px)" y2="60" stroke="#38bdf8" strokeWidth="1" strokeDasharray="8 12" className="cnt-l" />
        <line x1="calc(100% - 60px)" y1="0" x2="calc(100% - 60px)" y2="160" stroke="#38bdf8" strokeWidth="1" strokeDasharray="8 12" className="cnt-l" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6" style={{ zIndex: 1 }}>

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
            Contact
            <span className="h-px w-8 bg-cyan-400/60" />
          </p>
          <h2 className="gsap-heading-split mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            Let&apos;s build something{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              worth shipping
            </span>.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            Have a project in mind, a role to fill, or just want to nerd out about web
            performance? Drop me a line — I read every message.
          </p>
          <div className="mt-3 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        </motion.div>

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">

          {/* Left — Info cards */}
          <div className="space-y-4">
            {infoCards.map((card, i) => {
              const Icon = card.icon;
              const Tag = card.href ? motion.a : motion.div;
              return (
                <Tag
                  key={card.label}
                  {...(card.href ? { href: card.href } : {})}
                  initial={{ opacity: 0, x: -32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-2xl p-4 cursor-pointer"
                  style={{
                    background: "rgba(6,9,19,0.75)",
                    border: `1px solid ${card.color.border}`,
                    boxShadow: `0 0 16px 2px ${card.color.glow}`,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Corner brackets */}
                  <span className="absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: card.color.border }} />
                  <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: card.color.border }} />

                  {/* Scanning shimmer */}
                  <div className="absolute top-0 left-0 right-0 h-px overflow-hidden rounded-t-2xl">
                    <motion.div
                      className="h-full w-1/3"
                      style={{ background: card.color.shimmer }}
                      animate={{ x: ["-100%", "350%"] }}
                      transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  {/* Icon */}
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${card.color.icon} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>

                  {/* Text */}
                  <div>
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">{card.label}</div>
                    <div className="mt-0.5 text-sm font-semibold text-white transition-colors duration-200 group-hover:text-opacity-90"
                      style={{ color: card.color.text }}>
                      {card.value}
                    </div>
                  </div>

                  {/* Hover inner glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at 20% 50%, ${card.color.glow}, transparent 70%)` }}
                  />
                </Tag>
              );
            })}
          </div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <form
              onSubmit={onSubmit}
              className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
              style={{
                background: "rgba(6,9,19,0.80)",
                border: "1px solid rgba(0,240,255,0.22)",
                boxShadow: "0 0 28px 4px rgba(0,240,255,0.06), inset 0 0 20px rgba(0,240,255,0.02)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Corner brackets */}
              <span className="absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2 rounded-tl-2xl border-cyan-500/50" />
              <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 rounded-br-2xl border-violet-500/50" />

              {/* Scanning top line */}
              <div className="absolute top-0 left-0 right-0 h-px overflow-hidden rounded-t-2xl">
                <motion.div
                  className="h-full w-1/4 bg-cyan-400/70"
                  animate={{ x: ["-100%", "500%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Glow blobs */}
              <div aria-hidden className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />
              <div aria-hidden className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-violet-500/8 blur-3xl pointer-events-none" />

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
                      "bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-600 transition-colors focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                      touched.name && errors.name && "border-red-400/50",
                      touched.name && !errors.name && form.name && "border-emerald-400/50"
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
                      "bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-600 transition-colors focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                      touched.email && errors.email && "border-red-400/50",
                      touched.email && !errors.email && form.email && "border-emerald-400/50"
                    )}
                  />
                </Field>
                <Field
                  label="Message"
                  htmlFor="message"
                  error={touched.message ? errors.message : ""}
                  hint={
                    <span className={cn(
                      "font-mono text-[10px]",
                      form.message.length > MAX_MSG ? "text-red-400" :
                      form.message.length > MAX_MSG * 0.9 ? "text-amber-400" : "text-slate-500"
                    )}>
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
                      "bg-slate-950/60 border-white/10 text-slate-100 resize-none placeholder:text-slate-600 transition-colors focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                      touched.message && errors.message && "border-red-400/50",
                      touched.message && !errors.message && form.message.trim().length >= MIN_MSG && "border-emerald-400/50"
                    )}
                  />
                </Field>

                {/* Honeypot */}
                <div aria-hidden className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
                  <label>
                    Website (leave empty)
                    <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                  </label>
                </div>

                <Magnetic strength={0.15}>
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="group relative overflow-hidden w-full text-white shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #06b6d4, #6366f1, #8b5cf6)",
                      boxShadow: "0 0 20px 4px rgba(99,102,241,0.35)",
                    }}
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    <AnimatePresence mode="wait" initial={false}>
                      {status === "loading" ? (
                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </motion.span>
                      ) : status === "success" ? (
                        <motion.span key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 font-medium">
                          <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }} className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/20">
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <motion.path d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }} />
                            </svg>
                          </motion.span>
                          Sent!
                        </motion.span>
                      ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 flex items-center gap-2 font-medium">
                          Send message
                          <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </Magnetic>

                <p className="text-center text-xs text-slate-600">
                  Protected by honeypot + rate limiting. No spam, ever.
                </p>
              </div>
            </form>
          </motion.div>
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
        <label htmlFor={htmlFor} className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {label}
        </label>
        {hint}
      </div>
      {children}
      {error ? (
        <motion.p
          initial={{ opacity: 0, y: -4, x: -3 }}
          animate={{ opacity: 1, y: 0, x: [-3, 3, -1, 1, 0] }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400 font-medium"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          {error}
        </motion.p>
      ) : null}
    </div>
  );
}
