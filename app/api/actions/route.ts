import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@auth0/nextjs-auth0";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getCurrentUser();
  if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const actions = await db.managerAction.findMany({
    where: { managerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(actions);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getCurrentUser();
  if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { sectionId, commitment, targetDate } = await req.json();
  if (!sectionId || !commitment?.trim()) {
    return NextResponse.json({ error: "sectionId and commitment required" }, { status: 400 });
  }

  const action = await db.managerAction.create({
    data: {
      managerId: user.id,
      sectionId,
      commitment: commitment.trim(),
      targetDate: targetDate ? new Date(targetDate) : null,
    },
  });

  return NextResponse.json(action, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, resolved } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const action = await db.managerAction.update({
    where: { id },
    data: {
      resolved: resolved ?? true,
      resolvedAt: resolved !== false ? new Date() : null,
    },
  });

  return NextResponse.json(action);
}
