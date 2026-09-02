import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ENGAGEMENT_SECTIONS, PULSE_SURVEY_ID, PULSE_QUESTIONS } from "@/lib/engagementSurvey";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  if (user.role !== "MANAGER" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const responses = await db.response.findMany({
    where: { surveyId: PULSE_SURVEY_ID, submittedAt: { gte: thirtyDaysAgo } },
    include: {
      answers: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  // Build why label lookup
  const whyIdToLabel: Record<string, string> = {};
  for (const pq of PULSE_QUESTIONS) {
    for (const w of [...pq.positiveWhys, ...pq.neutralWhys, ...pq.negativeWhys]) {
      whyIdToLabel[w.id] = w.label;
    }
  }

  const result = responses.map((resp) => {
    const sectionRatings: Record<string, number> = {};
    const sectionWhys: Record<string, string[]> = {};
    let comment = "";

    for (const ans of resp.answers) {
      if (ans.questionId === "pulse_comment") { comment = ans.value; continue; }
      if (ans.questionId.startsWith("why_pulse_")) {
        const sectionId = ans.questionId.replace("why_pulse_", "");
        try {
          const ids: string[] = JSON.parse(ans.value);
          sectionWhys[sectionId] = ids.map((id) => whyIdToLabel[id] ?? id);
        } catch { /* ignore */ }
        continue;
      }
      if (ans.questionId.startsWith("pulse_")) {
        const sectionId = ans.questionId.replace("pulse_", "");
        const val = Number(ans.value);
        if (!isNaN(val)) sectionRatings[sectionId] = val;
      }
    }

    const ratings = Object.values(sectionRatings);
    const overallAvg = ratings.length
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : null;

    // Build per-section details
    const sections = PULSE_QUESTIONS.map((pq) => {
      const section = ENGAGEMENT_SECTIONS.find((s) => s.id === pq.sectionId);
      return {
        sectionId: pq.sectionId,
        sectionTitle: section?.title ?? pq.sectionId,
        sectionIcon: section?.icon ?? pq.icon,
        sectionColor: section?.color ?? "#4F46E5",
        rating: sectionRatings[pq.sectionId] ?? null,
        whys: sectionWhys[pq.sectionId] ?? [],
      };
    }).filter((s) => s.rating !== null);

    return {
      responseId: resp.id,
      submittedAt: resp.submittedAt,
      user: resp.user ? { name: resp.user.name, email: resp.user.email } : null,
      overallAvg,
      sections,
      comment,
    };
  });

  return NextResponse.json(result);
}
