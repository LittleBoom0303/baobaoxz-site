import { NextResponse } from "next/server";
import { getOrder, upsertOrder, upsertMembership } from "@/lib/db";
import { PLANS } from "@/lib/pay";
import { FLEXICHRONO_API, MEMBERSHIP_CALLBACK_SECRET } from "@/lib/config";

export async function POST(request: Request) {
  try {
    // 微信支付回调（XML 格式）
    const xmlBody = await request.text();
    console.log("[wxpay callback]", xmlBody);

    // 解析微信回调 XML（简化版，实际生产需验签）
    const getField = (xml: string, field: string) => {
      const m = xml.match(new RegExp(`<${field}><!\\[CDATA\\[(.*?)\\]\\]></${field}>`));
      return m ? m[1] : xml.match(new RegExp(`<${field}>(.*?)</${field}>`))?.[1] ?? "";
    };

    const return_code = getField(xmlBody, "return_code");
    if (return_code !== "SUCCESS") {
      return new NextResponse("<xml><return_code>FAIL</return_code></xml>", { headers: { "Content-Type": "text/xml" } });
    }

    const out_trade_no = getField(xmlBody, "out_trade_no");
    const trade_state = getField(xmlBody, "trade_state");

    if (trade_state !== "SUCCESS") {
      return new NextResponse("<xml><return_code>SUCCESS</return_code></xml>", { headers: { "Content-Type": "text/xml" } });
    }

    // 更新订单状态
    const order = getOrder(out_trade_no) as { user_id: string; plan_id: string; status: string } | undefined;
    if (!order) {
      return new NextResponse("<xml><return_code>FAIL</return_code><return_msg>Order not found</return_msg></xml>", { headers: { "Content-Type": "text/xml" } });
    }
    if (order.status !== "paid") {
      upsertOrder({ ...order, status: "paid", paid_at: new Date().toISOString() } as Parameters<typeof upsertOrder>[0]);

      // 开通会员
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

      // 通知 Flexichrono 后端
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
        console.error("[wxpay] Flexichrono grant failed:", e);
      }
    }

    return new NextResponse("<xml><return_code>SUCCESS</return_code></xml>", { headers: { "Content-Type": "text/xml" } });
  } catch (e) {
    console.error("[wxpay callback error]", e);
    return new NextResponse("<xml><return_code>FAIL</return_code></xml>", { headers: { "Content-Type": "text/xml" } });
  }
}
