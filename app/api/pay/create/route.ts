import { NextResponse } from "next/server";
import { PLANS } from "@/lib/pay";
import { upsertOrder } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { plan_id, phone } = await request.json();
    const plan = PLANS.find((p) => p.id === plan_id);
    if (!plan) {
      return NextResponse.json({ error: "套餐不存在" }, { status: 400 });
    }
    const order_id = `FLEXI_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const user_id = `user_${phone?.slice(-4) || "0000"}`;
    upsertOrder({
      id: order_id,
      user_id,
      plan_id: plan.id,
      amount: plan.price,
      status: "pending",
      created_at: new Date().toISOString(),
    });
    return NextResponse.json({ order_id, qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(order_id)}` });
  } catch (e) {
    console.error("[pay/create]", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
