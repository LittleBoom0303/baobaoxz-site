import { NextResponse } from "next/server";
import { PLANS } from "@/lib/pay";
import { upsertOrder } from "@/lib/db";
import { wxpayCreateOrder } from "@/lib/wxpay";
import { alipayCreateOrder } from "@/lib/alipay";
import { WXPAY, ALIPAY } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const { plan_id, phone, pay_method } = await request.json();
    const plan = PLANS.find((p) => p.id === plan_id);
    if (!plan) {
      return NextResponse.json({ error: "套餐不存在" }, { status: 400 });
    }

    const order_id = `FLEXI_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const user_id = `user_${phone?.slice(-4) || "0000"}`;
    const description = `Flexichrono ${plan.name}`;

    upsertOrder({
      id: order_id,
      user_id,
      plan_id: plan.id,
      amount: plan.price,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    // 判断支付方式
    const method = pay_method ?? "wechat";

    // 检查是否有真实支付配置
    const hasWxpay = !!(WXPAY.app_id && WXPAY.mch_id && WXPAY.api_key);
    const hasAlipay = !!(
      ALIPAY.app_id && ALIPAY.private_key && ALIPAY.alipay_public_key
    );

    // 微信支付
    if (method === "wechat" && hasWxpay) {
      try {
        const result = await wxpayCreateOrder({
          orderId: order_id,
          amount: plan.price,
          description,
        });
        return NextResponse.json({
          order_id,
          pay_url: result.codeUrl, // 二维码内容（weixin://wxpay/...）
          mode: "wxpay",
        });
      } catch (e: unknown) {
        console.error("[pay/create] wxpay error:", e);
        // fallback 到 mock
      }
    }

    // 支付宝当面付
    if (method === "alipay" && hasAlipay) {
      try {
        const result = await alipayCreateOrder({
          orderId: order_id,
          amount: plan.price,
          description,
        });
        return NextResponse.json({
          order_id,
          pay_url: result.qrCode,
          mode: "alipay",
        });
      } catch (e: unknown) {
        console.error("[pay/create] alipay error:", e);
        // fallback 到 mock
      }
    }

    // Mock 模式（开发环境 / 未配置真实支付时）
    const mockQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(order_id)}`;
    return NextResponse.json({
      order_id,
      pay_url: mockQrUrl,
      mode: "mock",
    });
  } catch (e) {
    console.error("[pay/create]", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
