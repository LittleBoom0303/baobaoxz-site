import { NextResponse } from "next/server";
import { getExpiredMemberships, expireMembership } from "@/lib/db";

export const runtime = "nodejs";

// Vercel Cron: 每天凌晨2点执行
// 配置 vercel.json: { "crons": [{ "path": "/api/cron/expire", "schedule": "0 2 * * *" }] }
const FLEXICHRONO_API = process.env.FLEXICHRONO_API || "http://localhost:8000";
const CALLBACK_SECRET = process.env.MEMBERSHIP_CALLBACK_SECRET || "";

export async function GET() {
  try {
    const expired = getExpiredMemberships();
    let count = 0;
    for (const m of expired) {
      expireMembership(m.user_id);
      // 通知 Flexichrono 后端撤销会员权限
      try {
        await fetch(`${FLEXICHRONO_API}/api/v1/membership/revoke`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-callback-secret": CALLBACK_SECRET,
          },
          body: JSON.stringify({ user_id: m.user_id }),
        });
      } catch (e) {
        // Flexichrono 后端可能不可达，继续处理下一个
        console.error(`[cron] Failed to revoke ${m.user_id} on Flexichrono:`, e);
      }
      count++;
      console.log(`[cron] Expired membership for user ${m.user_id}`);
    }
    return NextResponse.json({ ok: true, expired: count });
  } catch (err) {
    console.error("[cron expire]", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
