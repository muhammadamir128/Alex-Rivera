import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/api";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { requireAdmin } from "@/lib/session";

export async function POST(request: NextRequest) {
  await requireAdmin();

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const currentPassword = body.currentPassword || "";
  const newPassword = body.newPassword || "";
  if (!currentPassword || !newPassword) {
    return badRequest("Current and new passwords are required");
  }
  if (newPassword.length < 8) {
    return badRequest("New password must be at least 8 characters");
  }

  const admin = await db.admin.findFirst();
  if (!admin) return badRequest("No admin account found");

  const valid = await verifyPassword(currentPassword, admin.passwordHash);
  if (!valid) return badRequest("Current password is incorrect");

  try {
    const passwordHash = await hashPassword(newPassword);
    await db.admin.update({ where: { id: admin.id }, data: { passwordHash } });
    return ok({ ok: true });
  } catch (e) {
    console.error(e);
    return serverError("Failed to change password");
  }
}
