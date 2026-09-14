// Generates themed SVG cover images + avatars that match the dark glassmorphism theme.
// Run: bun prisma/generate-svgs.ts
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "public", "uploads");
fs.mkdirSync(OUT, { recursive: true });

type CoverSpec = {
  name: string;
  label: string;
  c1: string;
  c2: string;
  pattern: "dashboard" | "commerce" | "chat" | "blocks" | "finance" | "docs";
};

const covers: CoverSpec[] = [
  { name: "project-aurora.svg", label: "Aurora Analytics", c1: "#3b82f6", c2: "#22d3ee", pattern: "dashboard" },
  { name: "project-lumen.svg", label: "Lumen Commerce", c1: "#8b5cf6", c2: "#ec4899", pattern: "commerce" },
  { name: "project-pulse.svg", label: "Pulse Chat", c1: "#06b6d4", c2: "#3b82f6", pattern: "chat" },
  { name: "project-trailhead.svg", label: "Trailhead CMS", c1: "#a78bfa", c2: "#6366f1", pattern: "blocks" },
  { name: "project-fern.svg", label: "Fern Finance", c1: "#10b981", c2: "#3b82f6", pattern: "finance" },
  { name: "project-atlas.svg", label: "Atlas Docs", c1: "#f59e0b", c2: "#8b5cf6", pattern: "docs" },
];

const avatars = [
  { name: "testimonial-sara.svg", initials: "SL", c1: "#3b82f6", c2: "#8b5cf6" },
  { name: "testimonial-marko.svg", initials: "MV", c1: "#8b5cf6", c2: "#ec4899" },
  { name: "testimonial-priya.svg", initials: "PA", c1: "#06b6d4", c2: "#3b82f6" },
  { name: "testimonial-jonas.svg", initials: "JW", c1: "#a78bfa", c2: "#6366f1" },
  { name: "avatar-real.svg", initials: "AR", c1: "#3b82f6", c2: "#8b5cf6" },
];

