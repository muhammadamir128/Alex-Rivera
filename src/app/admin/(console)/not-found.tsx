import Link from "next/link";
import { Compass, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

/**
 * Themed admin 404 — dark glassmorphism, no SiteHeader/Footer.
 * The (console) layout already wraps this in AdminShell.
 */
export default function AdminNotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-[120px]" />
      </div>

      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 ring-1 ring-white/10">
        <Compass className="h-7 w-7 text-blue-300" />
      </div>

      <p className="mt-6 font-display text-[clamp(4rem,12vw,8rem)] font-bold leading-none tracking-tighter gradient-text">
        404
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Page not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        The admin page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Let&apos;s get you back to the dashboard.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-600/25 hover:opacity-90"
        >
          <Link href="/admin">
            <Home className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
          <Link href="/admin">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Go back
          </Link>
        </Button>
      </div>
    </div>
  );
}
