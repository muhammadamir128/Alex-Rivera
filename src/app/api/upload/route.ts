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
    await ensureUploadDir();

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

    // Sanitize filename to avoid directory traversal or weird symbols
    const originalBase = path.parse(blob.name || "upload").name;
    const safeBase = slugify(originalBase) || "image";
    const filename = `${safeBase}-${Date.now()}.${resolvedExt}`;
    const destination = path.join(UPLOAD_DIR, filename);

    // Save buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(destination, buffer);

    const publicUrl = `/uploads/${filename}`;

    return ok({
      url: publicUrl,
      name: filename,
      size: blob.size,
      mime,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return serverError((err as Error).message || "File upload failed");
  }
}
