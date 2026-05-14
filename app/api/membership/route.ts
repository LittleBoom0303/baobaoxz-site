import { NextRequest, NextResponse } from "next/server";
import { getMembership } from "@/lib/db";

export const runtime = "nodejs";

// GET /api/membership?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const membership = getMembership(userId);
  if (!membership) {
    return NextResponse.json({ status: "inactive", membership: null });
  }

  // 检查是否过期
  if (membership.status === "active" && membership.expires_at) {
    const expiresAt = new Date(membership.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json({
        status: "expired",
        membership: {
          ...membership,
          status: "expired",
        },
      });
    }
  }

  return NextResponse.json({
    status: membership.status,
    membership: {
      planId: membership.plan_id,
      startedAt: membership.started_at,
      expiresAt: membership.expires_at,
    },
  });
}
