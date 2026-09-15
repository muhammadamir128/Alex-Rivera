import { NextRequest } from "next/server";
import { ok, serverError } from "@/lib/api";
import { requireAdmin } from "@/lib/session";
import { UPLOAD_DIR, ensureUploadDir } from "@/lib/upload";
import path from "path";
import { promises as fs } from "fs";

export async function GET(_request: NextRequest) {
  await requireAdmin();
  await ensureUploadDir();

  try {
    const entries = await fs.readdir(UPLOAD_DIR);
    const files = await Promise.all(
      entries.map(async (name) => {
        try {
          const stat = await fs.stat(path.join(UPLOAD_DIR, name));
          if (!stat.isFile()) return null;
          return {
            name,
            size: stat.size,
            mtime: stat.mtime.toISOString(),
            url: `/uploads/${name}`,
          };
        } catch {
          return null;
        }
      })
    );
    const list = files
      .filter(Boolean)
      .sort((a, b) => new Date(b!.mtime).getTime() - new Date(a!.mtime).getTime());
    return ok(list);
  } catch (e) {
    console.error(e);
    return serverError("Failed to list media");
  }
}

export async function POST(request: NextRequest) {
  // Delegate directly to the upload handler logic
  const { POST: uploadHandler } = await import("@/app/api/upload/route");
  return uploadHandler(request);
}

