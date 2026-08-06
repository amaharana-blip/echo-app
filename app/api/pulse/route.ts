import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PULSE_SURVEY_ID, PULSE_QUESTIONS } from "@/lib/engagementSurvey";

async function ensurePulseSurvey(userId: string) {
  const existing = await db.survey.findUnique({ where: { id: PULSE_SURVEY_ID } });
  if (existing) return existing;
  return db.survey.create({
    data: {
      id: PULSE_SURVEY_ID,
      title: "Quick Pulse Check",
      module: "ENGAGEMENT",
      status: "ACTIVE",
      isAnonymous: true,
      recurrence: "NONE",
      createdById: userId,
    },
  });
}

async function ensureQuestion(questionId: string, surveyId: string, text: string, idx: number) {
  const existing = await db.question.findFirst({ where: { id: questionId } });
  if (existing) return existing;
  return db.question.create({
    data: { id: questionId, surveyId, text, type: "CARD_SINGLE", order: idx },
  });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { ratings, comment } = (await req.json()) as {
      ratings: Record<string, number>;
      comment?: string;
    };

    if (!ratings || typeof ratings !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const survey = await ensurePulseSurvey(user.id);

    // Build answers: one per pulse question id, stored under the section id
    // so manager insights can aggregate them alongside regular survey data
    const answers: { questionId: string; value: string }[] = [];
    let idx = 0;

    for (const pq of PULSE_QUESTIONS) {
      const rating = ratings[pq.id];
      if (rating === undefined) continue;

      // Store under a canonical question id scoped to pulse: pulse_{sectionId}
      // This lets the briefing/insights route pick them up per section
      const questionId = `pulse_${pq.sectionId}`;
      await ensureQuestion(questionId, survey.id, pq.text, idx++);
      answers.push({ questionId, value: String(rating) });
    }

    if (comment?.trim()) {
      const commentQId = "pulse_comment";
      await ensureQuestion(commentQId, survey.id, "Pulse optional comment", idx++);
      answers.push({ questionId: commentQId, value: comment.trim() });
    }

    const response = await db.response.create({
      data: {
        surveyId: PULSE_SURVEY_ID,
        userId: user.id,
        isAnonymous: true,
        answers: { create: answers },
      },
      include: { answers: true },
    });

    return NextResponse.json({ id: response.id }, { status: 201 });
  } catch (err) {
    console.error("[pulse POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
