"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Check, Twitter, Linkedin, Link2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * A share button that opens a small popover with social share options
 * and a copy-to-clipboard link.
 */
export function ShareButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  };

  const shareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
        aria-label="Share"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl glass-strong p-1.5 shadow-2xl shadow-black/40"
            >
              <button
                onClick={copyLink}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-white/5"
              >
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">Copy link</span>
                {copied && <Check className="h-3.5 w-3.5 text-emerald-400" />}
              </button>
              <button
                onClick={shareTwitter}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-white/5"
              >
                <Twitter className="h-4 w-4 text-muted-foreground" />
                Share on Twitter
              </button>
              <button
                onClick={shareLinkedin}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-white/5"
              >
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                Share on LinkedIn
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
