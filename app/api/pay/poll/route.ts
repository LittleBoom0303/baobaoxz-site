import { NextResponse } from "next/server";
import { getOrder } from "@/lib/db";
import { wxpayQueryOrder } from "@/lib/wxpay";
import { alipayQueryOrder } from "@/lib/alipay";
import { WXPAY, ALIPAY } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const { order_id } = await request.json();
    if (!order_id) return NextResponse.json({ error: "缺少订单号" }, { status: 400 });

    const order = getOrder(order_id as string);
    if (!order) return NextResponse.json({ status: "pending" });

    // 已支付
    if ((order as { status: string }).status === "paid") {
      return NextResponse.json({ status: "paid" });
    }

    // Mock 模式轮询（直接返回 pending，等回调）
    if (WXPAY.app_id && WXPAY.mch_id && WXPAY.api_key) {
      // 微信支付真实查询
      try {
        const result = await wxpayQueryOrder(order_id as string);
        if (result.tradeState === "SUCCESS") {
          return NextResponse.json({ status: "paid" });
        }
        return NextResponse.json({ status: (order as { status: string }).status });
      } catch {
        return NextResponse.json({ status: (order as { status: string }).status });
      }
    }

    if (ALIPAY.app_id && ALIPAY.private_key && ALIPAY.alipay_public_key) {
      // 支付宝真实查询
      try {
        const result = await alipayQueryOrder(order_id as string);
        if (result.tradeStatus === "TRADE_SUCCESS" || result.tradeStatus === "TRADE_FINISHED") {
          return NextResponse.json({ status: "paid" });
        }
        return NextResponse.json({ status: (order as { status: string }).status });
      } catch {
        return NextResponse.json({ status: (order as { status: string }).status });
      }
    }

    // Mock 模式：轮询等待回调
    return NextResponse.json({ status: (order as { status: string }).status });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
