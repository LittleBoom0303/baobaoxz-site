"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PLANS } from "@/lib/pay";

function mockQrUrl(orderId: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`FLEXI_${orderId}`)}`;
}

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]); // 默认季度
  const [payMethod, setPayMethod] = useState<"wechat" | "alipay" | "paypal">("wechat");
  const [step, setStep] = useState<"form" | "qrcode" | "paid">("form");
  const [orderId, setOrderId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [payLoading, setPayLoading] = useState(false);
  const [pollTimer, setPollTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const [payMode, setPayMode] = useState<"mock" | "wxpay" | "alipay" | "">("");

  useEffect(() => {
    return () => { if (pollTimer) clearInterval(pollTimer); };
  }, [pollTimer]);

  const sendCode = async () => {
    if (!phone || phone.length !== 11) return;
    setCodeLoading(true);
    try {
      await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      setCountdown(60);
    } finally {
      setCodeLoading(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const startPayment = async () => {
    if (!phone || phone.length !== 11 || !code || code.length !== 6) return;
    setPayLoading(true);
    try {
      const res = await fetch("/api/pay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          phone,
          pay_method: payMethod,
        }),
      });
      const data = await res.json();
      const oid = data.order_id || `ORDER_${Date.now()}`;
      setOrderId(oid);
      setPayMode(data.mode ?? "mock");

      // pay_url 可能是 weixin://...（微信 Native）或者 https URL（支付宝/二维码）
      // 如果是 weixin:// 开头的，需要特殊处理
      const url = data.pay_url ?? mockQrUrl(oid);
      setQrUrl(url);

      // 判断是否需要展示二维码（微信支付 weixin:// 协议手机端直接调起 PC 不行，用 API 二维码展示）
      // 但 wxpayCreateOrder 返回的 code_url 就是 weixin://wxpay/bizpayurl?pr=xxx
      // 微信 H5 页面无法扫码调起，此处展示一个中间页提示用户用微信扫码
      setStep("qrcode");

      const timer = setInterval(async () => {
        try {
          const pollRes = await fetch("/api/pay/poll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: oid }),
          });
          const pollData = await pollRes.json();
          if (pollData.status === "paid") {
            clearInterval(timer);
            setStep("paid");
          }
        } catch { /* ignore */ }
      }, 3000);
      setPollTimer(timer);
    } finally {
      setPayLoading(false);
    }
  };

  const planIndex = PLANS.findIndex((p) => p.id === selectedPlan.id);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-semibold tracking-tight mb-3">订阅会员</h1>
          <p className="text-lg text-neutral-500">解锁全部功能，用自己的声音和 AI 对话</p>
        </div>

        {step === "form" && (
          <>
            {/* 套餐选择 */}
            <div className="space-y-3 mb-7">
              {PLANS.map((plan, i) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
                    selectedPlan.id === plan.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plan"
                        checked={selectedPlan.id === plan.id}
                        onChange={() => setSelectedPlan(plan)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold">{plan.name}</span>
                          {plan.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-medium">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-neutral-500">{plan.periodLabel}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold">¥{plan.price}</div>
                      {i === 0 && (
                        <div className="text-xs text-neutral-400 line-through">¥29.7</div>
                      )}
                      {i === 1 && (
                        <div className="text-xs text-neutral-400 line-through">¥29.7×3</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 支付方式 */}
            <div className="mb-6">
              <div className="text-sm font-medium text-neutral-500 mb-3">选择支付方式</div>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: "wechat", label: "微信支付", icon: "💬" },
                  { id: "alipay", label: "支付宝", icon: "💙" },
                  { id: "paypal", label: "PayPal", icon: "🔵" },
                ] as const).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition text-sm ${
                      payMethod === m.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 手机号 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">手机号</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="请输入 11 位手机号"
                maxLength={11}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-base outline-none focus:border-blue-500"
              />
            </div>

            {/* 验证码 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">验证码</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6 位验证码"
                  maxLength={6}
                  className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 text-base outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendCode}
                  disabled={codeLoading || !phone || phone.length !== 11 || countdown > 0}
                  className="px-4 py-3 rounded-xl bg-neutral-100 text-neutral-600 text-sm font-medium whitespace-nowrap disabled:opacity-40 hover:bg-neutral-200 transition"
                >
                  {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                </button>
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">演示模式：任意 6 位数字即可</p>
            </div>

            <button
              onClick={startPayment}
              disabled={payLoading || !phone || !code}
              className="w-full py-4 rounded-full bg-blue-600 text-white text-lg font-medium disabled:opacity-50 hover:bg-blue-700 transition"
            >
              {payLoading ? "跳转支付..." : `确认支付 ¥${selectedPlan.price}`}
            </button>
          </>
        )}

        {step === "qrcode" && (
          <div className="text-center py-4">
            <h2 className="text-2xl font-semibold mb-1">请扫码支付</h2>
            <p className="text-neutral-500 mb-6">
              {payMethod === "wechat" ? "微信" : payMethod === "alipay" ? "支付宝" : "PayPal"} 扫码支付{" "}
              <span className="font-semibold text-blue-600">¥{selectedPlan.price}</span>
            </p>

            {payMethod === "wechat" ? (
              <div>
                <div className="inline-block p-5 bg-white rounded-2xl border border-neutral-100 shadow-sm mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="微信支付二维码" width={200} height={200} className="mx-auto" />
                </div>
                <p className="text-sm text-neutral-500 mb-1">请用微信扫一扫</p>
                <p className="text-xs text-neutral-400 mb-5">
                  支付成功后页面将自动跳转
                </p>
              </div>
            ) : payMethod === "alipay" ? (
              <div>
                <div className="inline-block p-5 bg-white rounded-2xl border border-neutral-100 shadow-sm mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="支付宝支付二维码" width={200} height={200} className="mx-auto" />
                </div>
                <p className="text-sm text-neutral-500 mb-1">请用支付宝扫一扫</p>
                <p className="text-xs text-neutral-400 mb-5">
                  支付成功后页面将自动跳转
                </p>
              </div>
            ) : (
              <div>
                <p className="text-neutral-500 mb-4">请完成 PayPal 支付后点击下方按钮</p>
                <a
                  href={qrUrl}
                  className="inline-block py-3 px-8 rounded-full bg-blue-600 text-white font-medium"
                >
                  前往 PayPal 支付
                </a>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-neutral-400 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              等待支付...
            </div>

            <div className="text-xs text-neutral-400 mb-5">
              订单号：{orderId}
            </div>

            <button
              onClick={() => { if (pollTimer) clearInterval(pollTimer); setStep("form"); }}
              className="text-sm text-neutral-500 underline hover:text-neutral-700"
            >
              返回重新选择支付方式
            </button>
          </div>
        )}

        {step === "paid" && (
          <div className="text-center py-10">
            <div className="text-6xl mb-5">🎉</div>
            <h2 className="text-3xl font-semibold mb-3">支付成功！</h2>
            <p className="text-neutral-500 mb-2">
              您已成为 {selectedPlan.name}，有效期 {selectedPlan.periodLabel}
            </p>
            <p className="text-sm text-neutral-400 mb-10">会员权益已开通，可前往 App 使用全部功能</p>
            <Link
              href="/membership"
              className="block w-full py-3.5 rounded-full bg-blue-600 text-white font-medium text-lg hover:bg-blue-700 transition"
            >
              查看会员状态
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
