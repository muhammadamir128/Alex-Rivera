import React from "react";

export interface TechMeta {
  brandColor: string;
  glowColor: string;
  categoryTag: string;
  focusArea: string;
  icon: (className?: string) => React.ReactNode;
}

export const TECH_REGISTRY: Record<string, TechMeta> = {
  typescript: {
    brandColor: "#3178C6",
    glowColor: "rgba(49, 120, 198, 0.35)",
    categoryTag: "Type System",
    focusArea: "Generics & Contracts",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path
          d="M12.98 15.68a3.14 3.14 0 0 0 1.25.96 4.14 4.14 0 0 0 1.63.31 3.2 3.2 0 0 0 1.95-.53 1.72 1.72 0 0 0 .73-1.46c0-.4-.1-.74-.3-1.01a3.02 3.02 0 0 0-.82-.77 9.8 9.8 0 0 0-1.4-.68 7.8 7.8 0 0 1-1.85-1 3.25 3.25 0 0 1-.95-1.28 4.2 4.2 0 0 1-.3-1.68c0-.73.18-1.39.54-1.98a4.13 4.13 0 0 1 1.53-1.46A4.97 4.97 0 0 1 17.5 6a4.8 4.8 0 0 1 2.27.53 4.7 4.7 0 0 1 1.6 1.43l-1.93 1.56a2.6 2.6 0 0 0-1.9-1.22c-.68 0-1.2.14-1.54.42-.34.28-.5.67-.5 1.15 0 .36.1.66.3.9.2.23.5.45.92.65.41.2.93.42 1.55.68.83.35 1.5.75 2.02 1.2.52.44.9 1 1.14 1.63.24.64.36 1.38.36 2.22 0 .8-.2 1.52-.61 2.16a4.2 4.2 0 0 1-1.74 1.54 6.2 6.2 0 0 1-2.73.57 6.13 6.13 0 0 1-2.9-.68 4.8 4.8 0 0 1-1.95-1.93l2.08-1.56zM9.54 8.44H6.27V18H3.77V8.44H.5V6.2h9.04v2.24z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
  react: {
    brandColor: "#61DAFB",
    glowColor: "rgba(97, 218, 251, 0.35)",
    categoryTag: "Core UI",
    focusArea: "Hooks & Component Architecture",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} aria-hidden="true">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  "next.js": {
    brandColor: "#ffffff",
    glowColor: "rgba(255, 255, 255, 0.25)",
    categoryTag: "Full-Stack Framework",
    focusArea: "App Router & SSR / RSC",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
        <path d="M18.665 21.978C16.687 23.253 14.331 24 11.8 24 5.283 24 0 18.717 0 12.2S5.283.4 11.8.4c6.517 0 11.8 5.283 11.8 11.8 0 3.73-1.728 7.057-4.435 9.228zm-4.708-8.49L7.228 4.88H5.44v14.238h2.094v-9.52l6.817 9.877c.607-.272 1.189-.597 1.737-.968l-2.131-4.999zm1.096-7.534v7.418l1.98 2.87V5.954h-1.98z" />
      </svg>
    ),
  },
  "tailwind css": {
    brandColor: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.35)",
    categoryTag: "Styling Engine",
    focusArea: "Responsive Systems & Tokens",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#38BDF8]`} aria-hidden="true">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    ),
  },
  "framer motion": {
    brandColor: "#F01578",
    glowColor: "rgba(240, 21, 120, 0.35)",
    categoryTag: "Animation Engine",
    focusArea: "Physics & Layout Transitions",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#F01578]`} aria-hidden="true">
        <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
      </svg>
    ),
  },
  "node.js": {
    brandColor: "#5FA04E",
    glowColor: "rgba(95, 160, 78, 0.35)",
    categoryTag: "Runtime Engine",
    focusArea: "Event Loop & Streams",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#5FA04E]`} aria-hidden="true">
        <path d="M12 0L1.6 6v12L12 24l10.4-6V6L12 0zm-1.04 17.52h-2.3v-6.9h2.3v6.9zm6.08-1.8c-.37.38-.85.57-1.44.57-.42 0-.8-.11-1.12-.33-.33-.22-.57-.52-.73-.9h-.05l-.16 1.05h-1.92V6.6h2.3v4.44c.3-.32.65-.56 1.05-.73.4-.17.82-.26 1.27-.26.68 0 1.24.23 1.68.68.44.46.66 1.08.66 1.86v3.29c0 .76-.22 1.37-.66 1.84h-.12zm-3.56-3.8c0 .48.11.85.34 1.11.23.26.54.39.92.39.38 0 .69-.13.92-.39.23-.26.34-.63.34-1.11v-1.14c0-.49-.11-.86-.34-1.12-.23-.26-.54-.39-.92-.39-.38 0-.69.13-.92.39-.23.26-.34.63-.34 1.12v1.14z" />
      </svg>
    ),
  },
  express: {
    brandColor: "#ffffff",
    glowColor: "rgba(255, 255, 255, 0.2)",
    categoryTag: "API Server",
    focusArea: "Middleware & Routing",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 14.5h-2v-5h2zm0-7h-2V7h2z" />
      </svg>
    ),
  },
  nestjs: {
    brandColor: "#E0234E",
    glowColor: "rgba(224, 35, 78, 0.35)",
    categoryTag: "Enterprise Backend",
    focusArea: "Microservices & Dependency Injection",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#E0234E]`} aria-hidden="true">
        <path d="M11.99 0C5.37 0 0 5.37 0 11.99s5.37 12 11.99 12 12-5.38 12-12S18.61 0 11.99 0zm5.1 17.5l-5.1-6.14-5.1 6.14V6.5l5.1 6.14 5.1-6.14v11z" />
      </svg>
    ),
  },
  graphql: {
    brandColor: "#E10098",
    glowColor: "rgba(225, 0, 152, 0.35)",
    categoryTag: "Query Language",
    focusArea: "Schemas, Resolvers & Federation",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#E10098]`} aria-hidden="true">
        <path d="M12 2L2.5 7.5v11L12 24l9.5-5.5v-11L12 2zm0 2.31l7.5 4.33-2.6 1.5-4.9-2.83V4.31zm-1 0v3.01L6.1 10.14l-2.6-1.5L11 4.31zM4 9.42l4.9 2.83L4 15.08V9.42zm1 6.81l4.9-2.83 2.1 1.21-4.4 4.12-2.6-2.5zm7 4.46l-3.9-3.66 4.9-4.58 4.9 4.58-3.9 3.66v-4.58h-2v4.58zm1-5.67l2.1-1.21 4.9 2.83-2.6 2.5-4.4-4.12zm7-2.94l-4.9-2.83 4.9-2.83v5.66z" />
      </svg>
    ),
  },
  "rest apis": {
    brandColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.35)",
    categoryTag: "API Architecture",
    focusArea: "OpenAPI, Rate Limiting & Auth",
    icon: (className = "h-5 w-5") => (
      <svg
        viewBox="0 0 24 24"
        className={`${className} fill-none stroke-[#06B6D4]`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <path d="m7 8 3 3-3 3" />
        <path d="M13 14h4" />
      </svg>
    ),
  },
  postgresql: {
    brandColor: "#4169E1",
    glowColor: "rgba(65, 105, 225, 0.35)",
    categoryTag: "Relational DB",
    focusArea: "ACID, Indexing & JSONB",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#4169E1]`} aria-hidden="true">
        <path d="M12.012 0C7.29 0 3.327 3.398 2.378 8.014c-.394 1.916-.27 3.899.36 5.753.864 2.544 2.65 4.673 4.978 5.922 1.346.722 2.85 1.14 4.398 1.206v3.105h1.728v-3.125c1.472-.11 2.898-.544 4.17-1.258 2.298-1.291 4.03-3.447 4.839-5.992.593-1.868.675-3.85.234-5.75-.989-4.254-4.633-7.39-9.012-7.854A11.75 11.75 0 0 0 12.012 0zm.068 2.12c3.488 0 6.545 2.176 7.697 5.438.358 1.015.485 2.09.378 3.167-.348 3.513-2.617 6.467-5.845 7.653-1.428.525-2.97.64-4.475.333-2.884-.588-5.267-2.64-6.284-5.412a7.99 7.99 0 0 1-.365-3.766c.556-3.235 2.89-5.86 6.012-6.786.938-.278 1.92-.42 2.882-.627z" />
      </svg>
    ),
  },
  prisma: {
    brandColor: "#5A67D8",
    glowColor: "rgba(90, 103, 216, 0.35)",
    categoryTag: "Type-Safe ORM",
    focusArea: "Migrations & Schema Modeling",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#5A67D8] dark:fill-[#A3B8CC]`} aria-hidden="true">
        <path d="M21.905 16.486L13.803.953a1.455 1.455 0 0 0-2.585-.018L.25 19.349a1.455 1.455 0 0 0 1.282 2.128h17.91a1.455 1.455 0 0 0 1.294-.792l1.169-2.2a1.455 1.455 0 0 0 0-1.999zm-9.352-12.75l6.505 12.45h-5.066l-1.439-12.45zm-1.898 1.309l1.45 12.547-7.986.002 6.536-12.549z" />
      </svg>
    ),
  },
  mongodb: {
    brandColor: "#47A248",
    glowColor: "rgba(71, 162, 72, 0.35)",
    categoryTag: "Document DB",
    focusArea: "Aggregation & Scalability",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#47A248]`} aria-hidden="true">
        <path d="M17.193 9.555c-1.264-5.228-4.66-7.855-4.78-7.945a.798.798 0 0 0-.826 0c-.12.09-3.516 2.717-4.78 7.945-1.42 5.868.805 10.354 4.793 12.78v-4.148c-.68-.135-1.275-.544-1.615-1.127-.58-.99-.272-2.27.69-2.88.358-.228.78-.344 1.21-.334.432.01.85.145 1.196.39.93.65 1.18 1.944.56 2.9-.356.548-.938.927-1.597 1.054v4.145c3.988-2.426 6.213-6.912 4.793-12.78z" />
      </svg>
    ),
  },
  redis: {
    brandColor: "#DC382D",
    glowColor: "rgba(220, 56, 45, 0.35)",
    categoryTag: "In-Memory Store",
    focusArea: "Caching, Queues & Pub/Sub",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#DC382D]`} aria-hidden="true">
        <path d="M21.583 6.923L12.41 1.947a.82.82 0 00-.82 0L2.417 6.923a.82.82 0 00-.417.71v9.734c0 .296.157.57.417.71l9.173 4.976a.82.82 0 00.82 0l9.173-4.976a.82.82 0 00.417-.71V7.633a.82.82 0 00-.417-.71zm-9.583 8.356l-6.86-3.72 6.86-3.72 6.86 3.72-6.86 3.72z" />
      </svg>
    ),
  },
  docker: {
    brandColor: "#2496ED",
    glowColor: "rgba(36, 150, 237, 0.35)",
    categoryTag: "Containers",
    focusArea: "Multi-stage Builds & Compose",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#2496ED]`} aria-hidden="true">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m21.75 1.545c-.247-.197-1.125-.718-2.617-.61-.31-1.042-.998-1.927-1.942-2.5-.23-.14-.473-.263-.726-.37-.15-.062-.303-.117-.46-.164-.207-.063-.42-.113-.637-.15-.224-.04-.452-.063-.683-.07-.367-.01-.734.02-1.096.09-.153.03-.304.07-.453.118-.323.104-.633.24-.925.405-.293.167-.565.362-.81.583a5.55 5.55 0 00-.735.816v.006a.185.185 0 00.082.26.186.186 0 00.083.02h7.32c.69.005 1.37.147 2 .42.478.208.913.497 1.29.856.377.36.68.784.897 1.258.12.264.21.538.27.818.06.28.087.565.08.85a4.78 4.78 0 01-.334 1.77 4.965 4.965 0 01-.93 1.523 5.3 5.3 0 01-1.442 1.134 5.76 5.76 0 01-1.84.62c-.78.12-1.57.08-2.33-.12-.76-.2-1.46-.57-2.05-1.07-.59-.5-1.03-1.14-1.28-1.87-.25-.73-.29-1.52-.12-2.28a.187.187 0 00-.18-.226H1.936a.185.185 0 00-.183.155C1.49 13.9 1.48 15.68 2.37 17.27c.89 1.59 2.45 2.7 4.25 3.01 3.51.6 7.42.4 10.74-.84 3.32-1.24 5.92-3.83 6.94-7.22a.185.185 0 00-.34-.14" />
      </svg>
    ),
  },
  git: {
    brandColor: "#F05032",
    glowColor: "rgba(240, 80, 50, 0.35)",
    categoryTag: "Version Control",
    focusArea: "Trunk-based & Bisect",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#F05032]`} aria-hidden="true">
        <path d="M2.6 10.59L8.38 4.8a2.53 2.53 0 0 1 3.58 0l1.24 1.24-2.27 2.27a1.69 1.69 0 0 0-1.8.36 1.7 1.7 0 0 0-.39 1.77l-2.4 2.4a1.7 1.7 0 0 0-1.78.39 1.7 1.7 0 0 0 0 2.4 1.7 1.7 0 0 0 2.4 0 1.7 1.7 0 0 0 .39-1.78l2.36-2.36v5.82a1.7 1.7 0 1 0 1.69 0v-6.38a1.68 1.68 0 0 0 .9-.46 1.7 1.7 0 0 0 0-2.4 1.68 1.68 0 0 0-.6-.4l2.22-2.22 6.48 6.48a2.53 2.53 0 0 1 0 3.58l-5.78 5.79a2.53 2.53 0 0 1-3.58 0L2.6 14.17a2.53 2.53 0 0 1 0-3.58z" />
      </svg>
    ),
  },
  aws: {
    brandColor: "#FF9900",
    glowColor: "rgba(255, 153, 0, 0.35)",
    categoryTag: "Cloud Infra",
    focusArea: "S3, Lambda & CloudFront",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#FF9900]`} aria-hidden="true">
        <path d="M8.618 10.513c0-.498.077-.872.23-1.124.155-.25.385-.376.69-.376.32 0 .56.115.72.344.16.23.24.58.24 1.05v3.407h2.094v-3.79c0-.986-.275-1.75-.826-2.29-.55-.542-1.3-.812-2.25-.812-.767 0-1.442.186-2.025.56-.583.372-.98 1.004-1.19 1.895l1.98.497c.07-.48.21-.86.42-1.14zm5.55 3.398h2.095v-4.88c0-.77.16-1.37.48-1.8.32-.43.78-.65 1.38-.65.59 0 1.04.22 1.36.65.32.43.48 1.03.48 1.8v4.88h2.094V8.89c0-1.15-.33-2.07-1-2.76-.66-.69-1.57-1.04-2.72-1.04-.94 0-1.76.27-2.45.81-.69.54-1.12 1.32-1.3 2.34h-.05c-.17-.98-.6-1.73-1.3-2.26-.69-.53-1.55-.8-2.58-.8-1.07 0-1.94.31-2.61.94-.67.63-1.01 1.54-1.01 2.73v5.003h2.094V9.02c0-.77.16-1.38.48-1.81.32-.43.78-.65 1.38-.65.59 0 1.04.22 1.36.65.32.43.48 1.04.48 1.81v4.891zM0 18.59c4.22 2.92 9.61 4.5 15.22 4.5 3.99 0 7.84-.79 11.28-2.31l-.74-1.92c-3.21 1.41-6.8 2.15-10.54 2.15-5.26 0-10.31-1.48-14.28-4.22L0 18.59z" />
      </svg>
    ),
  },
  vercel: {
    brandColor: "#ffffff",
    glowColor: "rgba(255, 255, 255, 0.25)",
    categoryTag: "Edge & Deployments",
    focusArea: "CI/CD & Serverless Edge",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
        <path d="M24 22.525H0l12-21.05 12 21.05z" />
      </svg>
    ),
  },
  gsap: {
    brandColor: "#0AE448",
    glowColor: "rgba(10, 228, 72, 0.35)",
    categoryTag: "Animation Suite",
    focusArea: "ScrollTrigger & Canvas Scrubbing",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={`${className} fill-[#0AE448]`} aria-hidden="true">
        <path d="M14.654 3.208l-9.378 11.23h5.795l-3.328 6.354 11.025-11.452h-5.918l3.784-6.132h-1.98z" />
      </svg>
    ),
  },
  python: {
    brandColor: "#3776AB",
    glowColor: "rgba(55, 118, 171, 0.35)",
    categoryTag: "Scripting & AI",
    focusArea: "Data, Automation & APIs",
    icon: (className = "h-5 w-5") => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.75h5.813v.825H3.88s-3.88-.44-3.88 5.65c0 6.09 3.39 5.867 3.39 5.867h2.025v-2.844s-.11-3.39 3.33-3.39h5.73v-.868c0-.987-.852-1.71-1.89-1.71h-5.46V6.15h8.04s3.684.413 3.684-5.426C20.844.724 18.01 0 11.914 0zm-1.77 1.74a.885.885 0 1 1 0 1.77.885.885 0 0 1 0-1.77z"
          fill="#3776AB"
        />
        <path
          d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.006-2.75h-5.813v-.825h8.14s3.88.44 3.88-5.65c0-6.09-3.39-5.867-3.39-5.867h-2.025v2.844s.11 3.39-3.33 3.39h-5.73v.868c0 .987.852 1.71 1.89 1.71h5.46v2.784h-8.04s-3.684-.413-3.684 5.426C3.156 23.276 5.99 24 12.086 24zm1.77-1.74a.885.885 0 1 1 0-1.77.885.885 0 0 1 0 1.77z"
          fill="#FFD43A"
        />
      </svg>
    ),
  },
};

/** Helper to retrieve matching metadata or fallback */
export function getTechMeta(name: string): TechMeta {
  const key = name.toLowerCase().trim();
  if (TECH_REGISTRY[key]) return TECH_REGISTRY[key];

  // Partial matches
  for (const [k, meta] of Object.entries(TECH_REGISTRY)) {
    if (key.includes(k) || k.includes(key)) return meta;
  }

  // Fallback for custom skills
  return {
    brandColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.3)",
    categoryTag: "Specialized Stack",
    focusArea: "Production Development",
    icon: (className = "h-5 w-5") => (
      <svg
        viewBox="0 0 24 24"
        className={`${className} fill-none stroke-violet-400`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  };
}
