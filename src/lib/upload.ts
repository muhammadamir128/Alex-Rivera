import { promises as fs } from "fs";
import path from "path";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

export function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/avif": "avif",
  };
  return map[mime] || "bin";
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function uniqueSlug(base: string, existing: string[]): string {
  let slug = base || "item";
  let i = 1;
  while (existing.includes(slug)) {
    slug = `${base}-${i++}`;
  }
  return slug;
}
