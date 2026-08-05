import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ENGAGEMENT_SECTIONS } from "@/lib/engagementSurvey";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  if (user.role !== "MANAGER" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const responses = await db.response.findMany({
    where: {
      surveyId: "engagement",
      submittedAt: { gte: thirtyDaysAgo },
    },
    include: {
      answers: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  const result = responses.map((resp) => {
    const sectionScores: Record<string, { avg: number; ratings: number[] }> = {};

    for (const ans of resp.answers) {
      if (ans.questionId.startsWith("comment_") || ans.questionId.startsWith("why_")) continue;
      const val = Number(ans.value);
      if (isNaN(val)) continue;

      const section = ENGAGEMENT_SECTIONS.find((s) => s.questions.some((q) => q.id === ans.questionId));
      if (!section) continue;

      if (!sectionScores[section.id]) sectionScores[section.id] = { avg: 0, ratings: [] };
      sectionScores[section.id].ratings.push(val);
    }

    for (const s of Object.values(sectionScores)) {
      s.avg = Math.round((s.ratings.reduce((a, b) => a + b, 0) / s.ratings.length) * 10) / 10;
    }

    const comments: Record<string, string> = {};
    for (const ans of resp.answers) {
      if (ans.questionId.startsWith("comment_")) {
        comments[ans.questionId.replace("comment_", "")] = ans.value;
      }
    }

    const allRatings = Object.values(sectionScores).flatMap((s) => s.ratings);
    const overallAvg = allRatings.length
      ? Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10) / 10
      : null;

    return {
      responseId: resp.id,
      submittedAt: resp.submittedAt,
      user: resp.user ? { name: resp.user.name, email: resp.user.email } : null,
      overallAvg,
      sectionScores,
      comments,
    };
  });

  return NextResponse.json(result);
}
