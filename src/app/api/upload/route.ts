import { NextRequest } from "next/server";
import { ok, badRequest, serverError } from "@/lib/api";
import { requireAdmin } from "@/lib/session";
import { UPLOAD_DIR, ensureUploadDir, extFromMime, slugify } from "@/lib/upload";
import path from "path";
import { promises as fs } from "fs";

const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_MIME_PREFIXES = ["image/"];
const ALLOWED_EXTS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "svg",
  "avif",
  "bmp",
  "ico",
]);

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") ?? formData.get("image");

    if (!file || typeof file === "string") {
      return badRequest("No file uploaded");
    }

    const blob = file as File;

    if (blob.size === 0) {
      return badRequest("Uploaded file is empty");
    }

    if (blob.size > MAX_SIZE_BYTES) {
      return badRequest("File exceeds maximum allowed size of 15MB");
    }

    const mime = blob.type || "application/octet-stream";
    const rawExt = path.extname(blob.name || "").replace(/^\./, "").toLowerCase();
    const resolvedExt = rawExt || extFromMime(mime);

    const isImageMime = ALLOWED_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix));
    const isAllowedExt = ALLOWED_EXTS.has(resolvedExt);

    if (!isImageMime && !isAllowedExt) {
      return badRequest("Only image files are allowed");
    }

    // Read buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let finalBuffer: Buffer = buffer;
    let finalMime = mime;
    let finalExt = resolvedExt;

    // Optimize image with sharp if not an SVG
    if (mime !== "image/svg+xml" && !resolvedExt.includes("svg")) {
      try {
        const sharp = (await import("sharp")).default;
        finalBuffer = await sharp(buffer)
          .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
        finalMime = "image/webp";
        finalExt = "webp";
      } catch (sharpErr) {
        console.warn("Image optimization with sharp skipped:", sharpErr);
      }
    }

    // Sanitize filename
    const originalBase = path.parse(blob.name || "upload").name;
    const safeBase = slugify(originalBase) || "image";
    const filename = `${safeBase}-${Date.now()}.${finalExt}`;

    let publicUrl = "";

    // If not in a serverless read-only environment like Vercel, try local filesystem write
    if (!process.env.VERCEL) {
      try {
        await ensureUploadDir();
        const destination = path.join(UPLOAD_DIR, filename);
        await fs.writeFile(destination, finalBuffer);
        publicUrl = `/uploads/${filename}`;
      } catch (diskErr) {
        console.warn("Disk write failed, using data URL fallback:", diskErr);
      }
    }

    // If disk write failed or running in Vercel serverless (read-only filesystem), use optimized base64 data URL
    if (!publicUrl) {
      publicUrl = `data:${finalMime};base64,${finalBuffer.toString("base64")}`;
    }

    return ok({
      url: publicUrl,
      name: filename,
      size: finalBuffer.length,
      mime: finalMime,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return serverError((err as Error).message || "File upload failed");
  }
}
