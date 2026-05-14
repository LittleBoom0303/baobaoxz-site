"use client";
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
    // 简单的匿名用户ID，存localStorage
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

  // 轮询订单状态
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

  // 创建订单
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

      // 启动轮询（每3秒一次，最多10分钟）
      const timer = setInterval(() => pollOrder(data.orderId), 3000);
      setPollTimer(timer);

      // 10分钟后自动停止
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
    <div className="py-16">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-2">订阅 BBXZ 会员</h1>
        <p className="text-gray-400 text-center mb-12">
          解锁全部项目，随时取消。支付后会员立即生效。
        </p>

        {/* 套餐选择 */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`p-6 rounded-xl border text-left transition-all ${
                selectedPlan.id === plan.id
                  ? "border-[#10b981] bg-[#0d2017]"
                  : "border-[#222] bg-[#111] hover:border-[#333]"
              }`}
            >
              {plan.recommended && (
                <span className="inline-block text-xs bg-[#10b981] text-white px-2 py-0.5 rounded-full mb-2">
                  推荐
                </span>
              )}
              <h3 className="font-semibold mb-1">{plan.nameEn}</h3>
              <p className="text-gray-400 text-xs mb-3">{plan.name}</p>
              <div className="text-2xl font-bold">
                {plan.priceDisplay}
                <span className="text-sm text-gray-500 font-normal">/{plan.days}天</span>
              </div>
            </button>
          ))}
        </div>

        {/* 支付方式 */}
        <div className="mb-10">
          <h2 className="font-semibold mb-4">支付方式</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "alipay", label: "支付宝", icon: "💙" },
              { id: "wechat", label: "微信支付", icon: "🟢" },
              { id: "paypal", label: "PayPal", icon: "🟣" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id as "alipay" | "wechat" | "paypal")}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  selectedMethod === m.id
                    ? "border-[#10b981] bg-[#0d2017]"
                    : "border-[#222] bg-[#111] hover:border-[#333]"
                }`}
              >
                <span className="text-2xl">{m.icon}</span>
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 支付按钮 / 二维码 */}
        <div className="text-center">
          {orderStatus === "idle" && (
            <button
              onClick={handleSubscribe}
              className="bg-[#10b981] hover:bg-[#059669] text-white px-10 py-4 rounded-full text-lg font-semibold transition-colors"
            >
              立即订阅 {selectedPlan.priceDisplay}
            </button>
          )}

          {orderStatus === "pending" && (
            <div className="space-y-4">
              <div className="inline-flex flex-col items-center gap-3 p-6 bg-[#111] border border-[#222] rounded-xl">
                <div className="w-8 h-8 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">等待支付… 请打开{selectedMethod === "alipay" ? "支付宝" : selectedMethod === "wechat" ? "微信" : "PayPal"}扫码</p>
                {orderId && (
                  <p className="text-xs text-gray-600">订单号：{orderId}</p>
                )}
              </div>

              {/* TODO: 真实二维码（商户号到位后显示） */}
              {qrUrl && (
                <div className="qr-container inline-block mt-4">
                  {/* <img src={qrUrl} alt="payment QR" width={200} /> */}
                </div>
              )}

              <button
                onClick={() => {
                  setOrderStatus("idle");
                  if (pollTimer) clearInterval(pollTimer);
                }}
                className="block mx-auto text-gray-500 hover:text-white text-sm transition-colors mt-3"
              >
                取消
              </button>
            </div>
          )}

          {orderStatus === "paid" && (
            <div className="inline-flex flex-col items-center gap-3 p-8 bg-[#0d2017] border border-[#10b981] rounded-xl">
              <span className="text-4xl">✅</span>
              <h3 className="text-xl font-bold text-[#34d399]">支付成功！</h3>
              <p className="text-gray-400 text-sm">会员已激活，欢迎使用 BBXZ</p>
              <a
                href="/membership"
                className="mt-2 bg-[#10b981] hover:bg-[#059669] text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
              >
                查看会员权益
              </a>
            </div>
          )}

          {orderStatus === "failed" && (
            <div className="inline-flex flex-col items-center gap-3 p-8 bg-[#1f0d0d] border border-[#991b1b] rounded-xl">
              <span className="text-4xl">❌</span>
              <h3 className="text-xl font-bold text-red-400">下单失败</h3>
              <p className="text-gray-400 text-sm">请稍后重试，或联系客服</p>
              <button
                onClick={() => setOrderStatus("idle")}
                className="mt-2 border border-[#333] hover:border-[#555] text-white px-6 py-2 rounded-full text-sm transition-colors"
              >
                重试
              </button>
            </div>
          )}
        </div>

        {/* 提示 */}
        <p className="text-center text-gray-600 text-xs mt-8">
          {selectedMethod === "wechat" || selectedMethod === "alipay"
            ? "微信/支付宝支付由官方通道保障，资金直达商户账户，安全合规。"
            : "PayPal支付由PayPal保障，支持Visa/MasterCard。"}
        </p>
      </div>
    </div>
  );
}
