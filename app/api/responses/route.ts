import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const MODULE_SLUGS = ["pulse", "burnout", "manager", "ai_tools", "satisfaction", "enps"];

async function ensureSurvey(surveyId: string, userId: string) {
  const existing = await db.survey.findUnique({ where: { id: surveyId } });
  if (existing) return existing;

  // Auto-create system survey for built-in module submissions
  if (!MODULE_SLUGS.includes(surveyId)) return null;

  return db.survey.create({
    data: {
      id: surveyId,
      title: surveyId.charAt(0).toUpperCase() + surveyId.slice(1).replace(/_/g, " "),
      module: surveyId.toUpperCase(),
      status: "ACTIVE",
      isAnonymous: false,
      createdById: userId,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { surveyId, answers, isAnonymous } = await req.json();

    if (!surveyId || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const survey = await ensureSurvey(surveyId, user.id);
    if (!survey) return NextResponse.json({ error: "Survey not found" }, { status: 404 });

    // Check for duplicate (only when userId is tracked)
    if (!isAnonymous) {
      const existing = await db.response.findUnique({
        where: { surveyId_userId: { surveyId, userId: user.id } },
      });
      if (existing) return NextResponse.json({ error: "Already submitted" }, { status: 409 });
    }

    // For module-based submissions, questionIds are strings like "b1", "p2" — store as-is.
    // We need a Question record to exist for each Answer (FK). For module slugs, auto-create questions.
    const resolvedAnswers: { questionId: string; value: string }[] = [];

    for (const a of answers as { questionId: string; value: string }[]) {
      let question = await db.question.findFirst({ where: { id: a.questionId } });
      if (!question) {
        question = await db.question.create({
          data: {
            id: a.questionId,
            surveyId: survey.id,
            text: a.questionId,
            type: "CARD_SINGLE",
            order: resolvedAnswers.length,
          },
        });
      }
      resolvedAnswers.push({ questionId: question.id, value: a.value });
    }

    const response = await db.response.create({
      data: {
        surveyId,
        userId: isAnonymous ? null : user.id,
        isAnonymous: isAnonymous ?? survey.isAnonymous,
        answers: {
          create: resolvedAnswers,
        },
      },
      include: { answers: true },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error("[responses POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
