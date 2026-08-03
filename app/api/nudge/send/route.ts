import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ENGAGEMENT_SECTIONS } from "@/lib/engagementSurvey";

// Two sections are picked per week (rotating through all 9 over ~4.5 weeks)
function pickSectionsForWeek(weekOf: Date): [string, string] {
  const sectionIds = ENGAGEMENT_SECTIONS.map((s) => s.id);
  const weekIndex = Math.floor(weekOf.getTime() / (7 * 24 * 60 * 60 * 1000));
  const a = sectionIds[weekIndex % sectionIds.length];
  const b = sectionIds[(weekIndex + 1) % sectionIds.length];
  return [a, b];
}

function mondayOf(d: Date): Date {
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.SLACK_BOT_TOKEN;
  if (!token || token.startsWith("xoxb-your")) {
    return NextResponse.json({ error: "SLACK_BOT_TOKEN not configured" }, { status: 503 });
  }

  const weekOf = mondayOf(new Date());
  const [sectionAId, sectionBId] = pickSectionsForWeek(weekOf);
  const sectionA = ENGAGEMENT_SECTIONS.find((s) => s.id === sectionAId)!;
  const sectionB = ENGAGEMENT_SECTIONS.find((s) => s.id === sectionBId)!;

  // Get (or create) the nudge record for this week
  let nudge = await db.nudge.findFirst({ where: { weekOf } });
  if (!nudge) {
    nudge = await db.nudge.create({ data: { weekOf } });
  }

  // Get all employees with a slackUserId
  const employees = await db.user.findMany({
    where: { role: "EMPLOYEE", slackUserId: { not: null } },
  });

  const results = await Promise.allSettled(
    employees.map(async (user) => {
      const blocks = buildNudgeBlocks(nudge!.id, sectionA, sectionB);
      await slackPost(token, "chat.postMessage", {
        channel: user.slackUserId!,
        text: `Quick ECHO check-in 👋`,
        blocks,
      });
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ ok: true, sent, failed, weekOf, sections: [sectionAId, sectionBId] });
}

function buildNudgeBlocks(nudgeId: string, sectionA: typeof ENGAGEMENT_SECTIONS[0], sectionB: typeof ENGAGEMENT_SECTIONS[0]) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Quick ECHO check-in* 👋\nTwo questions, 30 seconds. Your response is anonymous.`,
      },
    },
    { type: "divider" },
    buildRatingBlock(nudgeId, sectionA),
    buildRatingBlock(nudgeId, sectionB),
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: "Responses are aggregated — your manager sees team trends, not individual answers." }],
    },
  ];
}

function buildRatingBlock(nudgeId: string, section: typeof ENGAGEMENT_SECTIONS[0]) {
  const ratings = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${section.icon} ${section.title}*\nHow would you rate this area this week?`,
    },
    accessory: {
      type: "static_select",
      placeholder: { type: "plain_text", text: "Rate 1–5" },
      action_id: `nudge_rate_${nudgeId}_${section.id}`,
      options: [1, 2, 3, 4, 5].map((n) => ({
        text: { type: "plain_text", text: `${ratings[n - 1]} ${n} — ${ratingLabel(n)}` },
        value: String(n),
      })),
    },
  };
}

function ratingLabel(n: number) {
  return ["Very low", "Low", "Neutral", "Good", "Great"][n - 1];
}

async function slackPost(token: string, method: string, body: object) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Slack ${method} failed: ${data.error}`);
  return data;
}
