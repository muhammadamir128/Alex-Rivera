"use client";

import { useEffect } from "react";

/**
 * ExtensionShield
 * Suppresses third-party browser extensions (like AI Virtual Try-On / shopping plugins)
 * from injecting floating "Try-On" buttons onto images.
 */
export function ExtensionShield() {
  useEffect(() => {
    const purgeTryOnElements = () => {
      try {
        // 1. Selector match
        const selector = `
          [class*="try-on" i],
          [class*="tryon" i],
          [class*="virtual-try" i],
          [id*="try-on" i],
          [id*="tryon" i],
          [data-tryon],
          [data-try-on],
          [data-vto]
        `;
        document.querySelectorAll(selector).forEach((el) => {
          el.remove();
        });

        // 2. Text match for extension-injected overlays
        const elements = document.querySelectorAll("button, div, span, a, p");
        elements.forEach((el) => {
          const text = el.textContent?.trim().toLowerCase();
          if (
            text &&
            (text === "try-on" ||
              text === "✦ try-on" ||
              text === "✨ try-on" ||
              text === "try on" ||
              text === "✦ try on" ||
              text.includes("try-on") ||
              text.includes("try on"))
          ) {
            // Ensure we don't accidentally remove actual portfolio text if any
            // All try-on extensions inject floating small buttons or badges
            const isOurNav = el.closest("nav") || el.closest("header") || el.closest("footer");
            if (!isOurNav) {
              el.remove();
            }
          }
        });
      } catch {
        // Silently ignore any DOM errors
      }
    };

    purgeTryOnElements();

    const observer = new MutationObserver(() => {
      purgeTryOnElements();
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    window.addEventListener("mouseover", purgeTryOnElements, { passive: true });
    window.addEventListener("scroll", purgeTryOnElements, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("mouseover", purgeTryOnElements);
      window.removeEventListener("scroll", purgeTryOnElements);
    };
  }, []);

  return null;
}
