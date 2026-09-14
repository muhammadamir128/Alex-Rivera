"use client";

import { useEffect, useState } from "react";

/**
 * A soft gradient glow that follows the cursor on hover-capable devices.
 * Hidden on touch devices via CSS (.cursor-glow-dot display:none on @media (hover: none)).
 */
export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        setVisible(true);
      });
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="cursor-glow-dot pointer-events-none fixed inset-0 z-[2] transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        background: `radial-gradient(220px circle at ${pos.x}px ${pos.y}px, rgba(139, 92, 246, 0.08), transparent 70%)`,
      }}
    />
  );
}
