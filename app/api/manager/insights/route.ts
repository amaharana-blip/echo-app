import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import {
  BURNOUT_MODULE,
  PULSE_MODULE,
  MANAGER_MODULE,
  AI_TOOLS_MODULE,
  type Module,
} from "@/lib/modules";
import { ENGAGEMENT_SECTIONS, ENGAGEMENT_SURVEY_ID, PULSE_SURVEY_ID, PULSE_QUESTIONS } from "@/lib/engagementSurvey";

const MODULES: Module[] = [PULSE_MODULE, BURNOUT_MODULE, MANAGER_MODULE, AI_TOOLS_MODULE];
const MIN_RESPONSES = 1;

function ratingToClass(rating: number): "favorable" | "neutral" | "unfavorable" {
  if (rating >= 4) return "favorable";
  if (rating === 3) return "neutral";
  return "unfavorable";
}

function classifyCard(
  cardIndex: number,
  riskThreshold: number,
  questionType: string
): "favorable" | "neutral" | "unfavorable" {
  if (questionType === "EMOJI_MOOD") {
    if (cardIndex >= riskThreshold) return "favorable";
    if (cardIndex === riskThreshold - 1) return "neutral";
    return "unfavorable";
  }
  if (cardIndex < riskThreshold) return "favorable";
  if (cardIndex === riskThreshold) return "neutral";
  return "unfavorable";
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    if (user.role !== "MANAGER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const responses = await db.response.findMany({
      where: { submittedAt: { gte: thirtyDaysAgo } },
      include: { answers: true },
    });

    const respondentSet = new Set(
      responses.map((r) => r.userId).filter(Boolean)
    );
    const uniqueRespondents = respondentSet.size;

    const openCases = await db.case.count({ where: { status: { not: "CLOSED" } } });

    const byModule: Record<string, typeof responses> = {};
    for (const r of responses) {
      if (!byModule[r.surveyId]) byModule[r.surveyId] = [];
      byModule[r.surveyId].push(r);
    }

    const moduleInsights: {
      moduleId: string;
      moduleTitle: string;
      icon: string;
      gradient: string;
      responseCount: number;
      overallFavorablePercent: number;
      overallNeutralPercent: number;
      overallUnfavorablePercent: number;
      questions: {
        questionId: string;
        questionText: string;
        favorablePercent: number;
        neutralPercent: number;
        unfavorablePercent: number;
        responseCount: number;
        moduleId: string;
        moduleTitle: string;
        dimensionId: string;
        dimensionLabel: string;
      }[];
    }[] = [];

    const allQuestionInsights: {
      questionId: string;
      questionText: string;
      favorablePercent: number;
      neutralPercent: number;
      unfavorablePercent: number;
      responseCount: number;
      moduleId: string;
      moduleTitle: string;
      dimensionId: string;
      dimensionLabel: string;
    }[] = [];

    const dimensionSummaries: {
      id: string;
      label: string;
      moduleId: string;
      moduleTitle: string;
      favorablePercent: number;
      neutralPercent: number;
      unfavorablePercent: number;
      responseCount: number;
      color: string;
    }[] = [];

    for (const [surveyId, moduleResponses] of Object.entries(byModule)) {
      const mod = MODULES.find((m) => m.id === surveyId);
      if (!mod || moduleResponses.length < MIN_RESPONSES) continue;

      const qAccum: Record<
        string,
        { favorable: number; neutral: number; unfavorable: number; total: number }
      > = {};
      for (const q of mod.questions) {
        qAccum[q.id] = { favorable: 0, neutral: 0, unfavorable: 0, total: 0 };
      }

      for (const resp of moduleResponses) {
        const answersMap: Record<string, string[]> = {};
        for (const ans of resp.answers) {
          try {
            answersMap[ans.questionId] = JSON.parse(ans.value);
          } catch {
            answersMap[ans.questionId] = [ans.value];
          }
        }

        for (const q of mod.questions) {
          if (q.type !== "CARD_SINGLE" && q.type !== "EMOJI_MOOD") continue;
          const selected = answersMap[q.id];
          if (!selected || selected.length === 0) continue;

          const dim = mod.dimensions.find((d) => d.id === q.dimension);
          if (!dim) continue;

          const cardIndex = q.cards.findIndex((c) => c.id === selected[0]);
          if (cardIndex === -1) continue;

          const cls = classifyCard(cardIndex, dim.riskThreshold, q.type);
          qAccum[q.id][cls]++;
          qAccum[q.id].total++;
        }
      }

      const questions = mod.questions
        .filter((q) => q.type === "CARD_SINGLE" || q.type === "EMOJI_MOOD")
        .map((q) => {
          const acc = qAccum[q.id];
          if (acc.total === 0) return null;
          const dim = mod.dimensions.find((d) => d.id === q.dimension);
          const fav = Math.round((acc.favorable / acc.total) * 100);
          const neu = Math.round((acc.neutral / acc.total) * 100);
          const unf = Math.max(0, 100 - fav - neu);
          return {
            questionId: q.id,
            questionText: q.text,
            favorablePercent: fav,
            neutralPercent: neu,
            unfavorablePercent: unf,
            responseCount: acc.total,
            moduleId: mod.id,
            moduleTitle: mod.title,
            dimensionId: q.dimension,
            dimensionLabel: dim?.label ?? q.dimension,
          };
        })
        .filter((q): q is NonNullable<typeof q> => q !== null);

      allQuestionInsights.push(...questions);

      const overallFav =
        questions.length > 0
          ? Math.round(
              questions.reduce((s, q) => s + q.favorablePercent, 0) / questions.length
            )
          : 0;
      const overallNeu =
        questions.length > 0
          ? Math.round(
              questions.reduce((s, q) => s + q.neutralPercent, 0) / questions.length
            )
          : 0;
      const overallUnf = Math.max(0, 100 - overallFav - overallNeu);

      moduleInsights.push({
        moduleId: mod.id,
        moduleTitle: mod.title,
        icon: mod.icon,
        gradient: mod.gradient,
        responseCount: moduleResponses.length,
        overallFavorablePercent: overallFav,
        overallNeutralPercent: overallNeu,
        overallUnfavorablePercent: overallUnf,
        questions,
      });

      for (const dim of mod.dimensions) {
        const dimQs = questions.filter((q) => q.dimensionId === dim.id);
        if (dimQs.length === 0) continue;
        const dFav = Math.round(
          dimQs.reduce((s, q) => s + q.favorablePercent, 0) / dimQs.length
        );
        const dNeu = Math.round(
          dimQs.reduce((s, q) => s + q.neutralPercent, 0) / dimQs.length
        );
        const dUnf = Math.max(0, 100 - dFav - dNeu);
        dimensionSummaries.push({
          id: `${mod.id}-${dim.id}`,
          label: dim.label,
          moduleId: mod.id,
          moduleTitle: mod.title,
          favorablePercent: dFav,
          neutralPercent: dNeu,
          unfavorablePercent: dUnf,
          responseCount: moduleResponses.length,
          color: dim.color,
        });
      }
    }

    // ── ECHO engagement survey processing ──
    const echoResponses = byModule[ENGAGEMENT_SURVEY_ID] ?? [];
    if (echoResponses.length >= MIN_RESPONSES) {
      // Map questionId -> numeric ratings array
      const qRatings: Record<string, number[]> = {};
      for (const resp of echoResponses) {
        for (const ans of resp.answers) {
          if (ans.questionId.startsWith("comment_")) continue;
          const val = Number(ans.value);
          if (isNaN(val) || val < 1 || val > 5) continue;
          if (!qRatings[ans.questionId]) qRatings[ans.questionId] = [];
          qRatings[ans.questionId].push(val);
        }
      }

      // Build one module per section
      for (const section of ENGAGEMENT_SECTIONS) {
        const sectionQuestionInsights: typeof allQuestionInsights = [];

        for (const q of section.questions) {
          const ratings = qRatings[q.id];
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

          const qi = {
            questionId: q.id,
            questionText: q.text,
            favorablePercent: favPct,
            neutralPercent: neuPct,
            unfavorablePercent: unfPct,
            responseCount: total,
            moduleId: section.id,
            moduleTitle: section.title,
            dimensionId: section.id,
            dimensionLabel: section.title,
          };
          sectionQuestionInsights.push(qi);
          allQuestionInsights.push(qi);
        }

        if (sectionQuestionInsights.length > 0) {
          const dFav = Math.round(sectionQuestionInsights.reduce((s, q) => s + q.favorablePercent, 0) / sectionQuestionInsights.length);
          const dNeu = Math.round(sectionQuestionInsights.reduce((s, q) => s + q.neutralPercent, 0) / sectionQuestionInsights.length);
          const dUnf = Math.max(0, 100 - dFav - dNeu);

          dimensionSummaries.push({
            id: `echo-${section.id}`,
            label: section.title,
            moduleId: section.id,
            moduleTitle: section.title,
            favorablePercent: dFav,
            neutralPercent: dNeu,
            unfavorablePercent: dUnf,
            responseCount: echoResponses.length,
            color: section.color,
          });

          moduleInsights.push({
            moduleId: section.id,
            moduleTitle: section.title,
            icon: section.icon,
            gradient: section.gradient,
            responseCount: echoResponses.length,
            overallFavorablePercent: dFav,
            overallNeutralPercent: dNeu,
            overallUnfavorablePercent: dUnf,
            questions: sectionQuestionInsights,
          });
        }
      }

      // Add ECHO respondents to the overall respondent count
      for (const r of echoResponses) { if (r.userId) respondentSet.add(r.userId); }
    }

    // ── Pulse survey processing ──
    const pulseResponses = byModule[PULSE_SURVEY_ID] ?? [];
    const pulseInsights: {
      sectionId: string;
      sectionTitle: string;
      sectionIcon: string;
      sectionColor: string;
      sectionGradient: string;
      questionText: string;
      favorablePercent: number;
      neutralPercent: number;
      unfavorablePercent: number;
      responseCount: number;
      topWhys: { label: string; count: number }[];
    }[] = [];

    if (pulseResponses.length >= MIN_RESPONSES) {
      // Collect ratings and why chips per section
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

      // Build a flat id→label lookup from all pulse question why options
      const whyIdToLabel: Record<string, string> = {};
      for (const pq of PULSE_QUESTIONS) {
        for (const w of [...pq.positiveWhys, ...pq.neutralWhys, ...pq.negativeWhys]) {
          whyIdToLabel[w.id] = w.label;
        }
      }

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

        // Resolve stored IDs → human labels before aggregating
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

      for (const r of pulseResponses) { if (r.userId) respondentSet.add(r.userId); }
    }

    dimensionSummaries.sort((a, b) => b.favorablePercent - a.favorablePercent);

    const sortedByFav = [...allQuestionInsights].sort(
      (a, b) => b.favorablePercent - a.favorablePercent
    );
    const topQuestions = sortedByFav.slice(0, 3);
    const bottomQuestions = [...sortedByFav].reverse().slice(0, 3);

    // Collect real ECHO comments
    const echoCommentAnswers = await db.answer.findMany({
      where: { questionId: { startsWith: "comment_" } },
    });
    const teamVoiceComments: { sectionId: string; text: string }[] = echoCommentAnswers
      .filter((a) => a.value?.trim())
      .map((a) => ({ sectionId: a.questionId.replace("comment_", ""), text: a.value.trim() }));

    return NextResponse.json({
      uniqueRespondents: respondentSet.size,
      openCases,
      dimensionSummaries,
      topQuestions,
      bottomQuestions,
      moduleInsights: moduleInsights.sort(
        (a, b) => a.overallFavorablePercent - b.overallFavorablePercent
      ),
      teamVoiceComments,
      pulseInsights,
      pulseRespondents: pulseResponses.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[manager/insights]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
