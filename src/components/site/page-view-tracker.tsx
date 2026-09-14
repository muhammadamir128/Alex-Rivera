"use client";

import { useEffect } from "react";

/**
 * Fires a page-view tracking event to /api/analytics/track on mount.
 * Uses sendBeacon when available for reliability during unload.
 * Failures are silently ignored.
 */
export function PageViewTracker({ path, slug }: { path: string; slug?: string }) {
  useEffect(() => {
    const body = JSON.stringify({ path, slug });
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/track", blob);
        return;
      }
    } catch {
      // fall through to fetch
    }
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [path, slug]);

  return null;
}
