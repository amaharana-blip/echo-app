import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const manager = await requireRole("MANAGER");

    const team = await db.team.findFirst({
      where: { managerId: manager.id },
      include: {
        members: {
          select: { id: true, name: true, email: true, role: true, slackUserId: true },
        },
      },
    });

    return NextResponse.json(team);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
