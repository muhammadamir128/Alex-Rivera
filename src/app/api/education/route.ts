import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/api";
import { getEducation } from "@/lib/data";

export async function GET() {
  const items = await getEducation();
  return ok(items);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const degree = String(body.degree || "").trim();
  const institution = String(body.institution || "").trim();

  if (!degree || !institution) {
    return badRequest("Degree and institution are required");
  }

  try {
    const item = await db.education.create({
      data: {
        degree,
        institution,
        field: body.field ? String(body.field).trim() : null,
        location: body.location ? String(body.location).trim() : null,
        startDate: String(body.startDate || "").trim(),
        endDate: body.endDate ? String(body.endDate).trim() : null,
        current: Boolean(body.current),
        grade: body.grade ? String(body.grade).trim() : null,
        description: String(body.description || "").trim(),
        order: Number(body.order || 0),
      },
    });
    return ok(item);
  } catch (e) {
    console.error(e);
    return serverError("Failed to create education record");
  }
}
