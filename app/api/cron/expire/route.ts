import { NextResponse } from "next/server";
import { getExpiredMemberships, expireMembership } from "@/lib/db";

export const runtime = "nodejs";

// Vercel Cron: 每天凌晨2点执行
// 配置 vercel.json: { "crons": [{ "path": "/api/cron/expire", "schedule": "0 2 * * *" }] }
export async function GET() {
  try {
    const expired = getExpiredMemberships();
    let count = 0;
    for (const m of expired) {
      expireMembership(m.user_id);
      count++;
      console.log(`[cron] Expired membership for user ${m.user_id}`);
    }
    return NextResponse.json({ ok: true, expired: count });
  } catch (err) {
    console.error("[cron expire]", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
