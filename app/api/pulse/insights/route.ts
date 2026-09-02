import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ENGAGEMENT_SECTIONS, PULSE_SURVEY_ID, PULSE_QUESTIONS } from "@/lib/engagementSurvey";

function ratingToClass(r: number): "favorable" | "neutral" | "unfavorable" {
  if (r >= 4) return "favorable";
  if (r === 3) return "neutral";
  return "unfavorable";
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    if (user.role !== "MANAGER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const managerOnly = url.searchParams.get("managerOnly") === "1";

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const allPulseResponses = await db.response.findMany({
      where: { surveyId: PULSE_SURVEY_ID, submittedAt: { gte: thirtyDaysAgo } },
      include: { answers: true },
    });

    const pulseResponses = managerOnly
      ? allPulseResponses.filter((r) => r.managerId === user.id || r.managerId === null)
      : allPulseResponses;

    const sectionRatings: Record<string, number[]> = {};
    const sectionWhyCounts: Record<string, Record<string, number>> = {};

    for (const resp of pulseResponses) {
      for (const ans of resp.answers) {
        if (ans.questionId.startsWith("why_pulse_")) {
          const sectionId = ans.questionId.replace("why_pulse_", "");
          if (!sectionWhyCounts[sectionId]) sectionWhyCounts[sectionId] = {};
          try {
            const chips: string[] = JSON.parse(ans.value);
            for (const chip of chips) {
              sectionWhyCounts[sectionId][chip] = (sectionWhyCounts[sectionId][chip] ?? 0) + 1;
            }
          } catch { /* ignore */ }
          continue;
        }
        if (!ans.questionId.startsWith("pulse_")) continue;
        const sectionId = ans.questionId.replace("pulse_", "");
        const val = Number(ans.value);
        if (isNaN(val) || val < 1 || val > 5) continue;
        if (!sectionRatings[sectionId]) sectionRatings[sectionId] = [];
        sectionRatings[sectionId].push(val);
      }
    }

    const whyIdToLabel: Record<string, string> = {};
    for (const pq of PULSE_QUESTIONS) {
      for (const w of [...pq.positiveWhys, ...pq.neutralWhys, ...pq.negativeWhys]) {
        whyIdToLabel[w.id] = w.label;
      }
    }

    const pulseInsights = [];
    for (const pq of PULSE_QUESTIONS) {
      const ratings = sectionRatings[pq.sectionId];
      if (!ratings || ratings.length === 0) continue;

      let fav = 0, neu = 0, unf = 0;
      for (const r of ratings) {
        const cls = ratingToClass(r);
        if (cls === "favorable") fav++;
        else if (cls === "neutral") neu++;
        else unf++;
      }
      const total = ratings.length;
      const favPct = Math.round((fav / total) * 100);
      const neuPct = Math.round((neu / total) * 100);
      const unfPct = Math.max(0, 100 - favPct - neuPct);

      const rawCounts = sectionWhyCounts[pq.sectionId] ?? {};
      const resolvedCounts: Record<string, number> = {};
      for (const [id, count] of Object.entries(rawCounts)) {
        const label = whyIdToLabel[id] ?? id;
        resolvedCounts[label] = (resolvedCounts[label] ?? 0) + count;
      }
      const topWhys = Object.entries(resolvedCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([label, count]) => ({ label, count }));

      const section = ENGAGEMENT_SECTIONS.find((s) => s.id === pq.sectionId);
      pulseInsights.push({
        sectionId: pq.sectionId,
        sectionTitle: section?.title ?? pq.sectionId,
        sectionIcon: section?.icon ?? pq.icon,
        sectionColor: section?.color ?? "#4F46E5",
        sectionGradient: section?.gradient ?? "linear-gradient(135deg,#4F46E5,#7C3AED)",
        questionText: pq.text,
        favorablePercent: favPct,
        neutralPercent: neuPct,
        unfavorablePercent: unfPct,
        responseCount: total,
        topWhys,
      });
    }

    return NextResponse.json({
      pulseInsights,
      pulseRespondents: pulseResponses.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[pulse/insights GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
