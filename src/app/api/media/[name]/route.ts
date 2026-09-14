import { NextRequest } from "next/server";
import { ok, badRequest, notFound, serverError } from "@/lib/api";
import { requireAdmin } from "@/lib/session";
import { UPLOAD_DIR } from "@/lib/upload";
import path from "path";
import { promises as fs } from "fs";

type Params = { params: Promise<{ name: string }> };

/**
 * Validate that `name` is a simple file name (no path traversal).
 * We allow any filename that doesn't contain `/`, `\`, or `..`.
 */
function isSafeName(name: string): boolean {
  if (!name) return false;
  if (name.includes("/") || name.includes("\\")) return false;
  if (name.includes("..")) return false;
  if (name.startsWith(".")) return false;
  return true;
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  await requireAdmin();
  const { name } = await params;
  if (!isSafeName(name)) {
    return badRequest("Invalid file name");
  }

  const filepath = path.join(UPLOAD_DIR, name);

  try {
    await fs.access(filepath);
  } catch {
    return notFound("File not found");
  }

  try {
    await fs.unlink(filepath);
    return ok({ ok: true });
  } catch (e) {
    console.error(e);
    return serverError("Failed to delete file");
  }
}
