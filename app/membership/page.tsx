"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Plan = {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "yearly",
    name: "年度会员",
    price: 88,
    period: "1年",
    features: [
      "无限文字 / 语音对话",
      "音色克隆（30秒录音还原声音）",
      "多个 AI 角色切换",
      "云端聊天记录同步",
      "跨平台 Web/App 使用",
    ],
    recommended: true,
  },
];

// 模拟支付二维码（等执照下来后替换为真实微信/支付宝 API）
function mockQrCodeUrl(method: string, orderId: string) {
  // 返回一个占位图
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`FLEXI_${method.toUpperCase()}_${orderId}`)}`;
}

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[0]);
  const [payMethod, setPayMethod] = useState<"wechat" | "alipay" | "paypal">("wechat");
  const [step, setStep] = useState<"form" | "qrcode" | "paid">("form");
  const [orderId, setOrderId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeBtnText, setCodeBtnText] = useState("获取验证码");
  const [payLoading, setPayLoading] = useState(false);
  const [pollTimer, setPollTimer] = useState<ReturnType<typeof setInterval> | null>(null);

  // 清理轮询
  useEffect(() => {
    return () => {
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [pollTimer]);

  const sendCode = async () => {
    if (!phone || phone.length !== 11) return;
    setCodeLoading(true);
    try {
      const res = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        setCodeSent(true);
        let countdown = 60;
        const t = setInterval(() => {
          countdown--;
          setCodeBtnText(`${countdown}秒后重发`);
          if (countdown <= 0) {
            clearInterval(t);
            setCodeBtnText("获取验证码");
          }
        }, 1000);
      }
    } finally {
      setCodeLoading(false);
    }
  };

  const startPayment = async () => {
    if (!phone || phone.length !== 11 || !code || code.length !== 6) return;
    // 先验证手机号
    try {
      const verifyRes = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      if (!verifyRes.ok) {
        alert("验证码错误");
        return;
      }
    } catch {
      // 验证服务未上线，模拟通过
    }

    setPayLoading(true);
    try {
      const res = await fetch("/api/pay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: selectedPlan.id, phone }),
      });
      const data = await res.json();
      const oid = data.order_id || `ORDER_${Date.now()}`;
      setOrderId(oid);
      const url = mockQrCodeUrl(payMethod, oid);
      setQrUrl(url);
      setStep("qrcode");

      // 轮询支付状态
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

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-semibold tracking-tight mb-4">订阅会员</h1>
          <p className="text-xl text-neutral-500">解锁全部功能，用自己的声音和 AI 对话</p>
        </div>

        {step === "form" && (
          <div className="max-w-md mx-auto">
            {/* 套餐卡片 */}
            <div className="rounded-2xl border-2 border-blue-600 p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-blue-600 font-medium">{selectedPlan.name}</div>
                  <div className="text-4xl font-semibold mt-1">¥{selectedPlan.price}</div>
                  <div className="text-neutral-500 text-sm mt-1">{selectedPlan.period}</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium">
                  推荐
                </div>
              </div>
              <ul className="space-y-2.5 mt-6">
                {selectedPlan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-neutral-700">
                    <span className="text-green-500 text-lg">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* 支付方式 */}
            <div className="mb-8">
              <div className="text-sm font-medium text-neutral-500 mb-3">选择支付方式</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "wechat", label: "微信支付", icon: "💬" },
                  { id: "alipay", label: "支付宝", icon: "💙" },
                  { id: "paypal", label: "PayPal", icon: "🔵" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id as "wechat" | "alipay" | "paypal")}
                    className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition ${
                      payMethod === m.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 手机号 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">手机号</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="请输入 11 位手机号"
                maxLength={11}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* 验证码 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">验证码</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6 位验证码"
                  maxLength={6}
                  className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 text-lg outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendCode}
                  disabled={codeLoading || !phone || phone.length !== 11}
                  className="px-4 py-3 rounded-xl bg-neutral-100 text-neutral-600 text-sm font-medium whitespace-nowrap disabled:opacity-50 hover:bg-neutral-200 transition"
                >
                  {codeBtnText}
                </button>
              </div>
              <div className="text-xs text-neutral-400 mt-1.5">演示模式：任意 6 位数字验证码即可</div>
            </div>

            <button
              onClick={startPayment}
              disabled={payLoading || !phone || !code}
              className="w-full py-4 rounded-full bg-blue-600 text-white text-lg font-medium disabled:opacity-50 hover:bg-blue-700 transition"
            >
              {payLoading ? "跳转支付..." : `确认支付 ¥${selectedPlan.price}`}
            </button>

            <p className="text-xs text-neutral-400 text-center mt-4">
              订阅即表示同意我们的服务条款和隐私政策
            </p>
          </div>
        )}

        {step === "qrcode" && (
          <div className="max-w-sm mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-2">请扫码支付</h2>
            <p className="text-neutral-500 mb-8">
              {payMethod === "wechat" ? "微信" : payMethod === "alipay" ? "支付宝" : "PayPal"}
              扫码支付 <span className="font-semibold text-blue-600">¥{selectedPlan.price}</span>
            </p>

            <div className="inline-block p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="支付二维码" width={200} height={200} className="mx-auto" />
            </div>

            <div className="text-sm text-neutral-500 mb-4">
              订单号：{orderId}{" "}
              <button onClick={copyOrderId} className="text-blue-600 underline ml-1">
                复制
              </button>
            </div>

            {payMethod === "wechat" && (
              <p className="text-sm text-neutral-400 mb-6">
                用微信扫一扫上面的二维码完成支付
              </p>
            )}
            {payMethod === "alipay" && (
              <p className="text-sm text-neutral-400 mb-6">
                用支付宝扫一扫上面的二维码完成支付
              </p>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              等待支付...
            </div>

            <div className="text-xs text-neutral-400 mb-4">
              支付成功后页面将自动跳转<br />
              如有问题联系客服
            </div>

            <button
              onClick={() => {
                if (pollTimer) clearInterval(pollTimer);
                setStep("form");
              }}
              className="text-sm text-neutral-500 underline hover:text-neutral-700"
            >
              返回重新选择支付方式
            </button>
          </div>
        )}

        {step === "paid" && (
          <div className="max-w-sm mx-auto text-center py-12">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-semibold mb-3">支付成功！</h2>
            <p className="text-neutral-500 mb-2">
              您已成为年度会员，有效期 1 年
            </p>
            <p className="text-sm text-neutral-400 mb-10">
              会员权益已开通，可前往 App 使用全部功能
            </p>
            <div className="space-y-3">
              <Link
                href="/membership"
                className="block w-full py-3.5 rounded-full bg-blue-600 text-white font-medium text-lg hover:bg-blue-700 transition"
              >
                查看会员状态
              </Link>
              <button
                onClick={() => setStep("form")}
                className="block w-full py-3.5 rounded-full border border-neutral-200 text-neutral-600 font-medium"
              >
                返回首页
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
