"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("admin@portfolio.dev");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, bounce to dashboard
  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.admin) {
          router.replace("/admin");
        }
      })
      .catch(() => {});
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      toast.success("Welcome back");
      const from = params.get("from") || "/admin";
      router.replace(from);
      router.refresh();
    } catch (err) {
      toast.error("Login failed", { description: (err as Error).message });
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070a14] text-foreground flex items-center justify-center px-4">
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px] animate-blob" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="overflow-hidden rounded-3xl glass-strong p-8 shadow-2xl shadow-black/40">
          {/* glow accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

          <div className="flex flex-col items-center text-center">
            <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-violet-600/30">
              <ShieldCheck className="h-7 w-7 text-white" />
              <span className="absolute -inset-px rounded-2xl ring-1 ring-white/20" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">
              Admin Sign-in
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access the portfolio management console.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-violet-600/50 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center text-xs text-muted-foreground">
            <span className="font-medium text-foreground/70">Demo credentials</span>
            <br />
            admin@portfolio.dev / admin12345
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected area · No public registration exists.
        </p>
      </motion.div>
    </div>
  );
}
