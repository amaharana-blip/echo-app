import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    if (user.role !== "MANAGER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const pulseToken = await db.pulseToken.create({
      data: { managerId: user.id, expiresAt },
    });

    return NextResponse.json({ token: pulseToken.token });
  } catch (err) {
    console.error("[pulse/token POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
