import { NextRequest, NextResponse } from "next/server";
import { getOrder, getMembership } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, userId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 安全：校验userId匹配
    if (userId && order.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 返回订单状态
    const response: Record<string, unknown> = {
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      createdAt: order.created_at,
    };

    // 订单已支付，返回会员信息
    if (order.status === "paid") {
      const membership = getMembership(order.user_id);
      response.fulfillmentState = "fulfilled";
      response.membership = membership
        ? {
            status: membership.status,
            planId: membership.plan_id,
            expiresAt: membership.expires_at,
          }
        : null;
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error("[pay/poll]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
