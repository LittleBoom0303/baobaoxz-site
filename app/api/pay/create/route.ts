import { NextRequest, NextResponse } from "next/server";
import { getOrder, createOrder, getOrCreateUser } from "@/lib/db";
import { generateOrderId, generateAnonUserId, getPlan } from "@/lib/pay";
import { WXPAY_CONFIG, ALIPAY_CONFIG } from "@/lib/config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, method, userId: clientUserId } = body;

    // 验证套餐
    const plan = getPlan(planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // 验证支付方式
    if (!["wechat", "alipay", "paypal"].includes(method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    // 确定用户
    const userId = clientUserId || generateAnonUserId();
    getOrCreateUser(userId);

    // 生成订单
    const orderId = generateOrderId();
    const currency = method === "paypal" ? "USD" : "CNY";
    const amount = method === "paypal" ? (plan.price * 0.14).toFixed(2) : plan.price.toFixed(2);

    // TODO: 实际调起微信/支付宝支付，获取二维码URL
    // 商户号到位后实现：
    // if (method === 'wechat') -> WXPAY native API -> qrUrl
    // if (method === 'alipay') -> Alipay当面付 -> qrCode
    // 目前返回mock

    const qrUrls = {
      wechat: method === "wechat" ? null : null, // TODO
      alipay: method === "alipay" ? null : null, // TODO
    };

    createOrder({
      id: orderId,
      user_id: userId,
      product_id: planId,
      method,
      amount: parseFloat(amount),
      currency,
      status: "pending",
      wxpay_qr_url: qrUrls.wechat,
      alipay_qr_url: qrUrls.alipay,
    });

    return NextResponse.json({
      orderId,
      amount: parseFloat(amount),
      currency,
      status: "pending",
      qrUrl: null, // TODO
      plan: {
        id: plan.id,
        name: plan.name,
        days: plan.days,
      },
    });
  } catch (err) {
    console.error("[pay/create]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
