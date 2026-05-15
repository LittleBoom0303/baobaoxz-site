"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PLANS } from "@/lib/pay";

function mockQrUrl(orderId: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`FLEXI_${orderId}`)}`;
}

const PAY_METHODS = [
  {
    id: "wechat" as const,
    label: "微信支付",
    desc: "推荐",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#07c160">
        <path d="M8.5 11.5a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm-6 4c-2.5 0-4.71 1.28-6 3.22.03-3.77 1.41-6.7 3.13-8.72C4.53 7.32 9.42 6.5 12 8c.65.38 1.35 1 2 1.5V11c-.94-.39-1.75-.77-2.5-1.09A6.4 6.4 0 006.5 15.5zm9 0c-.56 0-1.12.1-1.64.29-.27-1.1-.78-2.1-1.49-2.97-.54.46-1.05.93-1.52 1.39A6.08 6.08 0 016 16c0 1.07.28 2.08.78 2.97C5.1 20.02 4.03 21 2.77 21c-.26 0-.5-.1-.7-.28-.2.16-.4.25-.65.25-.35 0-.66-.28-.95-.53-.75-.65-1.35-1.47-1.35-2.44 0-.97.6-1.79 1.35-2.44C2.07 17.07 3.53 16 5.22 16c1.26 0 2.33.98 3.56 1.97.5.4 1 .78 1.47 1.16.7-.83 1.23-1.8 1.53-2.87A5.42 5.42 0 0115.5 15.5zm-6 1.5c-.56 0-1.12.1-1.64.29-.27-1.1-.78-2.1-1.49-2.97a22 22 0 01-3.02 2.77C4.1 18.02 5.03 19 6.28 19c.26 0 .5-.1.7-.28.2.16.4.25.65.25.35 0 .66-.28.95-.53C9.58 17.5 10.53 17 10.53 16c0-.5-.3-.91-.67-1.22-.47.46-1 .97-1.53 1.44-.24-.25-.55-.53-.88-.75A4.4 4.4 0 016 13.5c0 1.05.37 2.01 1 2.76.5.6 1.2 1.04 2 1.26a6.4 6.4 0 01-5.28-3.02 6.4 6.4 0 016.28 4.02c.24.03.47.06.71.06a6.4 6.4 0 01-5.26-3.02 6.4 6.4 0 016.28 4.02c.24.03.47.06.71.06 1.23 0 2.34-.47 3.19-1.25A3.3 3.3 0 0016 16c0-1.05-.37-2.01-1-2.76-.5-.6-1.2-1.04-2-1.26a6.4 6.4 0 015.28 3.02c-.5.6-1.2 1.04-2 1.26-.5.14-1.03.22-1.57.22z"/>
      </svg>
    ),
  },
  {
    id: "alipay" as const,
    label: "支付宝",
    desc: "推荐",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#1677ff">
        <path d="M19.5 14c1.1 0 2 .9 2 2v1c0 .55-.22 1.05-.59 1.41L18.5 21H15v-1.5l2.41-2.42A1.993 1.993 0 0016 15.5V14c0-1.1.9-2 2-2h1.5v-1c0-2.76-2.24-5-5-5H8.5V6.5h3c1.65 0 3 1.35 3 3H8.5V8H6c-2.21 0-4 1.79-4 4v1c0 2.21 1.79 4 4 4h1.5v1.5H6v1h14.5v-1.5H19.5v-1c0-1.1-.9-2-2-2h-1V8h1.5c2.76 0 5 2.24 5 5v1H19.5V14zM8.5 17H6c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h2.5v5z"/>
      </svg>
    ),
  },
];

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [payMethod, setPayMethod] = useState<"wechat" | "alipay">("wechat");
  const [step, setStep] = useState<"form" | "qrcode" | "paid">("form");
  const [orderId, setOrderId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [payLoading, setPayLoading] = useState(false);
  const [pollTimer, setPollTimer] = useState<ReturnType<typeof setInterval> | null>(null);

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

  const canSubmit = phone.length === 11 && code.length === 6;

  const startPayment = async () => {
    if (!canSubmit) return;
    setPayLoading(true);
    try {
      const res = await fetch("/api/pay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: selectedPlan.id, phone, pay_method: payMethod }),
      });
      const data = await res.json();
      const oid = data.order_id || `ORDER_${Date.now()}`;
      setOrderId(oid);
      const url = data.pay_url || mockQrUrl(oid);
      setQrUrl(url);
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

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#1d1d1f]">
      <Navbar />
      <div className="max-w-[520px] mx-auto px-0 pt-16 pb-8">

        {/* Page header */}
        <div className="bg-white px-5 py-5 mb-1">
          <h1 className="text-[22px] font-semibold text-[#333]">开通会员</h1>
          <p className="text-[13px] color-[#999] mt-1">解锁 Flexichrono 全部高级功能</p>
        </div>

        {step === "form" && (
          <>
            {/* Plans */}
            <div className="bg-white mt-1">
              <div className="wechat-section-title">选择套餐</div>
              <div className="p-3 space-y-2">
                {PLANS.map((plan, i) => (
                  <div
                    key={plan.id}
                    className={`wechat-plan-card ${selectedPlan.id === plan.id ? "selected" : ""}`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="check-circle" />
                    <div className="plan-info">
                      <div className="plan-name">
                        {plan.name}
                        {plan.badge && (
                          <span className="wechat-plan-badge">{plan.badge}</span>
                        )}
                      </div>
                      <div className="plan-desc">{plan.periodLabel}</div>
                    </div>
                    <div className="plan-price">
                      <div className="amount">{plan.price}</div>
                      {(i === 0 || i === 1) && (
                        <div className="original">¥{i === 0 ? "9.9" : "29.7"}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pay method */}
            <div className="bg-white mt-1">
              <div className="wechat-section-title">支付方式</div>
              <div className="divide-y divide-[#e5e5e5]">
                {PAY_METHODS.map((m) => (
                  <div
                    key={m.id}
                    className={`wechat-pay-row ${payMethod === m.id ? "selected" : ""}`}
                    onClick={() => setPayMethod(m.id)}
                  >
                    <div className="pay-icon">{m.icon}</div>
                    <div className="flex-1">
                      <div className="plan-name">{m.label}</div>
                      {m.desc && <div className="pay-desc">{m.desc}</div>}
                    </div>
                    <div className="radio-circle" />
                  </div>
                ))}
              </div>
            </div>

            {/* Phone + Code — WeChat style inline row */}
            <div className="bg-white mt-1">
              <div className="wechat-section-title">验证手机号</div>
              <div className="wechat-input-row">
                <span className="label">手机号</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="请输入手机号"
                  maxLength={11}
                  className="input"
                />
              </div>
              <div className="wechat-input-row">
                <span className="label">验证码</span>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="请输入验证码"
                  maxLength={6}
                  className="input"
                />
                <button
                  className="btn-inline"
                  onClick={sendCode}
                  disabled={codeLoading || !phone || phone.length !== 11 || countdown > 0}
                >
                  {countdown > 0 ? `${countdown}s` : "获取验证码"}
                </button>
              </div>
              <div className="px-4 py-2 text-[12px] color-[#bbbbbb]">
                演示模式：任意6位数字即可
              </div>
            </div>

            {/* Confirm button */}
            <div className="px-4 mt-4">
              <button
                className="wechat-btn-primary"
                onClick={startPayment}
                disabled={payLoading || !canSubmit}
              >
                {payLoading ? "跳转支付..." : `确认支付 ¥${selectedPlan.price}`}
              </button>
            </div>

            {/* Security note */}
            <div className="text-center mt-4 text-[12px] color-[#bbbbbb]">
              支付安全由微信/支付宝提供保障
            </div>
          </>
        )}

        {step === "qrcode" && (
          <div className="bg-white mt-1 px-5 py-6 text-center">
            <div className="text-[17px] font-medium text-[#333] mb-1">
              请扫码支付
            </div>
            <div className="text-[13px] color-[#999] mb-5">
              扫码支付 <span className="text-[#07c160] font-medium">¥{selectedPlan.price}</span>
            </div>

            <div className="qr-container mx-auto mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="支付二维码" width={180} height={180} className="block" />
            </div>

            <div className="flex items-center justify-center gap-6 text-[13px] color-[#999] mb-6">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#07c160] inline-block animate-pulse" />
                等待支付
              </div>
              <div>订单号 {orderId.slice(0, 16)}...</div>
            </div>

            <div className="text-[12px] color-[#bbbbbb] mb-4">
              {payMethod === "wechat" ? "请用微信扫一扫" : "请用支付宝扫一扫"}，支付成功后自动开通
            </div>

            <button
              className="wechat-btn-secondary"
              onClick={() => {
                if (pollTimer) clearInterval(pollTimer);
                setStep("form");
              }}
            >
              返回重新选择
            </button>
          </div>
        )}

        {step === "paid" && (
          <div className="bg-white mt-1 px-5 py-10 text-center">
            <div className="success-checkmark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="text-[20px] font-semibold text-[#333] mb-2">支付成功</div>
            <div className="text-[14px] color-[#666] mb-1">
              您已成为 {selectedPlan.name}
            </div>
            <div className="text-[13px] color-[#999] mb-8">
              有效期 {selectedPlan.periodLabel}，会员权益已开通
            </div>
            <div className="space-y-3 px-4">
              <Link href="/membership" className="wechat-btn-primary block">
                查看会员状态
              </Link>
              <Link href="/" className="wechat-btn-secondary block">
                返回首页
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
