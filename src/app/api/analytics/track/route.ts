import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest } from "@/lib/api";

/**
 * Public endpoint to record a page view. Called from the client on
 * project detail page mounts. Body: { path: string, slug?: string }
 * Rate-limited implicitly by being a lightweight insert.
 */
export async function POST(request: NextRequest) {
  let body: { path?: string; slug?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const path = String(body.path || "").trim();
  if (!path || path.length > 200) {
    return badRequest("Valid path is required");
  }

  const slug = body.slug ? String(body.slug).slice(0, 120) : null;
  const now = new Date();
  const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  try {
    await db.pageView.create({
      data: { path, slug, day },
    });
    return ok({ ok: true });
  } catch (e) {
    // Fail silently — don't break the page if analytics DB write fails
    console.error("analytics track error:", e);
    return ok({ ok: false });
  }
}
