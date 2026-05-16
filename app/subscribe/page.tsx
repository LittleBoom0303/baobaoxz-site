"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { PLANS } from "@/lib/pay";

function mockQrUrl(orderId: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`FLEXI_${orderId}`)}`;
}

const PAY_METHODS = [
  {
    id: "wechat" as const,
    label: "微信支付",
    desc: "推荐",
    color: "#07c160",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#07c160">
        <path d="M8.5 11.5a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm-6 4c-2.5 0-4.71 1.28-6 3.22.03-3.77 1.41-6.7 3.13-8.72C4.53 7.32 9.42 6.5 12 8c.65.38 1.35 1 2 1.5V11c-.94-.39-1.75-.77-2.5-1.09A6.4 6.4 0 006.5 15.5zm9 0c-.56 0-1.12.1-1.64.29-.27-1.1-.78-2.1-1.49-2.97-.54.46-1.05.93-1.52 1.39A6.08 6.08 0 016 16c0 1.07.28 2.08.78 2.97C5.1 20.02 4.03 21 2.77 21c-.26 0-.5-.1-.7-.28.2.16.4.25.65.25.35 0 .66-.28.95-.53.75-.65 1.35-1.47 1.35-2.44 0-.97-.6-1.79-1.35-2.44C2.07 17.07 3.53 16 5.22 16c1.26 0 2.33.98 3.56 1.97.5.4 1 .78 1.47 1.16.7-.83 1.23-1.8 1.53-2.87A5.42 5.42 0 0115.5 15.5zm-6 1.5c-.56 0-1.12.1-1.64.29-.27-1.1-.78-2.1-1.49-2.97-.54.46-1.05.93-1.52 1.39A6.08 6.08 0 016 16c0 1.07.28 2.08.78 2.97C5.1 20.02 4.03 21 2.77 21c-.26 0-.5-.1-.7-.28.2.16.4.25.65.25.35 0 .66-.28.95-.53C9.58 17.5 10.53 17 10.53 16c0-.5-.3-.91-.67-1.22-.47.46-1 .97-1.53 1.44-.24-.25-.55-.53-.88-.75A4.4 4.4 0 016 13.5c0 1.05.37 2.01 1 2.76.5.6 1.2 1.04 2 1.26a6.4 6.4 0 01-5.26-3.02 6.4 6.4 0 016.28 4.02c.24.03.47.06.71.06 1.23 0 2.34-.47 3.19-1.25A3.3 3.3 0 0016 16c0-1.05-.37-2.01-1-2.76-.5-.6-1.2-1.04-2-1.26a6.4 6.4 0 015.28 3.02c-.5.6-1.2 1.04-2 1.26-.5.14-1.03.22-1.57.22z"/>
      </svg>
    ),
  },
  {
    id: "alipay" as const,
    label: "支付宝",
    desc: "推荐",
    color: "#1677ff",
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
    <div className="page-dark">
      <Navbar />
      <div className="max-w-[520px] mx-auto px-6 pt-24 pb-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-2">开通会员</h1>
          <p className="text-white/40">解锁 Flexichrono 全部高级功能</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Plans */}
              <div className="card-dark p-4 mb-3">
                <div className="section-title-dark px-1 mb-3">选择套餐</div>
                <div className="space-y-2">
                  {PLANS.map((plan, i) => (
                    <motion.div
                      key={plan.id}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                        selectedPlan.id === plan.id
                          ? "border-[rgba(0,200,136,0.5)] bg-[rgba(0,200,136,0.06)]"
                          : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.12)]"
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                        selectedPlan.id === plan.id ? "border-[#00c888] bg-[#00c888]" : "border-white/20"
                      }`}>
                        {selectedPlan.id === plan.id && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm flex items-center gap-2">
                          {plan.name}
                          {plan.badge && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(0,200,136,0.15)] text-[#00c888] border border-[rgba(0,200,136,0.3)]">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-white/30 text-xs mt-0.5">{plan.periodLabel}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">¥{plan.price}</div>
                        {(i === 0 || i === 1) && (
                          <div className="text-white/20 text-xs line-through">¥{i === 0 ? "9.9" : "29.7"}</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Pay method */}
              <div className="card-dark p-4 mb-3">
                <div className="section-title-dark px-1 mb-3">支付方式</div>
                <div className="space-y-1">
                  {PAY_METHODS.map((m) => (
                    <motion.div
                      key={m.id}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                        payMethod === m.id
                          ? "border-[rgba(0,200,136,0.5)] bg-[rgba(0,200,136,0.06)]"
                          : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.12)]"
                      }`}
                      onClick={() => setPayMethod(m.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex-shrink-0">{m.icon}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{m.label}</div>
                        {m.desc && <div className="text-white/30 text-xs">{m.desc}</div>}
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        payMethod === m.id ? `border-[${m.color}] bg-[${m.color}]` : "border-white/20"
                      }`}>
                        {payMethod === m.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Phone + Code */}
              <div className="card-dark p-4 mb-4">
                <div className="section-title-dark px-1 mb-3">验证手机号</div>
                <div className="flex items-center border-b border-[rgba(255,255,255,0.07)] py-3 gap-3">
                  <span className="text-sm text-white/50 flex-shrink-0 w-14">手机号</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    placeholder="请输入手机号"
                    maxLength={11}
                    className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/20"
                  />
                </div>
                <div className="flex items-center py-3 gap-3">
                  <span className="text-sm text-white/50 flex-shrink-0 w-14">验证码</span>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6位验证码"
                    maxLength={6}
                    className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/20"
                  />
                  <button
                    className="text-sm text-[#00c888] bg-transparent border-none cursor-pointer whitespace-nowrap disabled:text-white/20 disabled:cursor-not-allowed transition-colors hover:text-[#00d49a]"
                    onClick={sendCode}
                    disabled={codeLoading || !phone || phone.length !== 11 || countdown > 0}
                  >
                    {countdown > 0 ? `${countdown}s` : "获取验证码"}
                  </button>
                </div>
                <div className="text-xs text-white/20 px-1">演示模式：任意6位数字即可</div>
              </div>

              {/* Confirm */}
              <motion.button
                className="btn-primary-dark mb-3"
                onClick={startPayment}
                disabled={payLoading || !canSubmit}
                whileTap={{ scale: 0.98 }}
              >
                {payLoading ? "跳转支付..." : `确认支付 ¥${selectedPlan.price}`}
              </motion.button>

              <div className="text-center text-xs text-white/20 mt-3">
                支付安全由微信/支付宝提供保障
              </div>
            </motion.div>
          )}

          {step === "qrcode" && (
            <motion.div
              key="qrcode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="card-dark p-8 text-center"
            >
              <h2 className="text-xl font-semibold text-white mb-1">请扫码支付</h2>
              <p className="text-white/40 text-sm mb-6">
                扫码支付 <span className="text-[#00c888] font-medium">¥{selectedPlan.price}</span>
              </p>

              {/* QR Code */}
              <div className="inline-block p-4 rounded-2xl bg-white mb-6">
                <img src={qrUrl} alt="支付二维码" width={180} height={180} className="block" />
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-white/40 mb-5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00c888] animate-pulse" />
                  等待支付
                </div>
                <div>订单号 {orderId.slice(0, 16)}...</div>
              </div>

              <p className="text-xs text-white/20 mb-5">
                {payMethod === "wechat" ? "请用微信扫一扫" : "请用支付宝扫一扫"}，支付成功后自动开通
              </p>

              <button
                className="btn-secondary-dark"
                onClick={() => {
                  if (pollTimer) clearInterval(pollTimer);
                  setStep("form");
                }}
              >
                返回重新选择
              </button>
            </motion.div>
          )}

          {step === "paid" && (
            <motion.div
              key="paid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="card-dark p-10 text-center"
            >
              {/* Success animation */}
              <motion.div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: "rgba(0,200,136,0.12)", border: "1px solid rgba(0,200,136,0.3)" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                支付成功
              </motion.h2>
              <p className="text-white/50 text-sm mb-1">您已成为 {selectedPlan.name}</p>
              <p className="text-white/30 text-xs mb-8">有效期 {selectedPlan.periodLabel}，会员权益已开通</p>

              <div className="space-y-3">
                <Link href="/membership" className="btn-primary-dark block">
                  查看会员状态
                </Link>
                <Link href="/" className="btn-secondary-dark block">
                  返回首页
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
