import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ENGAGEMENT_SURVEY_ID, ALL_QUESTIONS } from "@/lib/engagementSurvey";

async function ensureSurvey(userId: string) {
  const existing = await db.survey.findUnique({ where: { id: ENGAGEMENT_SURVEY_ID } });
  if (existing) return existing;
  return db.survey.create({
    data: {
      id: ENGAGEMENT_SURVEY_ID,
      title: "Monthly Engagement Survey",
      module: "ENGAGEMENT",
      status: "ACTIVE",
      isAnonymous: true,
      recurrence: "MONTHLY",
      createdById: userId,
    },
  });
}

async function ensureQuestion(questionId: string, surveyId: string, idx: number) {
  const existing = await db.question.findFirst({ where: { id: questionId } });
  if (existing) return existing;
  const q = ALL_QUESTIONS.find((q) => q.id === questionId);
  return db.question.create({
    data: {
      id: questionId,
      surveyId,
      text: q?.text ?? questionId,
      type: "CARD_SINGLE",
      order: idx,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { ratings, comments } = await req.json() as {
      ratings: Record<string, number>;
      comments: Record<string, string>;
    };

    if (!ratings || typeof ratings !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const survey = await ensureSurvey(user.id);

    // Check for duplicate this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const existing = await db.response.findFirst({
      where: { surveyId: ENGAGEMENT_SURVEY_ID, userId: user.id, submittedAt: { gte: monthStart } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already submitted this month" }, { status: 409 });
    }

    // Build answers: rating answers + optional comment answers
    const answers: { questionId: string; value: string }[] = [];
    let idx = 0;

    for (const [qId, rating] of Object.entries(ratings)) {
      await ensureQuestion(qId, survey.id, idx++);
      answers.push({ questionId: qId, value: String(rating) });
    }

    // Store comments as special answers keyed by section id
    for (const [sectionId, text] of Object.entries(comments)) {
      if (!text?.trim()) continue;
      const commentQId = `comment_${sectionId}`;
      await ensureQuestion(commentQId, survey.id, idx++);
      answers.push({ questionId: commentQId, value: text.trim() });
    }

    const response = await db.response.create({
      data: {
        surveyId: ENGAGEMENT_SURVEY_ID,
        userId: user.id,
        isAnonymous: true,
        answers: { create: answers },
      },
      include: { answers: true },
    });

    return NextResponse.json({ id: response.id }, { status: 201 });
  } catch (err) {
    console.error("[engagement POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
