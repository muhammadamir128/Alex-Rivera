import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/api";

/**
 * Batch-reorder education entries. Body: { items: [{ id, order }] }
 * Updates each entry's `order` field in a single transaction.
 */
export async function PATCH(request: NextRequest) {
  let body: { items?: { id?: string; order?: number }[] };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return badRequest("items array is required");
  }

  try {
    await db.$transaction(
      items
        .filter((it) => it && typeof it.id === "string" && typeof it.order === "number")
        .map((it) =>
          db.education.update({
            where: { id: it.id as string },
            data: { order: it.order as number },
            select: { id: true },
          })
        )
    );
    return ok({ ok: true, updated: items.length });
  } catch (e) {
    console.error(e);
    return serverError("Failed to reorder education entries");
  }
}
