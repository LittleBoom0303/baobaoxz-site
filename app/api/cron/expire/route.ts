import { NextResponse } from "next/server";
import { getExpiredMemberships, upsertMembership } from "@/lib/db";
import { FLEXICHRONO_API, MEMBERSHIP_CALLBACK_SECRET } from "@/lib/config";

export async function GET() {
  try {
    const expired = getExpiredMemberships() as Array<{ user_id: string; plan_id: string; expires_at: string }>;
    console.log(`[cron/expire] Found ${expired.length} expired memberships`);
    let count = 0;
    for (const m of expired) {
      // 更新本地状态
      upsertMembership({ ...m, status: "expired", starts_at: m.expires_at });
      // 通知 Flexichrono 撤销会员
      try {
        await fetch(`${FLEXICHRONO_API}/api/v1/membership/revoke`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-callback-secret": MEMBERSHIP_CALLBACK_SECRET,
          },
          body: JSON.stringify({ user_id: m.user_id }),
        });
      } catch (e) {
        console.error(`[cron/expire] Revoke failed for ${m.user_id}:`, e);
      }
      count++;
    }
    return NextResponse.json({ expired_count: count, timestamp: new Date().toISOString() });
  } catch (e) {
    console.error("[cron/expire] Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
