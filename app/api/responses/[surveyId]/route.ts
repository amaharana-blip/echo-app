import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { surveyId: string } }) {
  try {
    const user = await requireRole("MANAGER");

    const responses = await db.response.findMany({
      where: { surveyId: params.surveyId },
      include: {
        answers: { include: { question: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { submittedAt: "desc" },
    });

    // Strip user info from anonymous responses
    const sanitized = responses.map((r) => ({
      ...r,
      user: r.isAnonymous ? null : r.user,
    }));

    return NextResponse.json(sanitized);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
