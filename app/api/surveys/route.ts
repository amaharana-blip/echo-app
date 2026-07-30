import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId") ?? user.teamId ?? undefined;

    const surveys = await db.survey.findMany({
      where: {
        status: "ACTIVE",
        OR: [{ teamId }, { teamId: null }],
      },
      include: {
        questions: { orderBy: { order: "asc" } },
        _count: { select: { responses: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(surveys);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole("MANAGER");
    const body = await req.json();
    const { title, description, type, isAnonymous, teamId, questions, closesAt } = body;

    const survey = await db.survey.create({
      data: {
        title,
        description,
        module: type ?? "CUSTOM",
        isAnonymous: isAnonymous ?? false,
        teamId: teamId ?? user.teamId,
        createdById: user.id,
        closesAt: closesAt ? new Date(closesAt) : null,
        questions: {
          create: (questions ?? []).map((q: { text: string; type: string; options?: string[]; required?: boolean; order: number }) => ({
            text: q.text,
            type: q.type,
            cards: JSON.stringify(q.options ?? []),
            required: q.required ?? true,
            order: q.order,
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json(survey, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = message === "Unauthenticated" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
