import { getAdmin } from "@/lib/session";
import { ok, unauthorized } from "@/lib/api";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return unauthorized();
  return ok({
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      lastLoginAt: admin.lastLoginAt,
    },
  });
}
