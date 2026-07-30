import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // "given" | "received"

  const feedback = await db.feedback.findMany({
    where: type === "given" ? { giverId: user.id } : { receiverId: user.id },
    include: {
      giver: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    feedback.map((f) => ({
      ...f,
      giver: f.isAnonymous ? null : f.giver,
    }))
  );
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { receiverId, message, isAnonymous, category } = await req.json();
    if (!receiverId || !message) {
      return NextResponse.json({ error: "receiverId and message required" }, { status: 400 });
    }

    const feedback = await db.feedback.create({
      data: {
        giverId: user.id,
        receiverId,
        message,
        isAnonymous: isAnonymous ?? false,
        category,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
