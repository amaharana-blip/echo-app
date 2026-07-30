import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    if (user.role !== "MANAGER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const team = await db.team.findFirst({
      where: { managerId: user.id },
      include: { members: { select: { id: true, name: true, email: true } } },
    });

    if (!team) {
      return NextResponse.json({
        teamSize: 0,
        burnoutRisk: 0,
        avgMood: 0,
        eNPS: 0,
        openCases: 0,
        moduleCompletion: {},
        topMindItems: [],
        members: [],
      });
    }

    const memberIds = team.members.map((m) => m.id);
    const teamSize = memberIds.length;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Count open cases
    const openCases = await db.case.count({
      where: {
        reporterId: { in: memberIds },
        status: { not: "CLOSED" },
      },
    });

    // Count responses per module in last 30 days
    const responses = await db.response.findMany({
      where: {
        userId: { in: memberIds },
        submittedAt: { gte: thirtyDaysAgo },
      },
      select: { surveyId: true, userId: true },
    });

    // Module completion: unique respondents per surveyId bucket
    const moduleRespondents: Record<string, Set<string>> = {};
    for (const r of responses) {
      if (!moduleRespondents[r.surveyId]) {
        moduleRespondents[r.surveyId] = new Set();
      }
      if (r.userId) moduleRespondents[r.surveyId].add(r.userId);
    }

    const moduleCompletion: Record<string, number> = {};
    for (const [surveyId, respondents] of Object.entries(moduleRespondents)) {
      moduleCompletion[surveyId] = teamSize > 0
        ? Math.min(100, Math.round((respondents.size / teamSize) * 100))
        : 0;
    }

    return NextResponse.json({
      teamSize,
      openCases,
      moduleCompletion,
      members: team.members,
    });
  } catch (err) {
    console.error("[manager/overview]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
