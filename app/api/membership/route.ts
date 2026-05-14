import { NextResponse } from "next/server";
import { getMembership } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    if (!user_id) return NextResponse.json({ error: "缺少 user_id" }, { status: 400 });
    const m = getMembership(user_id as string);
    if (!m) return NextResponse.json({ hasMembership: false, plan: null, expiresAt: null });
    const mr = m as { status: string; plan_id: string; expires_at: string };
    return NextResponse.json({
      hasMembership: mr.status === "active",
      plan: mr.plan_id,
      expiresAt: mr.expires_at,
    });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
