import { ImageResponse } from "next/og";
import { getProjectBySlug, getProfile } from "@/lib/data";

export const runtime = "nodejs";
export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generates a dynamic OG image for each project detail page.
 * Renders a dark glassmorphism-style card with the project title,
 * description, tech tags, and the developer's name.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const profile = await getProfile();

  const title = project?.title || "Project";
  const description = project?.description || "A case study by " + profile.name;
  const tags = (project?.techTags || []).slice(0, 4);
  const name = profile.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a0e1a 0%, #0f1729 50%, #1a0b2e 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            left: "200px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            right: "100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)",
            display: "flex",
          }}
        />

        {/* top row: brand + featured */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              {name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ color: "#e7ecf5", fontSize: "20px", fontWeight: 600 }}>{name}</div>
              <div style={{ color: "#94a3b8", fontSize: "14px" }}>Full-Stack Developer</div>
            </div>
          </div>
          {project?.isFeatured && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: "999px",
                padding: "6px 16px",
                color: "#fbbf24",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              ★ Featured
            </div>
          )}
        </div>

        {/* middle: title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "1000px" }}>
          <div
            style={{
              color: "#e7ecf5",
              fontSize: "64px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "26px",
              lineHeight: 1.4,
              maxWidth: "900px",
            }}
          >
            {description}
          </div>
        </div>

        {/* bottom: tech tags + gradient bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: "12px" }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    color: "#cbd5e1",
                    fontSize: "18px",
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              width: "100%",
              height: "4px",
              borderRadius: "2px",
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #22d3ee)",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
