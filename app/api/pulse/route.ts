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
      title: "ECHO 2.0",
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
    const user = await getCurrentUser(); // may be null for unauthenticated submitters

    const { ratings, whys, comment, token } = (await req.json()) as {
      ratings: Record<string, number>;
      whys?: Record<string, string[]>;
      comment?: string;
      token?: string;
    };

    if (!ratings || typeof ratings !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Resolve token → managerId
    let managerId: string | null = null;
    if (token) {
      const pulseToken = await db.pulseToken.findUnique({ where: { token } });
      if (pulseToken && pulseToken.expiresAt > new Date()) {
        managerId = pulseToken.managerId;
        await db.pulseToken.update({ where: { token }, data: { used: { increment: 1 } } });
      }
    }

    // Need a real userId to create the survey — use a system user if anonymous
    const systemUserId = user?.id ?? (await db.user.findFirst({ where: { role: "ADMIN" } }))!.id;
    const survey = await ensurePulseSurvey(systemUserId);

    const answers: { questionId: string; value: string }[] = [];
    let idx = 0;

    for (const pq of PULSE_QUESTIONS) {
      const rating = ratings[pq.id];
      if (rating === undefined) continue;

      const questionId = `pulse_${pq.sectionId}`;
      await ensureQuestion(questionId, survey.id, pq.text, idx++);
      answers.push({ questionId, value: String(rating) });

      const selectedWhys = whys?.[pq.id];
      if (selectedWhys && selectedWhys.length > 0) {
        const whyQId = `why_pulse_${pq.sectionId}`;
        await ensureQuestion(whyQId, survey.id, `Why: ${pq.text}`, idx++);
        answers.push({ questionId: whyQId, value: JSON.stringify(selectedWhys) });
      }
    }

    if (comment?.trim()) {
      const commentQId = "pulse_comment";
      await ensureQuestion(commentQId, survey.id, "Pulse optional comment", idx++);
      answers.push({ questionId: commentQId, value: comment.trim() });
    }

    // If logged in, delete any prior pulse response so re-submits work cleanly
    if (user?.id) {
      const existing = await db.response.findFirst({
        where: { surveyId: PULSE_SURVEY_ID, userId: user.id },
      });
      if (existing) {
        await db.answer.deleteMany({ where: { responseId: existing.id } });
        await db.response.delete({ where: { id: existing.id } });
      }
    }

    const response = await db.response.create({
      data: {
        surveyId: PULSE_SURVEY_ID,
        userId: user?.id ?? null,
        isAnonymous: true,
        managerId: managerId ?? undefined,
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
