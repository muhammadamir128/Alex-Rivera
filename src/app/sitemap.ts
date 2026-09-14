import type { MetadataRoute } from "next";
import { getProjects, getProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://alexrivera.dev";
  const [projects, profile] = await Promise.all([getProjects(), getProfile()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: profile.updatedAt, changeFrequency: "monthly", priority: 1 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: p.isFeatured ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