function cover(c: CoverSpec): string {
  const { c1, c2 } = c;
  const W = 1344, H = 768;
  let shapes = "";
  switch (c.pattern) {
    case "dashboard":
      shapes = `
        <g opacity="0.9">
          ${bars(120, 480, [40, 70, 55, 90, 65, 110, 80, 95], c1, c2)}
          <polyline points="${linePts(120, 260, 8, 30)}" fill="none" stroke="${c2}" stroke-width="3" opacity="0.85"/>
          <circle cx="1120" cy="200" r="60" fill="none" stroke="${c2}" stroke-width="2" opacity="0.4"/>
          <circle cx="1120" cy="200" r="36" fill="${c2}" opacity="0.25"/>
        </g>`;
      break;
    case "commerce":
      shapes = `
        <g opacity="0.95">
          ${card(160, 180, 360, 440, c1, c2)}
          ${card(580, 220, 360, 400, c1, c2)}
          ${card(1000, 260, 200, 240, c1, c2)}
        </g>`;
      break;
    case "chat":
      shapes = `
        <g opacity="0.95">
          ${bubble(180, 200, 520, 90, c1, 0.7, "left")}
          ${bubble(360, 320, 600, 90, c2, 0.7, "right")}
          ${bubble(180, 440, 480, 90, c1, 0.5, "left")}
          ${bubble(440, 560, 560, 90, c2, 0.7, "right")}
        </g>`;
      break;
    case "blocks":
      shapes = `
        <g opacity="0.92">
          ${block(160, 160, 180, 120, c1, c2)}
          ${block(380, 160, 380, 120, c2, c1)}
          ${block(160, 320, 300, 180, c2, c1)}
          ${block(500, 320, 260, 180, c1, c2)}
          ${block(820, 160, 380, 340, c2, c1)}
        </g>`;
      break;
    case "finance":
      shapes = `
        <g opacity="0.95">
          ${ring(680, 380, 140, c1, c2, 0.7)}
          ${bars(160, 480, [60, 40, 80, 50, 95, 70, 85], c1, c2)}
        </g>`;
      break;
    case "docs":
      shapes = `
        <g opacity="0.92">
          ${docCard(200, 160, 460, 460, c1, c2)}
          ${docCard(720, 220, 460, 360, c2, c1)}
        </g>`;
      break;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a0e1a"/>
        <stop offset="100%" stop-color="#0f1729"/>
      </linearGradient>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <radialGradient id="glow1" cx="20%" cy="20%" r="50%">
        <stop offset="0%" stop-color="${c1}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glow2" cx="85%" cy="80%" r="50%">
        <stop offset="0%" stop-color="${c2}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow1)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>
    ${shapes}
    <rect x="80" y="640" width="280" height="5" rx="2.5" fill="url(#g)"/>
    <text x="80" y="610" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="42" fill="#e7ecf5" letter-spacing="-1">${c.label}</text>
  </svg>`;
}

function bars(x: number, y: number, heights: number[], c1: string, c2: string): string {
  const bw = 36, gap = 16;
  return heights
    .map((h, i) => {
      const bx = x + i * (bw + gap);
      const grad = i % 2 === 0 ? c1 : c2;
      return `<rect x="${bx}" y="${y - h}" width="${bw}" height="${h}" rx="6" fill="${grad}" opacity="0.85"/>`;
    })
    .join("");
}

function linePts(startX: number, startY: number, count: number, step: number): string {
  const pts: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = startX + i * 60;
    const y = startY - Math.sin(i * 0.9) * step - (i * 4);
    pts.push(`${x},${y}`);
  }
  return pts.join(" ");
}

function card(x: number, y: number, w: number, h: number, c1: string, c2: string): string {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)"/>
    <rect x="${x + 24}" y="${y + 24}" width="${w - 48}" height="160" rx="12" fill="url(#g)" opacity="0.7"/>
    <rect x="${x + 24}" y="${y + 210}" width="${(w - 48) * 0.7}" height="14" rx="7" fill="rgba(255,255,255,0.5)"/>
    <rect x="${x + 24}" y="${y + 240}" width="${(w - 48) * 0.5}" height="10" rx="5" fill="rgba(255,255,255,0.2)"/>
    <rect x="${x + 24}" y="${y + h - 60}" width="90" height="32" rx="16" fill="url(#g)"/>
  </g>`;
}

function bubble(x: number, y: number, w: number, h: number, color: string, opacity: number, side: "left" | "right"): string {
  const tail = side === "left" ? `<path d="M${x} ${y} L${x - 16} ${y + 20} L${x + 16} ${y + 24} Z" fill="${color}" opacity="${opacity}"/>` : `<path d="M${x + w} ${y + h - 40} L${x + w + 16} ${y + h - 20} L${x + w - 16} ${y + h - 16} Z" fill="${color}" opacity="${opacity}"/>`;
  return `${tail}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${color}" opacity="${opacity}"/>`;
}

function block(x: number, y: number, w: number, h: number, c1: string, c2: string): string {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)"/>
    <rect x="${x + 16}" y="${y + 16}" width="40" height="40" rx="10" fill="url(#g)" opacity="0.8"/>
    <rect x="${x + 16}" y="${y + 76}" width="${w * 0.6}" height="10" rx="5" fill="rgba(255,255,255,0.4)"/>
    <rect x="${x + 16}" y="${y + 96}" width="${w * 0.4}" height="8" rx="4" fill="rgba(255,255,255,0.2)"/>
  </g>`;
}

function ring(cx: number, cy: number, r: number, c1: string, c2: string, opacity: number): string {
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="22"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#g)" stroke-width="22" stroke-linecap="round" stroke-dasharray="${r * 1.4} ${r * 5}" transform="rotate(-90 ${cx} ${cy})" opacity="${opacity}"/>
    <text x="${cx}" y="${cy + 8}" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="44" fill="#e7ecf5" text-anchor="middle">68%</text>
  </g>`;
}

function docCard(x: number, y: number, w: number, h: number, c1: string, c2: string): string {
  const lines = Array.from({ length: 6 }, (_, i) => `<rect x="${x + 24}" y="${y + 100 + i * 28}" width="${(w - 48) * (0.7 + (i % 3) * 0.1)}" height="10" rx="5" fill="rgba(255,255,255,0.18)"/>`).join("");
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)"/>
    <rect x="${x + 24}" y="${y + 28}" width="160" height="14" rx="7" fill="url(#g)" opacity="0.9"/>
    ${lines}
  </g>`;
}

function avatar(name: string, initials: string, c1: string, c2: string): string {
  const S = 400;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f1729"/>
        <stop offset="100%" stop-color="#1a0b2e"/>
      </linearGradient>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="35%" r="60%">
        <stop offset="0%" stop-color="${c1}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${S}" height="${S}" fill="url(#bg)"/>
    <rect width="${S}" height="${S}" fill="url(#glow)"/>
    <circle cx="200" cy="160" r="58" fill="url(#g)" opacity="0.95"/>
    <circle cx="200" cy="160" r="78" fill="none" stroke="url(#g)" stroke-width="2.5" opacity="0.6"/>
    <path d="M110 320 Q200 250 290 320 L290 400 L110 400 Z" fill="url(#g)" opacity="0.5"/>
    <text x="200" y="180" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="52" fill="#ffffff" text-anchor="middle">${initials}</text>
  </svg>`;
}

let n = 0;
for (const c of covers) {
  fs.writeFileSync(path.join(OUT, c.name), cover(c));
  n++;
  console.log(`✓ ${c.name}`);
}
for (const a of avatars) {
  fs.writeFileSync(path.join(OUT, a.name), avatar(a.name, a.initials, a.c1, a.c2));
  n++;
  console.log(`✓ ${a.name}`);
}
console.log(`Done. ${n} SVGs written.`);
