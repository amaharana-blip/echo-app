import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { rating, category, message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Store as a Case with category TOOL_FEEDBACK so it appears in manager view
    await db.case.create({
      data: {
        reporterId: user?.id ?? (await getOrCreateAnon(db)),
        title: `Tool Feedback — ${category ?? "General"}`,
        description: `Rating: ${rating ?? "n/a"}/5\n\n${message.trim()}`,
        category: "TOOL_FEEDBACK",
        priority: "LOW",
        status: "OPEN",
        isAnonymous: true,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[tool-feedback]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getOrCreateAnon(db: any) {
  const anon = await db.user.findFirst({ where: { email: "anon@echo.internal" } });
  if (anon) return anon.id;
  const created = await db.user.create({
    data: { auth0Id: "anon-tool-feedback", email: "anon@echo.internal", name: "Anonymous", role: "EMPLOYEE" },
  });
  return created.id;
}
