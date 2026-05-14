import { NextResponse } from "next/server";
import { getOrder, upsertOrder, upsertMembership } from "@/lib/db";
import { PLANS } from "@/lib/pay";
import { FLEXICHRONO_API, MEMBERSHIP_CALLBACK_SECRET } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[alipay callback]", body);

    const { out_trade_no, trade_status, trade_no } = body;
    if (!out_trade_no) {
      return NextResponse.json({ error: "缺少订单号" }, { status: 400 });
    }

    // TRADE_SUCCESS 表示支付成功
    if (trade_status !== "TRADE_SUCCESS") {
      return NextResponse.json({ ok: true }); // 等待中
    }

    const order = getOrder(out_trade_no) as { user_id: string; plan_id: string; status: string } | undefined;
    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    if (order.status !== "paid") {
      upsertOrder({ ...order, status: "paid", paid_at: new Date().toISOString() });

      const plan = PLANS.find((p) => p.id === order.plan_id) ?? PLANS[0];
      const starts_at = new Date();
      const expires_at = new Date(starts_at.getTime() + plan.periodDays * 24 * 60 * 60 * 1000);
      upsertMembership({
        user_id: order.user_id,
        plan_id: plan.id,
        status: "active",
        starts_at: starts_at.toISOString(),
        expires_at: expires_at.toISOString(),
      });

      try {
        await fetch(`${FLEXICHRONO_API}/api/v1/membership/grant`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-callback-secret": MEMBERSHIP_CALLBACK_SECRET,
          },
          body: JSON.stringify({ user_id: order.user_id, plan: plan.id, expires_at: expires_at.toISOString() }),
        });
      } catch (e) {
        console.error("[alipay] Flexichrono grant failed:", e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[alipay callback error]", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
