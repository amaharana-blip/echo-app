import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { giverSlackId, receiverSlackId, message, category, isAnonymous } = await req.json();

  const [giver, receiver] = await Promise.all([
    db.user.findFirst({ where: { slackUserId: giverSlackId } }),
    db.user.findFirst({ where: { slackUserId: receiverSlackId } }),
  ]);

  if (!giver || !receiver) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const feedback = await db.feedback.create({
    data: {
      giverId: giver.id,
      receiverId: receiver.id,
      message,
      category,
      isAnonymous: isAnonymous ?? false,
    },
  });

  return NextResponse.json(feedback, { status: 201 });
}
