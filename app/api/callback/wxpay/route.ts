import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, activateMembership, getOrder } from "@/lib/db";
import { getPlan } from "@/lib/pay";
import crypto from "crypto";

export const runtime = "nodejs";

// 微信支付回调
// 文档：https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_5.shtml
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headers = Object.fromEntries(req.headers.entries());
    const signature = headers["x-vercel-signature"] || headers["wechatpay-signature"];

    // TODO: 验签（商户号到位后实现）
    // const verifySign = (body: string, signature: string) => {
    //   const mchId = process.env.WXPAY_MCH_ID;
    //   const apiKey = process.env.WXPAY_API_KEY;
    //   const nonce = headers['wechatpay-nonce'];
    //   const timestamp = headers['wechatpay-timestamp'];
    //   const serial = headers['wechatpay-serial'];
    //   const msg = `${timestamp}\n${nonce}\n${body}\n`;
    //   // 用平台证书公钥验签
    // };

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(body);
    } catch {
      // 微信支付v3可能使用XML
      payload = parseXml(body);
    }

    // 只处理支付成功事件
    const eventType = (payload.event_type as string) || ((payload.msg as Record<string, unknown>) || {}).event_type as string || "";
    if (eventType !== "TRANSACTION.SUCCESS" && payload.result_code !== "SUCCESS") {
      return NextResponse.json({ code: "FAIL", message: "Not a success event" });
    }

    const orderNo = (payload.order_id || payload.out_trade_no || payload.transaction_id) as string;
    if (!orderNo) {
      return NextResponse.json({ code: "FAIL", message: "No order number" });
    }

    // 找到订单
    const order = getOrder(orderNo);
    if (!order) {
      return NextResponse.json({ code: "FAIL", message: "Order not found" });
    }

    if (order.status === "paid") {
      return NextResponse.json({ code: "SUCCESS", message: "Already processed" });
    }

    // 更新订单状态
    updateOrderStatus(orderNo, "paid");

    // 激活会员
    const plan = getPlan(order.product_id);
    if (plan) {
      activateMembership(order.user_id, order.product_id, plan.days);
    }

    console.log(`[wxpay callback] Order ${orderNo} paid, membership activated for user ${order.user_id}`);
    return NextResponse.json({ code: "SUCCESS", message: "OK" });
  } catch (err) {
    console.error("[wxpay callback]", err);
    return NextResponse.json({ code: "FAIL", message: "Internal error" });
  }
}

function parseXml(xml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const regex = /<(\w+)><!\[CDATA\[([^\]]*)\]\]><\/\1>|<(\w+)>([^<]*)<\/\3>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const key = match[1] || match[3];
    const value = match[2] || match[4];
    result[key] = value;
  }
  return result;
}
