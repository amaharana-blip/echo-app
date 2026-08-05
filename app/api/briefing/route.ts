import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@auth0/nextjs-auth0";
import { getCurrentUser } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { ENGAGEMENT_SECTIONS } from "@/lib/engagementSurvey";

function ratingToClass(r: number) {
  if (r >= 4) return "favorable";
  if (r === 3) return "neutral";
  return "unfavorable";
}

export async function GET() {
  try {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getCurrentUser();
  if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });

  // Gather ECHO survey data
  const responses = await db.response.findMany({
    where: { surveyId: "engagement" },
    include: { answers: true },
  });

  if (responses.length === 0) {
    return NextResponse.json({ briefing: "No survey responses yet. Share the survey link with your team to start collecting data." });
  }

  // Build section scores
  const sectionData: Record<string, { fav: number; neu: number; unf: number; total: number; whyCounts: Record<string, number> }> = {};

  for (const resp of responses) {
    for (const ans of resp.answers) {
      if (ans.questionId.startsWith("comment_")) continue;
      if (ans.questionId.startsWith("why_")) {
        // Track why chip frequencies
        // questionId format: why_{questionId}
        const sectionId = ans.questionId.replace("why_", "").split("_")[0];
        if (!sectionData[sectionId]) sectionData[sectionId] = { fav: 0, neu: 0, unf: 0, total: 0, whyCounts: {} };
        try {
          const chips: string[] = JSON.parse(ans.value);
          for (const chip of chips) {
            sectionData[sectionId].whyCounts[chip] = (sectionData[sectionId].whyCounts[chip] ?? 0) + 1;
          }
        } catch { /* ignore */ }
        continue;
      }

      const val = Number(ans.value);
      if (isNaN(val) || val < 1 || val > 5) continue;

      const section = ENGAGEMENT_SECTIONS.find((s) => s.questions.some((q) => q.id === ans.questionId));
      if (!section) continue;

      if (!sectionData[section.id]) sectionData[section.id] = { fav: 0, neu: 0, unf: 0, total: 0, whyCounts: {} };
      const cls = ratingToClass(val);
      sectionData[section.id].total++;
      if (cls === "favorable") sectionData[section.id].fav++;
      else if (cls === "neutral") sectionData[section.id].neu++;
      else sectionData[section.id].unf++;
    }
  }

  // Fetch open-text comments
  const commentAnswers = await db.answer.findMany({
    where: { questionId: { startsWith: "comment_" } },
  });
  const comments = commentAnswers.map((a) => a.value.trim()).filter(Boolean).slice(0, 10);

  // Build prompt
  const summaries = ENGAGEMENT_SECTIONS.map((sec) => {
    const d = sectionData[sec.id];
    if (!d || d.total === 0) return null;
    const favPct = Math.round((d.fav / d.total) * 100);
    const topWhys = Object.entries(d.whyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, count]) => `"${label}" (${count}x)`)
      .join(", ");
    return `${sec.title}: ${favPct}% favorable${topWhys ? ` — top reasons: ${topWhys}` : ""}`;
  }).filter(Boolean);

  const prompt = `You are writing a weekly manager briefing for a team of ${responses.length} people. Keep it sharp, direct, and human — no corporate fluff.

Survey data (% favorable, top selected reasons):
${summaries.join("\n")}

${comments.length > 0 ? `Open comments from team:\n${comments.map((c) => `- "${c}"`).join("\n")}` : ""}

Write a briefing in 3 short sections:
1. **What's strong** (1–2 sentences on best-scoring areas and why)
2. **Where to focus** (1–2 sentences on lowest areas with the specific reasons people gave)
3. **One action** (one concrete thing the manager can do this week, based on the data)

Tone: direct, empathetic, no bullet points within sections. Max 120 words total.`;

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const briefing = (message.content[0] as { text: string }).text;

  return NextResponse.json({
    briefing,
    respondents: responses.length,
    generatedAt: new Date().toISOString(),
  });
  } catch (err) {
    console.error("[briefing GET]", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
