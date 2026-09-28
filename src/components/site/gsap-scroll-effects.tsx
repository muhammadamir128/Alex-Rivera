"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function GsapScrollEffects() {
  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis buttery-smooth inertia scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Smooth navigation anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && (href.startsWith("/#") || href.startsWith("#"))) {
        const id = href.replace(/^\/?#/, "");
        const targetEl = document.getElementById(id);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);

    const ctx = gsap.context(() => {
      // 1. High-End Word-by-Word Split Text Animation for Headings on Scroll
      const headings = document.querySelectorAll<HTMLElement>(".gsap-heading-split");
      headings.forEach((heading) => {
        if (!heading.hasAttribute("data-gsap-split")) {
          heading.setAttribute("data-gsap-split", "true");

          const wrapText = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent || "";
              if (!text.trim()) return;
              const words = text.split(/(\s+)/);
              const frag = document.createDocumentFragment();

              words.forEach((chunk) => {
                if (!chunk) return;
                if (/^\s+$/.test(chunk)) {
                  frag.appendChild(document.createTextNode(chunk));
                } else {
                  const outer = document.createElement("span");
                  outer.className = "inline-block overflow-hidden align-top";
                  const inner = document.createElement("span");
                  inner.className = "inline-block gsap-split-word will-change-transform";
                  inner.textContent = chunk;
                  outer.appendChild(inner);
                  frag.appendChild(outer);
                }
              });
              node.parentNode?.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              Array.from(node.childNodes).forEach(wrapText);
            }
          };

          Array.from(heading.childNodes).forEach(wrapText);
        }

        const words = heading.querySelectorAll<HTMLElement>(".gsap-split-word");
        if (words.length > 0) {
          gsap.fromTo(
            words,
            {
              y: "115%",
              opacity: 0,
              rotateZ: 2,
              filter: "blur(4px)",
            },
            {
              y: "0%",
              opacity: 1,
              rotateZ: 0,
              filter: "blur(0px)",
              duration: 0.75,
              stagger: 0.035,
              ease: "power3.out",
              scrollTrigger: {
                trigger: heading,
                start: "top 88%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }
      });

      // 2. Subtle, natural section fade entrance on scroll
      const sectionSelectors = ["#about", "#skills", "#experience", "#work", "#contact"];
      sectionSelectors.forEach((sel) => {
        const sec = document.querySelector(sel);
        if (!sec) return;

        gsap.fromTo(
          sec,
          { opacity: 0.85 },
          {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 90%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });

      // 3. Hero subtle parallax float on scroll
      const heroContent = document.querySelector("#hero-content");
      if (heroContent) {
        gsap.to(heroContent, {
          scrollTrigger: {
            trigger: heroContent,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
          opacity: 0.25,
          y: 60,
          ease: "none",
        });
      }
    });

    // Refresh triggers once layout settles
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(updateLenis);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return null;
}
