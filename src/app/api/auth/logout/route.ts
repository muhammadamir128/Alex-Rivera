import { clearSessionCookies } from "@/lib/session";
import { ok } from "@/lib/api";

export async function POST() {
  await clearSessionCookies();
  return ok({ ok: true });
}
