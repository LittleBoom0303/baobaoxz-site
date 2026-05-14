import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, activateMembership, getOrder } from "@/lib/db";
import { getPlan } from "@/lib/pay";
import crypto from "crypto";

export const runtime = "nodejs";

// 支付宝当面付回调
// 文档：https://opendocs.alipay.com/open/194/103296
export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const headers = Object.fromEntries(req.headers.entries());

    // 支付宝回调参数
    const tradeStatus = body.get("trade_status") as string;
    const outTradeNo = body.get("out_trade_no") as string;
    const tradeNo = body.get("trade_no") as string;

    // 只处理支付成功
    if (tradeStatus !== "TRADE_SUCCESS" && tradeStatus !== "TRADE_FINISHED") {
      return new NextResponse("fail");
    }

    if (!outTradeNo) {
      return new NextResponse("fail");
    }

    // TODO: 验签（商户号到位后实现）
    // const signType = body.get('sign_type');
    // const signature = body.get('sign');
    // const alipayPublicKey = process.env.ALIPAY_PUBLIC_KEY;
    // const verified = AlipaySDK.verifySign(body, alipayPublicKey);

    // 查找订单
    const order = getOrder(outTradeNo);
    if (!order) {
      return new NextResponse("fail");
    }

    if (order.status === "paid") {
      return new NextResponse("success");
    }

    // 更新订单状态
    updateOrderStatus(outTradeNo, "paid");

    // 激活会员
    const plan = getPlan(order.product_id);
    if (plan) {
      activateMembership(order.user_id, order.product_id, plan.days);
    }

    console.log(`[alipay callback] Order ${outTradeNo} paid, membership activated for user ${order.user_id}`);
    return new NextResponse("success");
  } catch (err) {
    console.error("[alipay callback]", err);
    return new NextResponse("fail");
  }
}
