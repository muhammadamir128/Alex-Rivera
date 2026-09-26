"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

export function GsapScrollEffects() {
  useEffect(() => {
    // Register plugin only on client
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Text reveal animations using SplitType
      const splitElements = document.querySelectorAll(".gsap-heading-split");
      const splits: SplitType[] = [];

      splitElements.forEach((el) => {
        try {
          const split = new SplitType(el as HTMLElement, {
            types: "words,chars",
            tagName: "span",
          });
          splits.push(split);

          if (split.words && split.words.length > 0) {
            gsap.from(split.words, {
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              y: 35,
              opacity: 0,
              rotateX: -15,
              stagger: 0.03,
              duration: 0.8,
              ease: "power3.out",
            });
          }
        } catch {
          // Fallback if DOM splitting fails
        }
      });

      // 2. Experience Timeline dynamic scrub draw
      const timelineLine = document.querySelector(".timeline-scroll-draw");
      const timelineSection = document.querySelector("#experience");
      if (timelineLine && timelineSection) {
        gsap.fromTo(
          timelineLine,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timelineSection,
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.5,
            },
          }
        );
      }

      // 3. Smooth fade & subtle parallax float for hero
      const heroContent = document.querySelector("#hero-content");
      if (heroContent) {
        gsap.to(heroContent, {
          scrollTrigger: {
            trigger: heroContent,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
          opacity: 0.2,
          y: 60,
          ease: "power1.inOut",
        });
      }

      // 4. Stagger reveal on project cards
      const projectCards = document.querySelectorAll(".project-card-item");
      if (projectCards.length > 0) {
        gsap.from(projectCards, {
          scrollTrigger: {
            trigger: projectCards[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // Cleanup splits on context revert
      return () => {
        splits.forEach((s) => {
          try {
            s.revert();
          } catch {}
        });
      };
    });

    // Refresh triggers once fonts and images load
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return null;
}
