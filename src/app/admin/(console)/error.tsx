"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Admin error boundary — themed to match the console.
 * Receives `error` (the captured error) and `reset` (a function that
 * re-renders the route segment) from Next.js.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // surface unexpected runtime errors to the console for debugging
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-red-600/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-[120px]" />
      </div>

      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/20 ring-1 ring-white/10">
        <AlertTriangle className="h-7 w-7 text-amber-300" />
      </div>

      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        An unexpected error occurred while rendering this page. You can try again, or head back to
        the dashboard.
      </p>

      {error?.message && (
        <div className="mt-5 max-w-lg rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-left">
          <p className="font-mono text-[11px] text-amber-300/80">{error.message}</p>
          {error.digest && (
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">digest: {error.digest}</p>
          )}
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={reset}
          className="gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-600/25 hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
        <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
          <Link href="/admin">
            <Home className="mr-1.5 h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/admin">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Go back
          </Link>
        </Button>
      </div>
    </div>
  );
}
