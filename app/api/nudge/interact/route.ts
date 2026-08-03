import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  // Verify Slack signature
  const signingSecret = process.env.SLACK_SIGNING_SECRET ?? "";
  const rawBody = await req.text();
  const timestamp = req.headers.get("x-slack-request-timestamp") ?? "";
  const slackSig = req.headers.get("x-slack-signature") ?? "";

  const baseString = `v0:${timestamp}:${rawBody}`;
  const hmac = crypto.createHmac("sha256", signingSecret).update(baseString).digest("hex");
  const expected = `v0=${hmac}`;

  if (!signingSecret.startsWith("your") && !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(slackSig))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const params = new URLSearchParams(rawBody);
  const payload = JSON.parse(params.get("payload") ?? "{}");

  if (payload.type !== "block_actions") {
    return new NextResponse("ok");
  }

  for (const action of payload.actions ?? []) {
    // action_id format: nudge_rate_{nudgeId}_{sectionId}
    const match = action.action_id?.match(/^nudge_rate_(.+)_([a-z]+)$/);
    if (!match) continue;

    const [, nudgeId, sectionId] = match;
    const slackUserId = payload.user?.id;
    const rating = parseInt(action.selected_option?.value ?? "0", 10);

    if (!slackUserId || !nudgeId || !sectionId || isNaN(rating)) continue;

    const user = await db.user.findFirst({ where: { slackUserId } });
    if (!user) continue;

    await db.nudgeReply.upsert({
      where: { nudgeId_userId_sectionId: { nudgeId, userId: user.id, sectionId } },
      create: { nudgeId, userId: user.id, sectionId, rating },
      update: { rating },
    });
  }

  // Acknowledge immediately (Slack requires response within 3s)
  return NextResponse.json({ response_action: "clear" });
}
