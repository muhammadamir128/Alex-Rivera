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

    lenis.on("scroll", ScrollTrigger.update);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

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
      // 1. Section scroll entrance and exit ("scroll bottom ya top par scroll kare to section bhi scroll kare normal sa")
      const sectionSelectors = ["#about", "#skills", "#experience", "#work", "#contact"];
      sectionSelectors.forEach((sel) => {
        const sec = document.querySelector(sel);
        if (!sec) return;

        // Subtle, smooth natural scroll animation that responds both when scrolling down AND up
        gsap.fromTo(
          sec,
          { y: 32, opacity: 0.88 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 88%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });

      // 2. Heading reveals with 3D perspective (animates smoothly in and resets on reverse)
      const headings = document.querySelectorAll(".gsap-heading-split");
      headings.forEach((heading) => {
        gsap.fromTo(
          heading,
          { y: 28, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
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
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return null;
}
