"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { PLANS } from "@/lib/pay";

type OrderStatus = "idle" | "pending" | "paid" | "failed";

function getReturnUrl() {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/membership`;
}

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[2]); // 年度默认
  const [selectedMethod, setSelectedMethod] = useState<"wechat" | "alipay" | "paypal">("alipay");
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [pollTimer, setPollTimer] = useState<NodeJS.Timeout | null>(null);
  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      let uid = localStorage.getItem("bbxz_uid");
      if (!uid) {
        uid = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
        localStorage.setItem("bbxz_uid", uid);
      }
      return uid;
    }
    return "";
  });

  const pollOrder = useCallback(
    async (oid: string) => {
      try {
        const res = await fetch("/api/pay/poll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: oid, userId }),
        });
        const data = await res.json();
        if (data.status === "paid") {
          setOrderStatus("paid");
          setQrUrl(null);
          if (pollTimer) clearInterval(pollTimer);
          return;
        }
        if (data.status === "failed") {
          setOrderStatus("failed");
          if (pollTimer) clearInterval(pollTimer);
          return;
        }
      } catch {
        // 继续轮询
      }
    },
    [userId, pollTimer]
  );

  const handleSubscribe = async () => {
    setOrderStatus("pending");
    setQrUrl(null);

    try {
      const res = await fetch("/api/pay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          method: selectedMethod,
          userId,
        }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        console.error("[subscribe] create order failed:", data.error);
        setOrderStatus("failed");
        return;
      }

      setOrderId(data.orderId);

      // TODO: 真实二维码（商户号到位后）
      // if (data.qrUrl) setQrUrl(data.qrUrl);

      const timer = setInterval(() => pollOrder(data.orderId), 3000);
      setPollTimer(timer);

      setTimeout(() => {
        clearInterval(timer);
        if (orderStatus === "pending") setOrderStatus("idle");
      }, 10 * 60 * 1000);
    } catch (err) {
      console.error("[subscribe] error:", err);
      setOrderStatus("failed");
    }
  };

  useEffect(() => {
    return () => {
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [pollTimer]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="py-20 text-center">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            选择你的会员计划
          </h1>
          <p className="text-muted text-lg max-w-md mx-auto">
            解锁全部项目，随时取消。支付后会员立即生效。
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="container max-w-5xl mb-12">
        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isYearlyValue = plan.id === "yearly";
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`plan-card text-left relative ${
                  selectedPlan.id === plan.id ? "selected" : ""
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0071e3] text-white text-xs font-medium px-3 py-0.5 rounded-full whitespace-nowrap">
                    最划算
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-0.5">{plan.nameEn}</h3>
                  <p className="text-sm text-muted">{plan.name}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-semibold tracking-tight">
                    {plan.priceDisplay}
                  </span>
                  <span className="text-muted text-sm ml-1">
                    /{plan.id === "yearly" ? "年" : plan.id === "quarterly" ? "季度" : "月"}
                  </span>
                </div>
                <div className="h-px bg-[rgba(0,0,0,0.06)] mb-6" />
                <ul className="space-y-2">
                  <li className="text-sm text-muted flex items-center gap-2">
                    <span className="text-[#0071e3] text-xs">✓</span>
                    解锁全部项目
                  </li>
                  <li className="text-sm text-muted flex items-center gap-2">
                    <span className="text-[#0071e3] text-xs">✓</span>
                    持续更新维护
                  </li>
                  <li className="text-sm text-muted flex items-center gap-2">
                    <span className="text-[#0071e3] text-xs">✓</span>
                    {isYearlyValue ? "最优惠，相当于 ¥7.3/月" : `持续 ${plan.days} 天`}
                  </li>
                </ul>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment methods */}
      <div className="container max-w-3xl mb-12">
        <h2 className="text-2xl font-semibold mb-1">支付方式</h2>
        <p className="text-muted text-sm mb-6">选择你最方便的支付方式</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: "alipay",
              label: "支付宝",
              sub: "推荐",
              color: "#00A1E9",
            },
            {
              id: "wechat",
              label: "微信支付",
              sub: "便捷安全",
              color: "#07C160",
            },
            {
              id: "paypal",
              label: "PayPal",
              sub: "支持Visa/MC",
              color: "#003087",
            },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethod(m.id as "alipay" | "wechat" | "paypal")}
              className={`pay-method-btn ${selectedMethod === m.id ? "selected" : ""}`}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: m.color }}
              >
                {m.id === "alipay" ? "支" : m.id === "wechat" ? "微" : "P"}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-xs text-muted">{m.sub}</div>
              </div>
              {selectedMethod === m.id && (
                <div className="ml-auto">
                  <div className="w-5 h-5 rounded-full bg-[#0071e3] flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container max-w-3xl text-center mb-16">
        {orderStatus === "idle" && (
          <button onClick={handleSubscribe} className="btn-primary text-base px-12 py-4">
            立即开通 {selectedPlan.priceDisplay}
          </button>
        )}

        {orderStatus === "pending" && (
          <div className="inline-flex flex-col items-center gap-4 p-8">
            <div className="w-8 h-8 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="font-medium mb-1">等待支付</p>
              <p className="text-sm text-muted">
                请打开{selectedMethod === "alipay" ? "支付宝" : selectedMethod === "wechat" ? "微信" : "PayPal"}扫码支付
              </p>
              {orderId && (
                <p className="text-xs text-muted mt-2">订单号：{orderId}</p>
              )}
            </div>
            {qrUrl && (
              <div className="qr-container">
                <img src={qrUrl} alt="payment QR" width={200} />
              </div>
            )}
            <button
              onClick={() => {
                setOrderStatus("idle");
                if (pollTimer) clearInterval(pollTimer);
              }}
              className="text-sm text-muted hover:text-foreground transition-colors mt-2"
            >
              取消
            </button>
          </div>
        )}

        {orderStatus === "paid" && (
          <div className="inline-flex flex-col items-center gap-4 p-10">
            <div className="w-16 h-16 rounded-full bg-[#d1fae5] flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-1">支付成功</h3>
              <p className="text-muted">会员已开通，欢迎使用 BBXZ</p>
            </div>
            <Link href="/membership" className="btn-primary mt-2">
              查看会员权益
            </Link>
          </div>
        )}

        {orderStatus === "failed" && (
          <div className="inline-flex flex-col items-center gap-4 p-10">
            <div className="w-16 h-16 rounded-full bg-[#fee2e2] flex items-center justify-center">
              <span className="text-3xl">✕</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-1">下单失败</h3>
              <p className="text-muted">请稍后重试，或联系客服</p>
            </div>
            <button onClick={() => setOrderStatus("idle")} className="btn-secondary mt-2">
              重试
            </button>
          </div>
        )}
      </div>

      {/* Trust note */}
      <div className="text-center pb-16">
        <p className="text-xs text-[rgba(0,0,0,0.35)]">
          支付安全由微信支付、支付宝、PayPal 官方保障，资金直达商户账户
        </p>
      </div>

      {/* Footer */}
      <footer className="footer py-10 mt-auto">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted">© 2026 BBXZ. All rights reserved.</div>
          <div className="flex items-center gap-8">
            <Link href="/membership" className="text-sm text-muted hover:text-foreground transition-colors">
              会员
            </Link>
            <a href="mailto:contact@baobaoxz.com" className="text-sm text-muted hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
